<template>
  <div id="phoneNumber">
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="4">
            修改手机号码
          </el-col>
        </el-row>
      </div>
      <el-form :label-position="labelPosition" :label-width="labelWidth" :model="ruleForm" ref="ruleForm" :rules="rules">
        <el-form-item label="输入登录密码" prop="pass">
          <el-input v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="输入手机号码" prop="mobile">
          <el-input v-model="ruleForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="authCode">
          <el-input class="authInput" v-model="ruleForm.authCode"></el-input>
          <el-button class="authBtn" :disabled="authMsg.disableAuth" @click="getAuth(authMsg.defaultInterval)" type="primary">{{authMsg.msg}}</el-button>
        </el-form-item>
        <el-button @click="submitForm('ruleForm')" type="primary" :style="{'margin-left': labelWidth}">提交</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
const localStorage = window.localStorage;

export default {
  data() {
    var validateMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else if (!(/^1[34578]\d{9}$/.test(value))) {
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
      authMsg: '发送验证码',
      labelPosition: 'left',
      labelWidth: '150px',
      rules: {
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        authCode: [
          { type: 'number', required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      authMsg: {
        msg: '发送验证码',
        disableAuth: false,
        defaultInterval: 60
      }
    }
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    getAuth(remainingTime, refresh = false) {
      if (refresh) {
        this.countDown(remainingTime)
      } else {
        if ((/^1[34578]\d{9}$/.test(this.ruleForm.mobile))) {
          localStorage.setItem('dhair', new Date().getTime());
          this.countDown(remainingTime)
          this.$http.post().then(
            (data) => {
              if (data.status == '0') {
                this.$message.success('手机号码修改成功')
                this.resetForm('ruleForm')
              } else {
                this.$message.error(data.message)
              }
            })
        } else {
          this.$message.error('手机号码不正确')
        }
      }
    },
    countDown(remainingTime) {
      this.authMsg.disableAuth = true
      new Promise((resolve, reject) => {    //  验证码倒计时实现
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/color.scss';

#phoneNumber {
  .el-form {
    .el-input {
      width: 330px;
      margin-right: 0;
    }
    .authBtn {
      width: 90px;
      font-size: 14px;
      transform: translateX(-94px); // padding-right: 30px;
      text-align: center;
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
