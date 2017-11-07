<template>
  <div class="salaryDialog">
    <el-dialog title="验证个人密码" size="tiny" :visible.sync="salaryDialogVisible" @close="close">
		  <el-form :model="passwordValidateForm" ref="passwordValidateForm" label-width="100px" class="demo-ruleForm">
        <el-form-item
          label="个人密码"
          prop="password"
          :rules="[
            { required: true, message: '个人密码不能为空'}
          ]"
        >
          <el-input type="password" v-model.number="passwordValidateForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passwordValidateForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      salaryDialogVisible:false,
      password:"",
      passwordValidateForm: {
          password: ''
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    'visible': function(newVal) {
      console.log(newVal);
      this.salaryDialogVisible = newVal;
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {

  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("/salary/verifySalaryAccount", {
            // empId:'B38E5FF5F816AC6E4169BCE9314B2996',
            workNo:this.userInfo.workNo,
            password:this.passwordValidateForm.password
          }).then(res=>{
            if (res.status == 0) {
              this.setCookie('salaryAccount',this.userInfo.empId,10/60/24);
              this.$emit('updateSalary', true);
              this.$emit('update:visible', false)
            }else{
              this.$message.error(res.message);
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
<style lang='scss'>
  .salaryDialog{
    .el-dialog{
      width:30%!important;
      border-radius: 0!important;
      .el-dialog__header{
        text-align: left!important;
        padding:0 20px!important;
        border-bottom: 1px solid #EAEAEA;
        .el-dialog__title{
          font-size: 18px!important;
          color:#393939!important;
        }
        .el-dialog__headerbtn{
          margin-top:15px;
        }
      }
      .el-dialog__body{
        .el-form-item__label{
          text-align: left;
          font-size: 15px!important;
          color:#0460AE!important;
        }
      }
      .el-dialog__footer{
        button{
          background: #0460AE!important;
          border-radius: 0!important;
        }
      }
    }
  }
</style>