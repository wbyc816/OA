<template>
  <div id="docDetail">
    <el-card class="borderCard">
      <div slot="header">
        <span>{{docDetialInfo.doc.docTypeName}}</span>
      </div>
      <div class="baseInfoBox commonBox">
        <h4 class='doc-form_title'>公文信息</h4>
        <el-row>
          <el-col :span="24">
            <h1 class="title">公文号</h1>
            <p class="textContent">{{docDetialInfo.doc.docNo}}</p>
          </el-col>
          <el-col :span="12" class="rightBorder">
            <h1 class="title">呈报人</h1>
            <p class="textContent">{{docDetialInfo.doc.taskUserName}}</p>
          </el-col>
          <el-col :span="12">
            <h1 class="title">部门</h1>
            <p class="textContent">{{docDetialInfo.doc.taskDeptMajorName}}</p>
          </el-col>
          <el-col :span="12" class="rightBorder">
            <h1 class="title">密级程度</h1>
            <p class="textContent">{{docDetialInfo.doc.docDenseType}}</p>
          </el-col>
          <el-col :span="12">
            <h1 class="title">重要程度</h1>
            <p class="textContent">{{docDetialInfo.doc.docImportType}}</p>
          </el-col>
          <el-col :span="24" class="backV">
            <h1 class="title">标题</h1>
            <p class="textContent blackText">{{docDetialInfo.doc.docTitle}}</p>
          </el-col>
          <component v-bind:is="currentView" :info="docDetialInfo.otherInfo">
            <!-- 组件在 vm.currentview 变化时改变！ -->
          </component>
          <el-col :span="24" style="min-height:90px">
            <h1 class="title">请示内容</h1>
            <p class="textContent">{{docDetialInfo.doc.taskContent}}</p>
          </el-col>
          <el-col :span="24">
            <h1 class="title">建议路径</h1>
            <p class="textContent">{{docDetialInfo.doc.suggestPath}}</p>
          </el-col>
          <el-col :span="24">
            <h1 class="title">附件</h1>
            <p class="attch textContent">
              <template v-if="docDetialInfo&&docDetialInfo.taskFile.length>0">
                <p v-for="file in docDetialInfo.taskFile">{{file.fileName}}</p>
              </template>
            </p>
          </el-col>
          <el-col :span="24">
            <h1 class="title">附加公文</h1>
            <p class="attch textContent">
              <p v-for="file in docDetialInfo.taskQuote">{{file.quoteDocTitle}}</p>
            </p>
          </el-col>
        </el-row>
      </div>
      <div class='history commonBox'>
        <h4 class='doc-form_title'>历史审批意见</h4>
        <el-row class="backV" v-for="(task,index) in docDetialInfo.taskDetail" v-if="index!=0&&task.isFlag!=1">
          <!-- <el-col :span="1">&nbsp;</el-col> -->
          <el-col :span="23" :offset="1">{{task.taskContent}}</el-col>
          <el-col :span="23" class="timeRight">{{task.taskUserName}} {{task.startTime}}</el-col>
          <!-- <el-col :span="23" v-if="index==0">无</el-col> -->
        </el-row>
      </div>
      <div v-if="distData.length!=0">
        <h4 class='doc-form_title'>分发意见</h4>
        <el-table :data="topDistData" style="width: 100%" class="distTable" :stripe="true">
          <el-table-column prop="distUserName" label="分发人" width="100"></el-table-column>
          <el-table-column prop="reciveUserName" label="被分发人" width="100"></el-table-column>
          <el-table-column prop="content" label="分发人意见"></el-table-column>
          <el-table-column prop="distTime" label="分发时间" width="180"></el-table-column>
          <el-table-column prop="readTime" label="阅读时间" width="180"></el-table-column>
        </el-table>
        <el-collapse v-model="activeNames" @change="handleChange" class="moreButton" v-if="distData.length>3">
          <el-collapse-item title="查看更多记录" name="1">
          </el-collapse-item>
        </el-collapse>
        <div class="operateBox">
          <el-button type="primary" class="myButton" @click="DialogSubmitVisible=true">公文分发</el-button>
        </div>
      </div>
      <div class='myAdvice' v-if="docDetialInfo.doc.isTask==1">
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
          <el-form-item label="审批内容" class="textarea">
            <el-col :span='18'>
              <el-input type="textarea" v-model="ruleForm.taskContent" resize="none" :rows="8"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item class="textarea" label="收件人" prop="rec">
            <el-col :span='18'>
              <el-input class="search" v-model="ruleForm.rec" :readonly="true">
                <el-button slot="append" @click="selectPerson('radio')">选择</el-button>
              </el-input>
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-col :span='18'>
              <el-button type="primary" size="large" class="submitButton" @click="submit">提交</el-button>
              <el-button size="large" class="docArchiveButton" @click="DialogArchiveVisible=true" v-if="isAdmin"><i class="iconfont icon-archive"></i>归档</el-button>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-dialog :visible.sync="DialogArchiveVisible" size="small" class="myDialog" custom-class="archiveDialog">
      <span slot="title">公文归档</span>
      <div class="buttonBox">
        <el-button size="large" type="primary" @click="docArchive(true)">归档并结束</el-button>
        <el-button size="large" @click="docArchive(false)"><i class="iconfont icon-archive"></i>归档并分发</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="DialogSubmitVisible" size="small" class="myDialog" custom-class="archiveSubmitDialog" @close="DialogSubmitClose">
      <span slot="title">公文分发</span>
      <el-form label-position="left" :model="archiveForm" :rules="archiveFormRule" ref="archiveForm" label-width="75px">
        <el-form-item class='reciverWrap' label="收件人">
          <div class="reciverList">
            <el-tag type="primary" :closable="true" v-for="(person,index) in archiveForm.persons" @close="removePerson(index)">{{person.name}}</el-tag>
          </div>
          <el-button class="addButton" @click="selectPerson('multi')"><i class="el-icon-plus"></i></el-button>
        </el-form-item>
        <el-form-item label="分发意见" prop="res">
          <el-input type="textarea" :rows="6" resize='none' v-model="archiveForm.res"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="dialogSubmitButton" @click="dialogSubmit">分发</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <person-dialog @updatePerson="updatePerson" :visible.sync="dialogTableVisible" :dialogType="personDialogType"></person-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../components/personDialog.component'
