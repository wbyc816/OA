<template>
  <div class='commonApp' v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='doc.docName'></span>
      </div>
      <div>
        <subject class='doc-section' :reciverName="reciverName" ref="subject" @submitStart="submitStart" @saveStart="saveStart"></subject>
        <description class='doc-section' ref="description" @submitEnd="submitEnd" @saveEnd="saveEnd" :options="options">
          <!-- <manuscript-app  @submitMiddle="submitMiddle"></manuscript-app> -->
          <component v-bind:is="$route.params.code" ref="middleCom" @submitMiddle="submitMiddle" @saveMiddle="saveMiddle" v-if="$route.params.code!='CPD'">
            <!-- 组件在 vm.currentview 变化时改变！ -->
          </component>
        </description>
        <div class='clearfix'>
          <el-button type="primary" @click="submitDoc" class="submitButton">提交</el-button>
          <el-button @click="saveStart" class="saveButton"><i class="iconfont icon-caogao"></i> 保存至草稿箱</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { docConfig } from '../../common/docConfig'
import Subject from './component/subject.component.vue'
import Description from './component/description.component.vue'
import CLV from './component/travelApp.component.vue'
import QJS from './component/vacationApp.component.vue'
import GSS from './component/injuryApp.component.vue'
import RSB from './component/empChangeApp.component.vue'
import JJS from './component/empUpgradeApp.component.vue'
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

export default {
  data() {
    return {
      docConfig,
      middleParams: '',
      options: { docType: '' },
      doc: '',
      saveStartPara: '',
      saveMiddlePara: '',
      reciverName: ''
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading',
      'userInfo',
      'docTitle',
      'selConfident',
      'selUrgency',
      'reciver'
    ])
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('clear');
    next();
  },
  components: {
    Subject,
    Description,
    CLV,
    QJS,
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
    YGY
  },
  mounted() {
    this.initDoc();
  },
  methods: {
    initDoc() {
      this.doc = this.docConfig.find(doc => doc.code == this.$route.params.code);
      this.options.docType = this.doc.code;
      if (this.$route.query.id) {
        this.getDraft();
      } else {
        this.getDefaultReciver();
      }
    },
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
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
      console.log(params);
      if (params) {
        this.middleParams = params;
        this.$refs.description.submitForm();
      } else {
        this.$store.commit('SET_SUBMIT_LOADING', false);
      }
    },
    submitEnd(params) {
      console.log(params)
      if (params) {
        this.$store.dispatch('submitDoc', { params: Object.assign(params, this.middleParams), docTypeCode: this.doc.code, url: this.doc.url });
        this.middleParams = '';
      } else {
        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    },
    saveStart() {
      if (this.docTitle) {
        this.$store.commit('SET_SUBMIT_LOADING', true)
        if (this.doc.code == 'CPD') {
          this.$refs.description.saveForm();
        } else {
          this.$refs.middleCom.saveForm();
        }
      } else {
        this.$message.warning('公文标题不能为空！')
      }
    },
    saveMiddle(params) {
      this.saveMiddlePara = params;
      this.$refs.description.saveForm();
    },
    saveEnd(params) {
      var temp = {
        "docTitle": this.docTitle,
        "taskDeptMajorName": this.userInfo.deptVo.fatherDept,
        "taskDeptMajorId": this.userInfo.deptVo.fatherDeptId,
        "taskDeptName": this.userInfo.deptVo.dept,
        "taskDeptId": this.userInfo.deptVo.deptId,
        "taskUserName": this.userInfo.name,
        "taskUserId": this.userInfo.empId,
        "docTypeCode": this.doc.code,
        "isSubmit": 0,
        "draft": {
          "draftContent": this.saveMiddlePara
        },
        "fileId": []
      }
      this.$http.post(this.doc.url, Object.assign(temp, params, this.reciver, this.selConfident, this.selUrgency), { body: true })
        .then(res => {
          this.$store.commit('SET_SUBMIT_LOADING', false)
          if (res.status == 0) {
            this.$notify({
              message: '保存公文成功',
              type: 'success'
            });
            this.$router.push('/doc/docDraft');
          } else {
            this.$notify({
              message: '保存公文失败',
              type: 'error'
            });
          }
        })
    },
    getDefaultReciver() {
      this.$http.post('/doc/getDefaultRecipent', { docTypeCode: this.doc.code, empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            if (res.data.length != 0) {
              var reciver = {
                "reciDeptMajorName": res.data.reciDeptMajorName,
                "reciDeptMajorId": res.data.reciDeptMajorId,
                "reciDeptName": res.data.reciDeptName,
                "reciDeptId": res.data.reciDeptId,
                "reciUserName": res.data.reciUserName,
                "reciUserId": res.data.reciUserId,
              }
              this.$store.commit('setReciver', reciver);
              this.reciverName = res.data.reciUserName;
            }
          } else {

          }
        })
    },
    getDraft() {
      this.$http.post('/doc/getDocDraftsDetail', { docId: this.$route.query.id })
        .then(res => {
          if (res.status == 0) {
            this.$store.commit('setReciver', res.data.reciver);
            this.$store.commit('setConfident', res.data.selConfident);
            this.$store.commit('setUrgency', res.data.selUrgency);
            // this.$store.commit('setDocTtile', res.data.docTtile);
            this.reciverName = res.data.receiver.reciUserName;
            this.$refs.subject.updateTitle(res.data.docTtile);
            if (res.data.path) {
              this.$refs.description.updatePath(res.data.path);
            }
            if (res.data.docs.length != 0) {
              this.$refs.description.docs = res.data.docs;
            }
            if (this.doc.code != 'CPD') {
              this.$refs.middleCom.getDraft(JSON.parse(res.data.draftContent));
            }
          } else {

          }
        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.commonApp {
  .deptArea,
  .arrArea {
    float: left;
    width: 50%;
  }
  .arrArea {
    .el-form-item__label {
      padding-left: 18px;
    }
  }
  .reciverWrap {
    clear: both;
    .el-form-item__content {
      display: flex;
    }
    .reciverList {
      flex: 1;
      .el-tag {
        margin-right: 5px;
      }
    }
    .addButton {
      right: 0;
    }
  }
  .saveButton {
    float: right;
    margin-right: 150px;
    height: 46px;
    font-size: 16px;
    border-radius: 3px;
    i {
      font-size: 23px;
      vertical-align: sub;
      margin-right: 3px;
    }
  }
  .submitButton {
    height: 46px;
    width: 200px;
    margin-left: 134px;
    font-size: 16px;
    border-radius: 3px;
    background-color: $main;
  }
}

</style>
