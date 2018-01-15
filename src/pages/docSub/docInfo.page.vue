<template>
  <div id="docInfo">
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
          <component v-bind:is="computeView" :info="docDetialInfo.otherInfo" :docDetialInfo="docDetialInfo" v-if="computeView"></component>
          <el-col :span="24" style="min-height:90px" v-if="$route.query.code!='FWG'">
            <h1 class="title">请示内容</h1>
            <p class="textContent" v-html="docDetialInfo.doc.taskContent"></p>
          </el-col>
          <el-collapse v-model="activeNames" class="clearfix clearBoth">
            <el-collapse-item title="附加内容" name="1">
              <component v-bind:is="currentView" :info="docDetialInfo.otherInfo" :docDetialInfo="docDetialInfo">
                <!-- 组件在 vm.currentview 变化时改变！ -->
              </component>
              <el-col :span="24">
                <h1 class="title">建议路径</h1>
                <p class="textContent suggestHtml" v-html="suggestHtml"></p>
              </el-col>
              <el-col :span="24" v-if="$route.query.code!='FWG'">
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
      <dist-advice ref="distAdvice"></dist-advice>
      <!-- <quit-advice :info="docDetialInfo" v-if="$route.query.code=='LZS'"></quit-advice> -->
      <div class="backButton">
        <el-button type="primary" @click="showDistribute=true" v-if="!hasBack">公文分发</el-button>
      </div>
    </el-card>
    <back-button :backTop="186"></back-button>
    <distribute-dialog :visible.sync="showDistribute" :docId="$route.params.id"></distribute-dialog>
  </div>
</template>
<script>
import BackButton from '../../components/backButton.component.vue'
import historyAdvice from './detailComponent/historyAdvice.component'
import DistributeDialog from '../../components/distributeDialog.component'
import DistAdvice from './detailComponent/distAdvice.component'
import FWGD from './detailComponent/FWGDetail.component'
import SWDD from './detailComponent/SWDDetail.component'
import CPDD from './detailComponent/CPDDetail.component'
import HTSD from './detailComponent/HTSDetail.component'
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
import SXS from './component/airRepairDetail.component.vue' //送修详情
import YSL from './component/commonBudgetDetail.component.vue' //通用预算详情
import TYS from './component/commonDetail.component.vue' //通用申请详情
import HCG from './component/airMaterialDetail.component.vue' //航材合同/工具详情
import JHH from './component/airExchangeDetail.component.vue' //交换详情
import ZJJ from './component/airLoanDetail.component.vue' //租借详情
import JBC from './component/airSellDetail.component.vue' //售出详情