import YCS from './component/vehicleDetail.component' //用车详情
import CLS from './component/materialDetail.component' //材料详情
import FWG from './component/manuscriptDetail.component' //材料详情
import CLV from './component/travelDetail.component' //差旅详情
import GSS from './component/injuryDetail.component' //工伤详情
import QJS from './component/vacationDetail.component' //休假详情
import RSB from './component/empChangeDetail.component' //人事变动详情
import JSS from './component/empUpgradeDetail.component' //晋升详情
import ZZS from './component/empBecomeDetail.component' //转正详情
import JJS from './component/empUpgradeDetail.component' //晋升详情
import { mapGetters } from 'vuex'

export default {
  components: {
    PersonDialog,
    YCS,
    CLS,
    FWG,
    CLV,
    GSS,
    QJS,
    RSB,
    JSS,
    ZZS,
    JJS
  },
  data() {
    return {
      dialogTableVisible: false,
      DialogArchiveVisible: false,
      DialogSubmitVisible: false,
      currentView: '',
      ruleForm: {
        taskContent: '',
        state: '',
        rec: ''
      },
      archiveForm: {
        res: '',
        persons: []
      },
      docDetialInfo: { doc: {}, task: [], taskDetail: [], taskFile: [], taskQuote: [], otherInfo: [] },
      rules: {
        rec: [
          { required: true, message: '请选择收件人' }

        ],
        state: [{
          required: true,
          message: '请选择审批意见'
        }]

      },
      reciver:'',
      archiveFormRule: {

      },
      personDialogType: 'radio',
      activeNames: [],
      topDistData: [],
      distData: [],
      isSuccessSubmit: false
    }
  },
  created() {
    this.$http.post("/doc/getDocDetailInfo", { id: this.$route.params.id, empId: this.userInfo.empId })
      .then(res => {
        if (res.status == 0) {
          this.docDetialInfo = res.data;
          this.currentView = this.docDetialInfo.doc.pageCode;
          if (this.docDetialInfo.task[0].state == 3 || this.docDetialInfo.task[0].state == 4) {
            this.getDistInfo();
          }
        }
      }, res => {

      })
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'isAdmin'
    ])
  },
  methods: {
    adviceChange(val) {
      if (val == 1) {
        this.ruleForm.taskContent = '同意。'
      } else {
        this.ruleForm.taskContent = "不同意。"
      }
    },
    selectPerson: function(val) {
      this.dialogTableVisible = true;
      this.personDialogType = val;
    },
    updatePerson(payLoad) {
      this.dialogTableVisible = false;
      if (this.personDialogType == 'radio') {
        this.ruleForm.rec = payLoad.reciUserName;
        this.reciver=payLoad;
      } else {
        this.archiveForm.persons = payLoad;
      }
      console.log(this.archiveForm.persons)
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
      var params = {
        docId: this.docDetialInfo.doc.id,
        "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
        "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "taskDeptName": this.userInfo.deptVo.dept,
        "taskDeptId": this.userInfo.deptVo.deptId,
        "taskUserName": this.userInfo.name,
        "taskUserId": this.userInfo.empId,
        nextUserId: this.reciver.reciUserId,
        nextUserName: this.reciver.reciUserName,
        taskContent: this.ruleForm.taskContent,
        state: this.ruleForm.state,
        operateType: '1'
      }
      this.$http.post('/doc/docTask', params, { body: true })
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
    docArchive(isEnd) {
      var params = {
        docId: this.docDetialInfo.doc.id,
        "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
        "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "taskDeptName": this.userInfo.deptVo.dept,
        "taskDeptId": this.userInfo.deptVo.deptId,
        "taskUserName": this.userInfo.name,
        "taskUserId": this.userInfo.empId,
      }
      this.$http.post('/doc/docArchive', params, { body: true })
        .then(res => {
          if (res.status == '0') {
            this.$message.success('归档成功');
            if (isEnd) {
              this.$router.push('/doc/docSearch');
            } else {
              this.DialogArchiveVisible = false;
              this.DialogSubmitVisible = true;
              this.isSuccessSubmit = true;
            }
          } else {
            this.$message.error('归档失败，请重试');
          }
        }, res => {

        })
    },
    removePerson(index) {
      this.archiveForm.persons.splice(index, 1);
    },
    dialogSubmit() {
      if (this.archiveForm.persons.length > 0) {
        var params = [];
        var dist = {
          "distDeptMajorId": this.userInfo.deptVo.fatherDeptId,
          "distDeptMajorName": this.userInfo.deptVo.fatherDept,
          "distDeptId": this.userInfo.deptVo.deptId,
          "distDeptName": this.userInfo.deptVo.dept,
          "distUserId": this.userInfo.empId,
          "distUserName": this.userInfo.name,
          "content": this.archiveForm.res,
          "docId": this.$route.params.id,
          "operateType": '1'
        }
        this.archiveForm.persons.forEach(person => {
          var temp = {
            "reciveDeptMajorId": person.deptParentId,
            "reciveDeptId": person.deptId,
            "reciveDeptName": person.deptName,
            "reciveUserId": person.empId,
            "reciveUserName": person.name,
          }
          Object.assign(temp, dist);
          params.push(temp);
        })
        this.$store.dispatch('docDistribution', params);
      } else {
        this.$message.warning('请选择收件人！');
      }
    },
    DialogSubmitClose() {
      if (this.isSuccessSubmit) {
        this.$router.push('/doc/docSearch');
      }
    },
    handleChange(activeNames) {
      if (activeNames.length == 0) {
        this.topDistData = this.distData.slice(0, 3);
      } else {
        this.topDistData = this.distData;
      }
    },
    getDistInfo() {
      this.$http.post('/doc/getDistInfo', { docId: this.$route.params.id })
        .then(res => {
          if (res.status == '0') {
            this.distData = res.data;
            this.topDistData = this.distData.slice(0, 3);
          } else {

          }
        }, res => {

        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
#docDetail {

  .el-card__header {
    margin-bottom: 10px;
  }
  .attch {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
  }
  .doc-form_title {
    padding-bottom: 20px;
    position: relative;
    font-size: 18px;
    line-height: 20px;
    color: $main;
    text-indent: 15px; // font-weight: bold;
    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 2px;
      width: 4px;
      height: 15px;
      background-color: #0460AE;
    }
  }
  .backV {
    background: #F7F7F7;
  }
  .commonBox {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px dashed #D5DADF;
  }
  .baseInfoBox {
    margin-top: 15px;
    padding-bottom: 10px;
    .el-col {
      border-bottom: 1px solid #D5DADF;
      padding: 15px 24px;
      overflow: hidden;
      display: flex;
      font-size: 15px;
    }
    .rightBorder {
      border-right: 1px solid #D5DADF;
    }
    .blank{
      height:51px;
    }
    .title {
      width: 150px;
    }
    .textContent {
      flex: 1;
      overflow: hidden;
      word-wrap: break-word;
      &.blackText {
        font-weight: bold;
      }
    }
  }
  .timeRight {
    text-align: right;
  }
  .history {
    .el-col {
      min-height: 50px;
      padding: 15px 0;
    }
    .el-row {
      border-bottom: 1px solid #D5DADF;
      &:first-of-type {
        border-top: 1px solid #D5DADF;
      }
    }
  }
  .myAdvice {
    .myRadio {
      line-height: 45px;
      .el-radio-button .el-radio-button__inner {
        height: 45px;
        width: 90px;
        line-height: 45px;
        padding: 0;
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
  .personDialog {
    .el-dialog--large {
      width: 1100px;
      top: 50%!important;
      margin-top: -315px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0;
      }
    }
  }
  .archiveDialog {
    .el-dialog__body {
      padding: 35px 0;
      text-align: center;
      button {
        width: 180px;
        border-radius: 3px;
      }
    }
  }
  .archiveSubmitDialog {
    width: 600px;
    .el-dialog__body {
      padding: 25px 25px 25px 8px;
    }
    .reciverWrap {
      .el-form-item__content {
        display: flex;
      }
      .reciverList {
        flex: 1;
        .el-tag {
          margin-right: 5px;
        }
      }
    }
    .dialogSubmitButton {
      width: 180px;
      border-radius: 3px;
    }
  }
  .el-form-item__error {
    padding-left: 5px;
  }
  .distTable {
    th {
      background: $sub;
    }
    td {
      height: 50px;
    }
  }
  .moreButton {
    border-top: none;
    .el-collapse-item__header {
      text-align: center;
      i {
        transform: rotate(90deg);
      }
    }
    .el-collapse-item.is-active>.el-collapse-item__header .el-collapse-item__header__arrow {
      transform: rotate(-90deg);
    }
    .el-collapse-item__wrap {
      display: none;
    }
  }
  .operateBox {
    margin: 50px 0;
  }
}

</style>
