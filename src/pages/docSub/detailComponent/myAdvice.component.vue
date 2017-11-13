<template>
  <div class='myAdvice'>
    <h4 class='doc-form_title'>我的审批意见</h4>
    <el-form label-position="left" label-width="128px" :model="ruleForm" :rules="rules" ref="ruleForm">
      <el-form-item label="审批意见" class="textarea" prop="state">
        <el-col :span='18'>
          <el-radio-group class="myRadio" v-model="ruleForm.state" @change="adviceChange">
            <el-radio-button label="1">同意<i></i></el-radio-button>
            <el-radio-button label="2">不同意<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item label="审批类型" class="textarea" v-if="showSignType">
        <el-col :span='18'>
          <el-radio-group class="myRadio" v-model="signType" @change="signTypeChange">
            <el-radio-button label="0">审批<i></i></el-radio-button>
            <el-radio-button label="1" :disabled="chooseDisable" v-if="docDetail.isDept==1">部门会签<i></i></el-radio-button>
            <el-radio-button label="2" :disabled="chooseDisable" v-if="docDetail.isPerson==1">人员会签<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
      </el-form-item>
      <el-form-item class="textarea signWrap" label="接收人" prop="sign" v-if="!(currentView=='LZS'&&docDetail.isDept==1)">
        <el-col :span='18' class="clearfix">
          <el-input class="search" :value="ruleForm.sign[0]?ruleForm.sign[0].signUserName:''" :readonly="true" v-show="signType==0">
            <el-button slot="append" @click="selSignPerson" :disabled="chooseDisable">选择</el-button>
          </el-input>
          <div class="signList" v-show="signType!=0">
            <el-tag :key="person.id" :closable="true" type="primary" @close="closeSign(index)" v-for="(person,index) in ruleForm.sign" v-show="signType==1">
              {{person.signDeptMajorName}}
            </el-tag>
            <el-tag :key="person.empId" :closable="true" type="primary" @close="closeSign(index)" v-for="(person,index) in ruleForm.sign" v-show="signType==2">
              {{person.signUserName}}
            </el-tag>
          </div>
          <el-button class="addButton" @click="selSignPerson" v-show="signType==1||signType==2"><i class="el-icon-plus"></i></el-button>
        </el-col>
      </el-form-item>
      <el-form-item label="建议路径" class="textarea">
        <el-col :span='18'>
          <p class="textContent suggestHtml" v-html="suggestHtml" style="padding-top: 5px;"></p>
        </el-col>
      </el-form-item>
      <el-form-item label="审批内容" class="textarea">
        <el-col :span='18'>
          <el-input type="textarea" v-model="ruleForm.taskContent" resize="none" :rows="8" :maxlength="500"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="约定离职日期" class="textarea" prop="planDate" v-if="currentView=='LZS'&&docDetail.isDept==1">
        <el-col :span='18'>
          <el-date-picker v-model="ruleForm.planDate" type="date" placeholder="选择离职日期" :picker-options="pickerOptions0" style="width:100%">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span='18'>
          <el-button type="primary" size="large" class="submitButton" @click="submit">提交</el-button>
          <slot name="docArchive"></slot>
        </el-col>
      </el-form-item>
    </el-form>
    <person-dialog @updatePerson="updatePerson" :admin="docDetail.isAdmin==1?'1':'0'" :visible.sync="dialogTableVisible" dialogType="radio"></person-dialog>
    <person-dialog @updatePerson="updateSignPerson" :admin="docDetail.isAdmin==1?'1':'0'" :visible.sync="signPersonVisible" dialogType="multi" :data="signPersons"></person-dialog>
    <dep-dialog :dialogVisible.sync="signDepVisible" :data="signDeps" dialogType="multi" @updateDep="updateSignDep"></dep-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PersonDialog from '../../../components/personDialog.component'
import DepDialog from '../../../components/depDialog.component'

const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
const signFlag = '<i class="signFlag">#</i>'

