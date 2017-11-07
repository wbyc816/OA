<template>
  <div id="personalPsw">
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="4">
            修改个人密码
          </el-col>
        </el-row>
      </div>
      <el-form :label-position="labelPosition" :model="ruleForm" ref="ruleForm" :rules="rules" :label-width="labelWidth">
        <el-form-item label="输入旧密码" prop="oldPass">
          <el-input v-model="ruleForm.oldPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="输入新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password"></el-input>
        </el-form-item>
        <el-button :style="{'margin-left': labelWidth}" type="primary" @click="submitForm('ruleForm')">提交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '../../fetch/api'
import { mapGetters } from 'vuex'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value == this.ruleForm.oldPass) {
        callback(new Error('新老密码一致'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入的新密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        age: ''
      },
      labelPosition: 'left',
      labelWidth: '120px',
      rules: {
        oldPass: [
          { required: true, message: '请输入老密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        pass: [
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.updateSalaryAccount({
            workNo: this.userInfo.workNo,
            password: this.ruleForm.oldPass,
            newPassword: this.ruleForm.pass
          }).then((data) => {
            if (data.status == '0') {
              this.$message.success('个人密码修改成功')
              this.resetForm(formName)
            } else {
              this.$message.error(data.message)
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss">
#personalPsw {
  .el-form {
    .el-input {
      width: 330px
    }
  }
  .el-button {
    width: 150px;
    height: 45px;
    border-radius: 2px
  }
  .el-form-item.is-required .el-form-item__label:before {
    content: none
  }
}
</style>