import { mapGetters } from 'vuex'
const arrowHtml = '<i class="iconfont icon-jiantouyou"></i>'
const signFlag = '<i class="signFlag">#</i>'
const otherAdviceDoc = ["FWG", "SWD", "CPD", "HTS"]
export default {
  name: 'docInfo',
  components: {
    historyAdvice,
    BackButton,
    DistributeDialog,
    DistAdvice,
    FWGD,
    SWDD,
    CPDD,
    HTSD,
    YSL,
    YCS,
    TYS,
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
    LZS,
    SXS,
    HCG,
    ZJJ,
    JBC,
    JHH

  },
  data() {
    return {
      currentView: '',
      docDetialInfo: { doc: {}, task: [], taskDetail: [], taskFile: [], taskQuote: [], otherInfo: [] },
      suggestHtml: '',
      activeNames: ['1'],
      hasBack: false,
      advice: [],
      otherAdviceDoc,
      showOtherAdvice: false,
      otherAdvice: '',
      showDistribute: false
    }
  },
  created() {
    this.getDetail(this.$route);
  },
  beforeRouteUpdate(to, from, next) {
    this.getDetail(to);
    next();
  },
  beforeRouteEnter(to, from, next) {

    next(vm => {
      if (from.name == 'docDetail') {
        vm.hasBack = true;
      }
    })
  },
  computed: {
    computeView() {
      var view = '';
      var temp = otherAdviceDoc.find(d => d == this.$route.query.code);
      if (temp) {
        view = temp + 'D'
      }
      return view
    },
    ...mapGetters([
      'userInfo',
      'isAdmin',
      'baseURL'
    ])
  },
  methods: {
    getDetail(route) {
      // this.getAdvice();
      // var url = "/doc/getDocDetailById";
      var url = "/doc/getDocDetailInfo";
      var params = {
        id: route.params.id,
        empId: this.userInfo.empId
      }
      if (route.query.code == 'LZS') {
        url = '/doc/getDocDimissionInfo';
      }
      this.$http.post(url, params)
        .then(res => {
          if (res.status == 0) {
            this.docDetialInfo = res.data;
            if (route.query.code == 'LZS') {
              this.docDetialInfo.otherInfo = this.docDetialInfo.dimission;
            }
            if (this.docDetialInfo.doc.pageCode != 'CPD') {
              this.currentView = this.docDetialInfo.doc.pageCode;
            }
            this.handleSuggest();
            this.getDistInfo();
            if (route.query.code != 'CPD' && route.query.code != 'HTS') {
              this.activeContent = [];
            }
          }
        }, res => {

        })
    },
    handleSuggest() {
      if (Array.isArray(this.docDetialInfo.suggests)) {
        var html = '起草' + arrowHtml + ' ';
        this.docDetialInfo.suggests.forEach((s, i, arr) => {
          if (s.nodeName == 'sign') {
            if (arr[i - 1].nodeName != 'sign') {
              html += signFlag + ' ' + s.typeIdName + s.remark + ' ';
              if (arr[i + 1].nodeName != 'sign') {
                html += signFlag + ' ' + arrowHtml
              }
            } else if (arr[i + 1].nodeName != 'sign') {
              html += s.typeIdName + s.remark + ' ' + signFlag + ' ' + arrowHtml;
            } else {
              html += s.typeIdName + s.remark + ' ';
            }
          } else if (s.nodeName == 'trans') {
            if (arr[i - 1].nodeName != 'trans') {
              html += signFlag + ' ' + s.typeIdName + s.remark + ' ';
              if (arr[i + 1].nodeName != 'trans') {
                html += signFlag + ' ' + arrowHtml
              }
            } else if (arr[i + 1].nodeName != 'trans') {
              html += s.typeIdName + s.remark + ' ' + signFlag + ' ' + arrowHtml;
            } else {
              html += s.typeIdName + s.remark + ' ';
            }
          } else {
            if (i == arr.length - 1) {
              html += s.typeIdName + s.remark
            } else {
              html += s.typeIdName + s.remark + arrowHtml
            }
          }
        })
        html += '归档'
        this.suggestHtml = html;
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    getAdvice() {
      this.$http.post('/doc/getTaskDetail', { id: this.$route.params.id })
        .then(res => {
          if (res.status == 0) {
            this.advice = res.data;
          } else {

          }
        })
    },
    getDistInfo() {
      this.$refs.distAdvice.pageNumber = 1;
      this.$refs.distAdvice.getDistInfo();
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
#docInfo {
  .backButton {
    padding-left: 20px;
    padding-bottom: 20px;
    .el-button {
      width: 150px;
    }
  }
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
  .adviceSpan {
    display: inline-block;
    padding-right: 10px;
    word-break: break-word;
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
    padding-bottom: 10px;
    .el-col {
      border-bottom: 1px solid #D5DADF;
      padding: 5px 18px 5px 24px;
      min-height: 57px;
      overflow: hidden;
      display: table;
      font-size: 15px;
      table-layout: fixed;
    }
    .rightBorder {
      border-right: 1px solid #D5DADF;
    }
    .blank {
      height: 57px;
    }
    .title {
      width: 140px;
      display: table-cell;
      vertical-align: middle;
      word-wrap: break-word;
    }
    .textContent {
      word-wrap: break-word;
      display: table-cell;
      vertical-align: middle;
      overflow: hidden;
      word-wrap: break-word;
      line-height: 19px;
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
}

</style>
