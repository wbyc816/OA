<template>
  <div id='SMSApp' class="commonApp" v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span>新建短信</span>
      </div>
      <div class="docBaseBox doc-section">
        <!-- <h4 class='doc-form_title'>信息填写</h4> -->
        <el-form label-position="left" :model="appForm" :rules="rules" ref="appForm" label-width="128px">
          <el-form-item label="短信接收员工" prop="person" class="reciverWrap clearBoth">
            <div class="reciverList">
              <el-tag :key="person.id" type="primary" @close="closePerson(index)" v-for="(person,index) in appForm.person">
                {{person.name}}
              </el-tag>
            </div>
            <el-button class="addButton" @click="signDialogVisible=true"><i class="el-icon-plus"></i></el-button>
          </el-form-item>
          <el-form-item label="自定义号码">
            <div class="customNumBox">
              <el-tag :key="num" type="primary" :closable="true" @close="closeCustomNum(index)" v-for="(num,index) in customNums">{{num}}</el-tag>
              <el-form :model="inputForm" :rules="inputRules" v-if="inputVisible" ref="inputForm" label-width="0px">
                <el-form-item prop="inputValue">
                  <el-input class="input-new-tag" v-model="inputForm.inputValue" ref="saveTagInput" size="mini" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" :maxlength="11">
                  </el-input>
                </el-form-item>
              </el-form>
              <el-button v-else class="button-new-tag" size="small" @click="showInput" icon="plus">添加</el-button>
            </div>
          </el-form-item>
          <el-form-item label="短信内容" prop="messageContent">
            <el-input type="textarea" :rows="8" resize='none' v-model="appForm.messageContent" :maxlength="100"></el-input>
          </el-form-item>
        </el-form>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" @click="submitApp">发送</el-button>
        </div>
      </div>
    </el-card>
    <transfer-dialog :visible.sync="signDialogVisible" @update="updatePerson" :data="appForm.person"></transfer-dialog>
  </div>
</template>
<script>
import TransferDialog from '../../components/transferDialog.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name:'SMSApp',
  components: {
    TransferDialog
  },
  data() {
    var checkNum = (rule, value, callback) => {
      if (this.customNums.indexOf(value) === -1) {
        callback();
      } else {
        callback(new Error('不能添加相同的号码'))
      }
    };
    return {
      signDialogVisible: false,
      appForm: {
        messageContent: '',
        person: [],
      },
      inputForm: {
        inputValue: ''
      },
      inputRules: {
        inputValue: [{ validator: this.validatePhone, trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }]
      },
      rules: {
        // person: [{ type: 'array', required: true, message: '请选择人员' }, ],
        messageContent: [{ required: true, message: '请输入短信内容', trigger: 'blur,change' }]
      },
      submitLoading: false,
      customNums: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {

    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    if (!this.userInfo.isDocsec || this.userInfo.isDocsec[0] != 1) {
      // this.$router.push('/meeting/meetingSearch/1')
    }
  },
  methods: {
    updatePerson(list) {
      // console.log(list)
      this.appForm.person = this.clone(list);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      if (this.inputForm.inputValue && this.inputForm.inputValue.length !== 0) {
        this.$refs.inputForm.validate((valid) => {
          if (valid) {
            this.customNums.push(this.inputForm.inputValue);
            this.inputVisible = false;
            this.inputForm.inputValue = '';
          }
        })
      } else {
        this.inputVisible = false;
      }
    },
    closePerson(index) {
      this.appForm.person.splice(index, 1);
    },
    closeCustomNum(index) {
      this.customNums.splice(index, 1);
    },
    submitApp() {
      this.$refs.appForm.validate((valid) => {
        if (valid) {
          this.postApp();
        } else {
          this.$message.warning('请检查填写字段')
          return false;
        }
      });
    },
    postApp() {
      this.submitLoading = true;
      var smsDetails = this.appForm.person.map(function(person) {
        return {
          "reciUserId": person.empId,
          "reciUserName": person.name,
          "reciDeptId": person.fatherId,
          "reciDeptName": person.deptName,
          "reciDeptMajorId": person.parentDeptId,
          "reciDeptMajorName": person.fatherName,
          "mobileNumber": person.phone,
        }
      })
      var customDetails = this.customNums.map(function(num) {
        return { mobileNumber: num }
      })
      var params = {
        smsSend: {
          "sendUserId": this.userInfo.empId,
          "content": this.appForm.messageContent,
          "sendUserName": this.userInfo.name,
          "sendDeptId": this.userInfo.deptId,
          "sendDeptName": this.userInfo.depts,
          "sendDeptMajorId": this.userInfo.deptParentId,
          "sendDeptMajorName": this.userInfo.deptParentName,
        },
        smsDetails: smsDetails.concat(customDetails)
      }
      this.$http.post('/tSmsSend/sendSms', params, { body: true })
        .then(res => {
          this.submitLoading = false;
          if (res.status == 0) {
            this.$message.success('提交成功！');
            this.$router.push('/SMS/mySMS');
          } else {
            this.$message.error(res.message);
          }
        })
    }
  }
}

</script>
<style lang='scss'>
#SMSApp {
  .docBaseBox {
    padding-right: 150px;
    border-bottom: none;
    .el-form-item__error {
      padding-left: 6px;
    }
    .el-radio-button__inner {
      width: 100px;
      height: 45px;
      line-height: 45px;
      padding: 0;
    }
    .reciverList {
      max-height: 250px;
      overflow-y: auto;
    }
  }
  .customNumBox {
    padding-top: 4px;
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
      font-size: 13px;
      border-radius: 3px;
      .el-icon-plus {
        font-size: 12px;
      }
    }
    .el-form {
      display: inline-block;
      .input-new-tag {
        width: 125px;
        line-height: 24px;
        input {
          border-radius: 3px;
          height: 24px;
        }
      }
    }
  }
  .doc-form-submit_btn {
    button {
      margin-left: 128px;
      width: 160px;
      height: 50px;
    }
  }
}

</style>
