<template>
  <div id="docDetail">
    <el-card class="borderCard">
      <div slot="header" class="clearfix docheader">
        <span class="docTypeName">{{docDetialInfo.doc.docTypeName}}</span>
        <span class="docNo">{{docDetialInfo.doc.docNo}}</span>
        <span class="improtType" v-if="docDetialInfo.doc.docImportType=='紧急'||docDetialInfo.doc.docImportType=='特急'" :style="{background:docDetialInfo.doc.docImportType=='紧急'?'#FFD702':'#FF0202'}">{{docDetialInfo.doc.docImportType}}</span>
        <span class="improtType" v-if="docDetialInfo.doc.docDenseType=='保密'||docDetialInfo.doc.docDenseType=='绝密'" :style="{background:docDetialInfo.doc.docDenseType=='保密'?'#FFD702':'#FF0202'}">{{docDetialInfo.doc.docDenseType}}</span>
        <div class="rightBox">
          <span class="taskUserName">呈报人 {{docDetialInfo.doc.taskUserName}}</span>
          <span class="deptName">{{docDetialInfo.doc.taskDeptMajorName}}</span>
          <span class="deptName">{{docDetialInfo.doc.taskUserJobTitle}}</span>
        </div>
      </div>
      <div class="baseInfoBox commonBox">
        <!-- <h4 class='doc-form_title'>公文信息</h4> -->
        <el-row>
          <el-col :span="24">
            <h1 class="title">标题</h1>
            <p class="textContent blackText">{{docDetialInfo.doc.docTitle}}</p>
          </el-col>
          <el-col :span="24" style="min-height:90px">
            <h1 class="title">请示内容</h1>
            <p class="textContent" style="white-space:pre-wrap">{{docDetialInfo.doc.taskContent}}</p>
          </el-col>
          <el-collapse class="clearfix clearBoth">
            <el-collapse-item title="附加内容" name="1">
              <component v-bind:is="currentView" :info="docDetialInfo.otherInfo">
                <!-- 组件在 vm.currentview 变化时改变！ -->
              </component>
              <el-col :span="24">
                <h1 class="title">建议路径</h1>
                <p class="textContent suggestHtml" v-html="suggestHtml"></p>
              </el-col>
              <el-col :span="24">
                <h1 class="title">附件</h1>
                <p class="attch textContent">
                  <template v-if="docDetialInfo&&docDetialInfo.taskFile.length>0">
                    <a :href="file.filePath" target="_blank" v-for="file in docDetialInfo.taskFile">{{file.fileNameNew}}</a>
                  </template>
                </p>
              </el-col>
              <el-col :span="24" style="border-bottom:none">
                <h1 class="title">附加公文</h1>
                <p class="attch textContent">
                  <router-link :to="{path:'/doc/docInfo/'+file.quoteDocId,query:{code:file.docType}}" v-for="file in docDetialInfo.taskQuote">{{file.quoteDocTitle}}</router-link>
                </p>
              </el-col>
            </el-collapse-item>
          </el-collapse>
        </el-row>
      </div>
      <history-advice :taskDetail="docDetialInfo.taskDetail"></history-advice>
      <div v-if="distData.length!=0" style="margin-bottom:20px;">
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
      </div>
      <div class="operateBox" v-if="docDetialInfo.task[0].state==3">
        <el-button type="primary" class="myButton" @click="DialogSubmitVisible=true">公文分发</el-button>
        <el-button class="myButton" v-if="docDetialInfo.doc.isPay" @click="changePay">付款</el-button>
        <a :href="baseURL+'/pdf/exportPdf?docId='+$route.params.id" target="_blank">
          <el-button type="text"><i class="iconfont icon-icon202"></i>导出PDF</el-button>
        </a>
      </div>
      <my-advice :docDetail="docDetialInfo.doc" :suggests="docDetialInfo.suggests" v-if="showMyadvice">
        <el-button size="large" class="docArchiveButton" @click="DialogArchiveVisible=true" v-if="docDetialInfo.doc.isFied==1" slot="docArchive"><i class="iconfont icon-archive" slot="docArchive"></i>归档</el-button>
      </my-advice>
      <sign-advice :docDetail="docDetialInfo.doc"  v-if="docDetialInfo.doc.isSign==1&&$route.query.code!='LZS'"></sign-advice>
      <quit-advice :info="docDetialInfo" v-if="(docDetialInfo.doc.isSign==1||docDetialInfo.doc.isFied==1)&&$route.query.code=='LZS'">
      </quit-advice>
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
          <el-button class="addButton" @click="selectArchivePerson"><i class="el-icon-plus"></i></el-button>
        </el-form-item>
        <el-form-item label="分发意见" prop="res">
          <el-input type="textarea" :rows="6" resize='none' v-model="archiveForm.res"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="dialogSubmitButton" @click="dialogSubmit">分发</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <person-dialog @updatePerson="updateArchivePerson" admin="1" :visible.sync="dialogArchivePersonVisible" dialogType="multi"></person-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../components/personDialog.component'