export default {
  components: {
    PersonDialog,
    DepDialog
  },
  props: {
    docDetail: {
      type: Object
    },
    suggests: ''
  },
  data() {
    var checkSign = (rule, value, callback) => {
      if (this.signType == 1 || this.signType == 2) {
        if (value.length != 0) {
          callback();
        } else {
          if (this.signType == 1) {
            callback(new Error('请选择至少一个会签部门'))
          } else {
            callback(new Error('请选择至少一个会签接收人'))

          }
        }
      } else {
        if (value.length != 0) {
          callback();
        } else {
          callback(new Error('请选择接收人'))
        }
      }
    };
    return {
      ruleForm: {
        taskContent: '',
        state: '',
        sign: [],
        planDate: ''
      },
      rules: {
        sign: [{ type: 'array', validator: checkSign, required: true }],
        state: [{ required: true, message: '请选择审批意见' }],
        planDate: [{ required: true, type: 'date', message: '请选择离职日期' }]
      },
      dialogTableVisible: false,
      reciver: '',
      signType: '0',
      currentView: '',
      signDepVisible: false,
      signPersonVisible: false,
      chooseDisable: false,
      workState: '',
      suggestHtml: '',
      signPersons: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      signDeps: []
    }
  },
  computed: {
    showSignType() {
      if (this.docDetail != {}) {
        if (this.currentView == 'LZS' && this.docDetail.isDept == 1) {
          return false
        } else {
          return this.docDetail.isDept == 1 || this.docDetail.isPerson == 1 && this.docDetail.signDoc == 0
        }
      } else {
        return false
      }
    },
    ...mapGetters([
      'userInfo',
      'submitLoading'
    ])
  },
  created() {
    this.currentView = this.docDetail.pageCode;
    if (this.docDetail.defaultSuggestVo.reciUserId) {
      this.handleReciver(this.docDetail.defaultSuggestVo); //设置收件人，固定流
    } else {
      this.getDefaultReciver()
    }
    this.handleSuggest();
  },
  methods: {
    getDefaultReciver() {
      this.$http.post('/doc/getDefaultRecipent', { docTypeCode: this.$route.query.code, empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            this.reciver = res.data;
            this.ruleForm.sign.push({
              signUserName: res.data.reciUserName
            });
          } else {

          }
        })
    },
    closeSign(index) {
      this.ruleForm.sign.splice(index, 1);
      if (this.signType == 1) {
        this.signDeps.splice(index, 1)
      }
    },
    handleReciver(vo) {
      this.reciver = vo;
      this.ruleForm.sign.push({
        signUserName: vo.reciUserName
      });
      this.workState = vo.workState;
      this.chooseDisable = true;
    },
    adviceChange(val) {
      if (val == 1) {
        this.ruleForm.taskContent = '同意。'
      } else {
        this.ruleForm.taskContent = "不同意。"
      }
    },
    signTypeChange(val) {
      this.ruleForm.sign = [];
      this.signDeps = [];
      this.$refs.ruleForm.validateField('sign')
    },
    updatePerson(payLoad) {
      this.dialogTableVisible = false;
      var person = {
        "signDeptMajorName": payLoad.reciDeptMajorName,
        "signDeptMajorId": payLoad.reciDeptMajorId,
        "signDeptName": payLoad.reciDeptName,
        "signDeptId": payLoad.reciDeptId,
        "signUserName": payLoad.reciUserName,
        "signUserId": payLoad.reciUserId,
      }
      if (this.ruleForm.sign.length != 0) {
        this.ruleForm.sign.splice(0, 1, person)
      } else {
        this.ruleForm.sign.push(person);
      }
      this.reciver = payLoad;
    },
    updateSignPerson(payLoad) {
      this.signPersonVisible = false;
      this.ruleForm.sign = [];
      this.signPersons = payLoad;
      payLoad.forEach(p => {
        this.ruleForm.sign.push({
          "signDeptMajorName": p.deptName,
          "signDeptMajorId": p.deptParentId,
          "signDeptName": p.depts,
          "signDeptId": p.deptId,
          "signUserName": p.name,
          "signUserId": p.empId,
        })
      })
    },
    updateSignDep(payLoad) {
      this.signDepVisible = false;
      this.ruleForm.sign = [];
      this.signDeps = payLoad;
      payLoad.forEach(p => {
        this.ruleForm.sign.push({
          "signDeptMajorName": p.name,
          "signDeptMajorId": p.id,
        })
      })
    },
    selSignPerson() {
      if (this.signType == 0) {
        this.dialogTableVisible = true;
      } else if (this.signType == 1) {
        this.signDepVisible = true;
      } else {
        this.signPersonVisible = true;
      }
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.docTask();
        } else {
          return false;
        }
      });
    },
    docTask() {
      var subType = this.signType;
      if (this.currentView == 'LZS') { //
        if (this.docDetail.isDept == 1) {
          subType = 1
        } else if (this.docDetail.isSign == 1) {
          subType = 2
        }
      }
      var params = {
        docId: this.docDetail.id,
        "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
        "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "taskDeptName": this.userInfo.deptVo.dept,
        "taskDeptId": this.userInfo.deptVo.deptId,
        "taskUserName": this.userInfo.name,
        "taskUserId": this.userInfo.empId,
        taskContent: this.ruleForm.taskContent,
        state: this.ruleForm.state,
        submitType: subType,
        operateType: '1',
        workState: this.workState
      }
      if (this.currentView == 'LZS' && this.docDetail.isDept == 1) {
        params.dimissionDate = +this.ruleForm.planDate;
      }
      if (this.signType == '0') {
        params.nextUserId = this.reciver.reciUserId;
        params.nextUserName = this.reciver.reciUserName;
      } else {
        params.signs = this.ruleForm.sign;
      }
      var url = "/doc/docTask";
      if (this.$route.query.code == 'LZS') { //离职审批
        url = '/doc/docDimissionTask'
      }
      this.$http.post(url, params, { body: true })
        .then(res => {
          if (res.status == '0') {
            this.$message.success('审批成功');
            this.$router.push('/doc/docTracking');
          } else {
            this.$message.error('审批失败，请重试');
          }
        }, res => {

        })
    },
    handleSuggest() {
      console.log(this.suggests)
      if (Array.isArray(this.suggests)) {
        var html = ''
        this.suggests.forEach((s, i, arr) => {
          if (s.nodeName == 'sign') {
            if (arr[i - 1].nodeName != 'sign') {
              html += signFlag + ' ' + s.typeIdName + ' ';
            } else if (arr[i + 1].nodeName != 'sign') {
              html += s.typeIdName + ' ' + signFlag + '' + arrowHtml;
            } else {
              html += s.typeIdName + ' ';
            }
          } else if (s.nodeName == 'trans') {
            if (arr[i - 1].nodeName != 'trans') {
              html += signFlag + ' ' + s.typeIdName + ' ';
            } else if (arr[i + 1].nodeName != 'trans') {
              html += s.typeIdName + ' ' + signFlag + '' + arrowHtml;
            } else {
              html += s.typeIdName + ' ';
            }
          } else {
            if (i == arr.length - 1) {
              html += s.typeIdName
            } else {
              html += s.typeIdName + arrowHtml
            }
          }
        })
        this.suggestHtml = html;
      }
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.myAdvice {
  .myRadio {
    line-height: 45px;
    .el-radio-button .el-radio-button__inner {
      height: 45px;
      width: 100px;
      line-height: 45px;
      padding: 0;
    }
  }
  .suggestHtml {
    i {
      color: $main;
      &.icon-jiantouyou {
        padding-right: 10px;
      }
      &.signFlag {
        font-style: normal;
      }
    }
  }
  .signWrap {
    .signList {
      width: 88%;
      float: left;
      min-height: 48px; // padding-top: 10px;
    }
    .addButton {
      float: right;
    }
  }
  .submitButton {
    width: 200px;
    border-radius: 3px;
  }
  .docArchiveButton {
    border-radius: 3px;
    float: right;
  }
}

</style>
