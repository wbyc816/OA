<template>
  <div class='commonApp' v-loading.fullscreen="sumitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='doc.docName'></span>
      </div>
      <div>
        <subject class='doc-section' ref="subject" @submitStart="submitStart"></subject>
        <description class='doc-section' ref="description" @submitEnd="submitEnd" :options="options">
          <!-- <manuscript-app  @submitMiddle="submitMiddle"></manuscript-app> -->
          <component v-bind:is="$route.params.code" ref="middleCom" @submitMiddle="submitMiddle">
            <!-- 组件在 vm.currentview 变化时改变！ -->
          </component>
        </description>
        <div class='doc-form-submit_btn'>
          <el-button type="primary" @click="submitDoc">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {docConfig} from '../../common/docConfig'
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

export default {
  data() {
    return {
      docConfig,
      middleParams: '',
      options: { docType: '' },
      doc:''
    }
  },
  computed: {
    ...mapGetters([
      'sumitLoading'
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
    SWD
  },
  created(){
    this.initDoc();
  },
  methods: {
    initDoc(){
      this.doc=this.docConfig.find(doc=>doc.code==this.$route.params.code);
      this.options.docType=this.doc.code;
    },  
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
      this.$refs.subject.submitForm();
    },
    submitStart(val) {
      if (val) {
        this.$refs.middleCom.submitForm();
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
}

</style>
