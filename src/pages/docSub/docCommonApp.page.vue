<template>
  <div class='commonApp' v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='doc.docName'></span>
      </div>
      <div>
        <!-- 公文申请公用头部 -->
        <subject class='doc-section' @moreDetp="moreDetp" :reciverName="reciverName" ref="subject" @submitStart="submitStart" @saveStart="saveStart"></subject>

        <!-- 公文申请公用底部 -->
        <description class='doc-section'  ref="description" @submitEnd="submitEnd"  @saveEnd="saveEnd" :options="options">

          <!-- 各类型公文独有部分,根据路由params.code字段加载不同组件 -->
          <!-- 作为插槽插入公用底部 -->
          <component v-bind:is="$route.params.code" :change-dept="changeMoreDept" ref="middleCom" @submitMiddle="submitMiddle" @saveMiddle="saveMiddle" v-if="$route.params.code!='CPD'" @updateSuggest="updateSuggest"  @updateTemplate="updateTemplate">
          </component>
          
        </description>
        <div class='clearfix'>
          <el-button type="primary" @click="submitDoc" class="submitButton">提交</el-button>
          <el-button @click="saveDoc" class="saveButton"><i class="iconfont icon-caogao"></i> 保存至草稿箱</el-button>
        </div>
      </div>
    </el-card>
    <back-button></back-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { docConfig } from '../../common/docConfig'
import Subject from './component/subject.component.vue'
import Description from './component/description.component.vue'
import BackButton from '../../components/backButton.component.vue'
import CLV from './component/travelApp.component.vue'
import QJS from './component/vacationApp.component.vue'
import GSS from './component/injuryApp.component.vue'
import RSB from './component/empChangeApp.component.vue'
import JJS from './component/empUpgradeApp.component.vue'
import QJSFX from './component/pilotVacationApp.component.vue'
import ZZS from './component/empBecomeApp.component.vue'
import PXS from './component/empTrainingApp.component.vue'
import RYY from './component/empIntroduceApp.component.vue'
import SWD from './component/docCheckInApp.component.vue'
import YSS from './component/budgetApp.component.vue'
import HTS from './component/contractApp.component.vue'
import FKS from './component/paymentApp.component.vue'
import JKS from './component/loanApp.component.vue'
import BXS from './component/reimburseApp.component.vue'
import YFK from './component/prePayApp.component.vue'
import FWG from './component/manuscriptApp.component.vue'
import YCS from './component/vehicleApplication.component.vue'
import CLS from './component/materialApp.component.vue'
import CLB from './component/travelRemibApp.component.vue'
import BKY from './component/guestTicketApp.component.vue'
import YGY from './component/staffBenefitApp.component.vue'
import LZS from './component/empQuitApp.component.vue'
import HCG from './component/airMaterialApp.component.vue'
import SXS from './component/airRepairApp.component.vue'
import JHH from './component/airExchangeApp.component.vue'
import YSL from './component/commonBudgetApp.component.vue'
import TYS from './component/commonApp.component.vue'
import ZJJ from './component/airLoanApp.component.vue'
import JBC from './component/airSellApp.component.vue'