import QuitAdvice from './detailComponent/empQuitAdvice.component'
import historyAdvice from './detailComponent/historyAdvice.component'
import signAdvice from './detailComponent/signAdvice.component'
import myAdvice from './detailComponent/myAdvice.component'
import YCS from './component/vehicleDetail.component' //用车详情
import CLS from './component/materialDetail.component' //材料详情
import FWG from './component/manuscriptDetail.component' //材料详情
import CLV from './component/travelDetail.component' //差旅详情
import GSS from './component/injuryDetail.component' //工伤详情
import QJS from './component/vacationDetail.component' //休假详情
import RSB from './component/empChangeDetail.component' //人事变动详情
import ZZS from './component/empBecomeDetail.component' //转正详情
import JJS from './component/empUpgradeDetail.component' //晋升详情
import PXS from './component/empTrainingDetail.component' //培训详情
import RYY from './component/empIntroduceDetail.component' //引进详情
import SWD from './component/docCheckInDetail.component' //引进详情
import HTS from './component/contractDetail.component' //合同详情
import JKS from './component/loanDetail.component' //借款详情
import YSS from './component/budgetDetail.component' //预算详情
import BXS from './component/reimburseDetail.component' //预算详情
import FKS from './component/paymentDetail.component' //付款详情
import YFK from './component/prePayDetail.component' //预付款详情
import CLB from './component/travelRemibDetail.component' //预付款详情
import BKY from './component/guestTicketDetail.component.vue' //宾客机票详情
import YGY from './component/staffBenefitDetail.component.vue' //员工优惠机票
import LZS from './component/empQuitDetail.component.vue' //离职详情

import { mapGetters } from 'vuex'
const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
const signFlag = '<i class="signFlag">#</i>'

