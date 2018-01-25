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
        <el-form-item label="输入旧密码" prop="oldPass" v-if="!showCheck">
          <el-input v-model="ruleForm.oldPass" type="password" :maxlength="20"></el-input>
        </el-form-item>
        <template v-else>
          <el-form-item label="手机号" prop="mobileNumber">
            <el-input :value="ruleForm.mobileNumber" readonly></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code" class="checkCodeItem" :error="checkError">
            <el-input v-model="ruleForm.code" :maxlength="6">
              <el-button type="primary" slot="append" @click="sendMsg" :disabled="disableSend">{{checkText}}</el-button>
            </el-input>
          </el-form-item>
        </template>
        <el-form-item label="输入新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="再次输入" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" :maxlength="20"></el-input>
        </el-form-item>
        <div class="clearfix">
          <el-button :style="{'margin-left': labelWidth}" type="primary" @click="submitForm">提交</el-button>
          <span class="forgetPWD" @click="changeShowCheck">{{showCheck?'修改密码':'忘记密码'}}</span>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (value == this.ruleForm.oldPass) {
        callback(new Error('新老密码不能一致'))
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
        age: '',
        code: '',
        mobileNumber: ''
      },
      labelPosition: 'left',
      labelWidth: '120px',
      checkText: '发送验证码',
      remainingTime: 60,
      showCheck: false,
      disableSend: false,
      checkError: '',
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
        ],
        code: [{ required: true, message: '请输入验证码' }],
        mobileNumber: [{ required: true, message: '请在简历中完善手机号' }],
      }
    };
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'isReady'
    ])
  },
  created() {
    if (this.isReady) {
      this.ruleForm.mobileNumber = this.userInfo.mobileNumber;
    }
  },
  watch: {
    isReady: function(val) {
      if (val) {
        this.ruleForm.mobileNumber = this.userInfo.mobileNumber;
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.showCheck) {           
            this.checkCode()
          } else {
            this.updateAccount();
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm.mobileNumber = this.userInfo.mobileNumber;
    },
    sendMsg() {
      this.disableSend = true;
      this.$refs.ruleForm.validateField('mobileNumber', error => {
        if (!error) {
          this.$http.post('api/sendMsg?phone=' + this.ruleForm.mobileNumber + '&type=5').then(
            res => {
              if (res.status == 0) {
                this.checkText = this.remainingTime + "后重新获取";
                var interval = setInterval(() => {
                  this.remainingTime--;
                  this.checkText = this.remainingTime + "后重新获取";
                  if (this.remainingTime <= 0) {
                    clearInterval(interval);
                    this.checkText = '重新发送';
                    this.disableSend = false;
                    this.remainingTime = 60;
                  }
                }, 1000)
              } else {
                this.checkText = '重新发送';
                this.disableSend = false;
                this.remainingTime = 60;
                this.$message.error(res.message);
              }
            }
          )
        }
      })
    },
    checkCode() {
      this.checkError = '';
      this.$http.post('/api/checkCode', { phone: this.ruleForm.mobileNumber, vcode: this.ruleForm.code })
        .then(res => {
          if (res.status == 0) {           
            this.updateAccount();
          } else {
            this.checkError = res.message;
            // this.$message.error(res.message);
          }
        })
    },
    updateAccount() {
      var params = {
        workNo: this.userInfo.workNo,
        newPassword: this.ruleForm.pass
      }
      if (!this.showCheck) {
        params.password = this.ruleForm.oldPass;
      }
      this.$http.post('/salary/updateSalaryAccount', params)
        .then((res) => {
          if (res.status == '0') {
            this.$message.success('个人密码修改成功')
            this.resetForm();
          } else {
            this.$message.error(res.message)
          }
        })
    },
    changeShowCheck(){
      this.resetForm();
      this.showCheck=!this.showCheck;
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
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
  .forgetPWD {
    // float: right;
    line-height: 45px;
    color: $main;
    margin-left: 120px;
    cursor: pointer;
  }
  .el-form-item.is-required .el-form-item__label:before {
    content: none
  }
  .checkCodeItem {
    .el-input-group__append {
      border-radius: 0;
      background-color: transparent;
      .el-button {
        width: 120px;
        background-color: $main;
        color: #fff;
        border-radius: 0;
        height: 46px;
      }
      .el-button.is-disabled,
      .el-button.is-disabled:hover,
      .el-button.is-disabled:focus {
        color: rgb(191, 202, 217);
        cursor: not-allowed;
        background-image: none;
        background-color: rgb(238, 241, 246);
        border-color: rgb(209, 218, 229);
      }
    }
  }
}

</style>