export default {
  name: 'docCommonApp',
  data() {
    return {
      changeMoreDept:"",
      docConfig,
      middleParams: '',
      options: { docType: '', desTitle: '' },
      // updateTemplate:false,
      doc: '',
      saveStartPara: '',
      saveMiddlePara: '',
      reciverName: '',
      submitParam: '',
      docNo: '',
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'userInfo',
      'docTitle',
      'selConfident',
      'selUrgency',
      'reciver',
      'isSubmit',
      'taskUser',
      'isReady',
      'suggestPath'
    ])
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('clear');
    next();
  },
  components: {
    BackButton,
    Subject,
    Description,
    CLV,
    QJS,
    QJSFX,
    GSS,
    RSB,
    JJS,
    ZZS,
    PXS,
    RYY,
    SWD,
    YSS,
    HTS,
    FKS,
    JKS,
    BXS,
    YFK,
    FWG,
    YCS,
    CLS,
    CLB,
    BKY,
    YGY,
    LZS,
    SXS,
    JHH,
    YSL,
    TYS,
    HCG,
    ZJJ,
    JBC
  },
  created() {
    this.$store.dispatch('getTemplate', { code: this.$route.params.code });
  },
  beforeRouteUpdate(to, from, next) {
    if ((to.params.code == 'SWD' && this.userInfo.isConfidential != 1) || (to.params.code == 'CLS' && this.userInfo.isPurchase != 1)) {
      this.$router.push(from.path);
    } else {
      next();
    }
  },
  mounted() {
    if (this.isReady) {
      if ((this.$route.params.code == 'SWD' && this.userInfo.isConfidential != 1) || (this.$route.params.code == 'CLS' && this.userInfo.isPurchase != 1)) {
        this.$router.push('/doc/docSub');
      } else {
        this.initDoc();
      }
    } else {
      this.initDoc();
    }
  },
  watch: {
    isReady: function(val) {
      if (val) {
        if ((this.$route.params.code == 'SWD' && this.userInfo.isConfidential != 1) || (this.$route.params.code == 'CLS' && this.userInfo.isPurchase != 1)) {
          this.$router.push('/doc/docSub');
        }
      }
    }
  },
  methods: {
    moreDetp(val){
      this.changeMoreDept=val;
    },
    initDoc() {
      this.doc = this.docConfig.find(doc => doc.code == this.$route.params.code);
      this.options.docType = this.doc.code;
      this.options.desTitle = this.doc.code == 'LZS' ? '离职理由说明' : '';
      if (this.$route.query.id) {
        this.getDraft();
      }
    },
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true);
      this.$refs.subject.submitForm();
    },
    submitStart(val) {
      if (val) {
        if (this.doc.code == 'CPD') {
          this.$refs.description.submitForm();
        } else {
          this.$refs.middleCom.submitForm();
        }
      } else {
        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    },
    submitMiddle(params) {
      if (params) {
        this.middleParams = params;
        this.$refs.description.submitForm();
      } else {
        this.$store.commit('SET_SUBMIT_LOADING', false);
      }
    },
    submitEnd(params) {
      if (params) {
        var temp = {
          "taskDeptMajorName": this.taskUser.deptParentName,
          "taskDeptMajorId": this.taskUser.deptParentId,
          "taskDeptName": this.taskUser.deptName,
          "taskDeptId": this.taskUser.deptId,
          "taskUserJobTitle": this.taskUser.jobtitle,
          "taskEmpPostId": this.taskUser.postId,
          "taskPostrankId": this.taskUser.postRankId,
          "taskPostrankName": this.taskUser.postRankName,
          "taskSupervisory": this.taskUser.supLevel,
          "taskUserName": this.taskUser.empName,
          "taskUserId": this.taskUser.empId,
          "docTypeCode": this.doc.code,
          "docTitle": this.docTitle,
          "docNo": this.docNo,
          "isSubmit": 1,
        }
        if (this.$route.query.id) {
          params.id = this.$route.query.id
        }
        Object.assign(temp, params, this.reciver, this.suggestPath, this.selConfident, this.selUrgency, this.middleParams)
        this.$store.commit('setIsSubmit', true);
        this.submitParam = temp;
        this.saveDoc();
      } else {
        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    },
    saveDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
      this.$refs.subject.saveForm();
    },
    saveStart() {
      if (this.doc.code == 'CPD') {
        this.$refs.description.saveForm();
      } else {
        this.$refs.middleCom.saveForm();
      }
    },
    saveMiddle(params,docSubtypeCode) {
      this.saveMiddlePara = params;
      this.$refs.description.saveForm(docSubtypeCode);
    },
    saveEnd(params) {
      var finalParam;
      if (params) {
        if (this.isSubmit) { //提交
          finalParam = {
            "draft": {
              "draftContent": this.saveMiddlePara,
              "files": params.files,
              "state": this.isSubmit ? 2 : 1
            }
          };
          Object.assign(finalParam, this.submitParam)
        } else { //保存草稿箱
        
          var temp = {
            docSubtypeCode:params.docSubtypeCode,
            "docNo": this.docNo,
            "docTitle": this.docTitle,
            "taskDeptMajorName": this.taskUser.deptParentName,
            "taskDeptMajorId": this.taskUser.deptParentId,
            "taskDeptName": this.taskUser.deptName,
            "taskDeptId": this.taskUser.deptId,
            "taskUserJobTitle": this.taskUser.jobtitle,
            "taskEmpPostId": this.taskUser.postId,
            "taskPostrankId": this.taskUser.postRankId,
            "taskPostrankName": this.taskUser.postRankName,
            "taskSupervisory": this.taskUser.supLevel,
            "taskUserName": this.taskUser.empName,
            "taskUserId": this.taskUser.empId,
            "docTypeCode": this.doc.code,
            "isSubmit": 0,
            "draft": {
              "draftContent": this.saveMiddlePara,
              "files": params.files,
              "state": this.isSubmit ? 2 : 1
            },
            "fileId": [],
          }
          delete params.files;
          if (this.$route.query.id) {
            temp.id = this.$route.query.id
          }
          Object.assign(temp, params, this.reciver, this.suggestPath, this.selConfident, this.selUrgency);
          finalParam = temp;
        }
        this.$http.post(this.doc.url, finalParam, { body: true })
          .then(res => {
            this.$store.commit('SET_SUBMIT_LOADING', false)
            if (res.status == 0) {
              this.$notify({
                message: (this.isSubmit ? '呈报' : '保存') + '公文成功',
                type: 'success'
              });
              this.$router.push(this.isSubmit ? '/doc/docTracking' : '/doc/docDraft');
            } else {
              this.$notify({
                message: res.message,
                type: 'error'
              });
            }
            this.$store.commit('setIsSubmit', false);
          })
      } else {
        this.$store.commit('SET_SUBMIT_LOADING', false)
        this.$store.commit('setIsSubmit', false);
      }
    },
    getDraft() {
      this.$http.post('/doc/getDocDraftsDetail', { docId: this.$route.query.id })
        .then(res => {
          if (res.status == 0) {
            //公文编号
            this.docNo = res.data.docNo;
            // 收件人
            this.reciverName = res.data.receiver.reciUserName;
            this.$store.commit('setReciver', res.data.receiver);
            // 重要程度
            this.$store.commit('setConfident', res.data.selConfident);
            // 密级程度
            this.$store.commit('setUrgency', res.data.selUrgency);
            //呈报人
            this.$refs.subject.ruleForm.taskUserID = res.data.taskUser.deptId + res.data.taskUser.jobtitle;
            this.$store.commit('setTaskUser', res.data.taskUser);
            //公文标题
            this.$refs.subject.updateTitle(res.data.docTtile);
            //请示内容
            if (this.$route.params.code != 'FWG') { //发文稿纸无请示内容
              this.$refs.description.$refs.editor.setContent(res.data.des);
            }
            //附件
            if (res.data.files) {
              this.$refs.description.initAttchment(JSON.parse(res.data.files));
            }
            // 建议路径
            if (res.data.path) {
              this.$refs.subject.updatePath(res.data.path);
            }
            this.$refs.subject.disableEditSuggest = res.data.isEdit == 0 ? false : true;
            // 附加公文
            if (res.data.docs.length != 0) {
              this.$refs.description.docs = res.data.docs;
            }
            if (this.doc.code != 'CPD' && res.data.draftContent) {
              this.$refs.middleCom.getDraft(JSON.parse(res.data.draftContent), res.data);
            }
          } else {

          }
        })
    },
    updateSuggest(val) {
      this.$refs.subject.getSuggestTemp(val);
    },
    updateTemplate(val){
      this.$refs.description.isClickTem(val);
    },
  }
}

</script>
<style lang='scss'>
$main:#0460AE;

</style>