export default {
  components: {
    PersonDialog,
    QuitAdvice,
    historyAdvice,
    signAdvice,
    myAdvice,
    YCS,
    CLS,
    FWG,
    CLV,
    GSS,
    QJS,
    RSB,
    ZZS,
    JJS,
    PXS,
    RYY,
    SWD,
    HTS,
    JKS,
    YSS,
    BXS,
    FKS,
    YFK,
    CLB,
    BKY,
    YGY,
    LZS
  },
  data() {
    return {
      DialogArchiveVisible: false,
      DialogSubmitVisible: false,
      dialogArchivePersonVisible: false,
      currentView: '',
      archiveForm: {
        res: '',
        persons: []
      },
      docDetialInfo: { doc: {}, task: [{state:''}], taskDetail: [], taskFile: [], taskQuote: [], otherInfo: [],suggests:'' },
      archiveFormRule: {},
      activeNames: [],
      topDistData: [],
      distData: [],
      isSuccessSubmit: false,
      suggestHtml: '',
    }
  },
  created() {
    this.getDetail(this.$route);
  },
  beforeRouteUpdate(to, from, next) {
    this.getDetail(to);
    next();
  },
  computed: {
    showMyadvice(){
      if(this.docDetialInfo.doc != {}){
        if(this.currentView=='LZS'){
          return this.docDetialInfo.doc.isTask==1&&this.docDetialInfo.doc.isSign!=1&&this.docDetialInfo.doc.isFied!=1
        }else{
          return this.docDetialInfo.doc.isTask==1&&this.docDetialInfo.doc.isSign!=1
        }
        
      }else{
        return false
      }
    },
    ...mapGetters([
      'userInfo',
      'isAdmin',
      'baseURL'
    ])
  },
  methods: {
    getDetail(route) {
      var url = "/doc/getDocDetailInfo";
      if (route.query.code == 'LZS') {
        url = '/doc/getDocDimissionInfo'
      }
      this.$http.post(url, { id: route.params.id, empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            this.docDetialInfo = res.data;
            if (route.query.code == 'LZS') {
              this.docDetialInfo.otherInfo = this.docDetialInfo.dimission;
            }
            if (this.docDetialInfo.doc.pageCode != 'CPD') {
              this.currentView = this.docDetialInfo.doc.pageCode;
            }
            if (this.docDetialInfo.task[0].state == 3 || this.docDetialInfo.task[0].state == 4) {
              this.getDistInfo();
            }
            this.handleSuggest();
          }
        }, res => {

        })
    },
    handleSuggest() {
      if (Array.isArray(this.docDetialInfo.suggests)) {
        var html = ''
        this.docDetialInfo.suggests.forEach((s, i, arr) => {
          if (s.nodeName == 'sign') {
            if (arr[i - 1].nodeName != 'sign') {
              html += signFlag + ' ' + s.typeIdName + ' ';
            } else if (arr[i + 1].nodeName != 'sign') {
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
    selectArchivePerson() {
      this.dialogArchivePersonVisible = true;
    },
    updateArchivePerson(payLoad) {
      this.dialogArchivePersonVisible = false;
      this.archiveForm.persons = payLoad;
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
    changePay(){
      this.$http.post('/doc/updateFinPayState',{docId:this.$route.params.id})
      .then(res=>{
        if(res.status==0){
          this.$message.success('操作成功!');
          this.getDetail(this.$route);
        }else{
          this.$message.error('操作失败!'+res.message);
        }
      })
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
  .docheader {
    line-height: 24px;
    padding: 8px 0 4px;
    .docTypeName,
    .docNo {
      font-size: 18px;
      color: #151515;
      display: inline-block;
      vertical-align: middle;
      float: left;
    }
    .docTypeName {
      position: relative;
      padding-right: 7px;
      margin-right: 5px;
      &:before {
        content: '';
        position: absolute;
        right: 0;
        height: 18px;
        top: 2px;
        background: #151515;
        width: 2px;
      }
    }
    .improtType {
      display: inline-block;
      width: 40px;
      line-height: 19px;
      height: 19px;
      border-radius: 2px;
      text-align: center;
      font-size: 13px;
      margin-left: 10px;
      vertical-align: middle;
      color: #fff;
      float: left;
    }
    .rightBox {
      float: right;
      .taskUserName {
        color: $sub;
        font-size: 18px;
        padding-right: 5px;
      }
      .deptName {
        color: #646464;
        font-size: 15px;
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
  .el-card__header {
    margin-bottom: 10px;
  }
  .attch {
    color: blue;
    cursor: pointer;
    text-decoration: underline;
    a {
      display: block;
    }
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
      padding: 15px 18px 15px 24px;
      overflow: hidden;
      display: flex;
      font-size: 15px;
    }
    .rightBorder {
      border-right: 1px solid #D5DADF;
    }
    .blank {
      height: 57px;
    }
    .title {
      width: 140px;
    }
    .textContent {
      flex: 1;
      overflow: hidden;
      word-wrap: break-word;
      &.blackText {
        font-weight: bold;
      }
    }
    .el-collapse {
      border: none;
      .el-collapse-item__header {
        border-bottom: none;
        font-size: 18px;
        padding-left: 0;
        color: $main;
      }
      .el-collapse-item__content {
        overflow: hidden;
        padding: 0;
        border-top: 1px solid #D5DADF;
      }
    }
  }
  .timeRight {
    text-align: right;
  }

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
    margin: 30px 0;
    a {
      float: right;
      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }
  }
}

</style>
