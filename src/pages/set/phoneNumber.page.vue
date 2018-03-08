<template>
  <div id="phoneNumber">
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="4">修改手机号码</el-col>
        </el-row>
      </div>
      <el-form :label-position="labelPosition" :label-width="labelWidth" :model="ruleForm" ref="ruleForm" :rules="rules">
        <el-form-item label="输入登录密码" prop="pass" :error="passError">
          <el-input v-model="ruleForm.pass" :maxlength="20" type="password"></el-input>
        </el-form-item>
        <el-form-item label="输入新手机号码" prop="mobile">
          <el-input v-model="ruleForm.mobile" :maxlength="11"></el-input>
        </el-form-item>
        <!-- <el-form-item label="验证码" prop="authCode">
          <el-input class="authInput" v-model="ruleForm.authCode"></el-input>
          <el-button class="authBtn" :disabled="authMsg.disableAuth" @click="getAuth(authMsg.defaultInterval)" type="primary">{{authMsg.msg}}</el-button>
        </el-form-item> -->
        <el-button @click="submitForm" type="primary" :disabled="submiting" :style="{'margin-left': labelWidth}">提交</el-button>
      </el-form>
    </el-card>
  </div>
</template>
<script>
const localStorage = window.localStorage;
import { mapGetters } from 'vuex'

export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else if (!(/^1[345678]\d{9}$/.test(value))) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        pass: '',
        mobile: '',
        authCode: ''
      },
      labelPosition: 'left',
      labelWidth: '150px',
      rules: {
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur', }
        ],
        authCode: [
          { type: 'number', required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      authMsg: {
        msg: '发送验证码',
        disableAuth: false,
        defaultInterval: 60
      },
      passError: '',
      submiting: false
    }
  },
  computed: {

    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    if (localStorage.getItem('dhair')) {
      let timeGone = (new Date().getTime() - localStorage.getItem('dhair')) / 1000;
      timeGone = Math.round(timeGone);
      if (timeGone < this.authMsg.defaultInterval) {
        this.getAuth(this.authMsg.defaultInterval - timeGone, true)
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.submiting) {
            this.submiting = true;
            this.passError='';
            this.checkPass()
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    checkPass() {
      this.$http.post('/emp/login', { password: this.ruleForm.pass, workNo: this.userInfo.workNo })
        .then(res => {
          if (res.status == 0) {
            this.updateNum();
          } else {
            this.submiting = false;
            this.passError = res.message;
          }
        })
    },
    updateNum() {
      this.$http.post('/emp/mobileNumberUpdate', { mobileNumber: this.ruleForm.mobile, empId: this.userInfo.empId })
        .then(res => {
          this.submiting = false;
          if (res.status == 0) {
            this.$message.success('修改成功！');
            this.$refs.ruleForm.resetFields()
          } else {
            this.$message.error(res.message);
          }
        })
    },
    getAuth(remainingTime, refresh = false) {
      if (refresh) {
        this.countDown(remainingTime)
      } else {
        this.$refs.ruleForm.validateField('mobile', errorMessage => {
          if (!errorMessage) {
            localStorage.setItem('dhair', new Date().getTime());
            this.countDown(remainingTime)
            this.$http.post().then(
              (res) => {
                if (res.status == '0') {
                  this.$message.success('手机号码修改成功')
                  this.$refs.ruleForm.resetFields()
                } else {
                  this.$message.error(res.message)
                }
              })
          }
        })

      }
    },
    countDown(remainingTime) {
      this.authMsg.disableAuth = true
      new Promise((resolve, reject) => { //  验证码倒计时实现
        this.authMsg.msg = remainingTime;
        let interval = setInterval(() => {
          remainingTime--;
          this.authMsg.msg = remainingTime;
          if (remainingTime <= 0) {
            resolve();
            clearInterval(interval)
          }
        }, 1000)
      }).then((params) => {
        this.authMsg.msg = '重新发送';
        this.authMsg.disableAuth = false;
      });
    }
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;
$lan:#0460AE;
$sub:#1465C0;
$line: #D5DADF;

#phoneNumber {
  .el-form {
    .el-input {
      width: 330px;
      margin-right: 0;
    }
    .authBtn {
      width: 110px;
      height: 47px;
      font-size: 14px;
      right: 113px;
      position: relative;
      top: -2px;
      span {
        text-indent: 20px;
      }
    }
    .authBtn:disabled {
      background-color: $main;
      opacity: .8
    }
  }
  .el-button {
    width: 17%;
    height: 45px;
    border-radius: 2px
  }
  .el-form-item__label:before {
    content: ''
  }
}

</style>
