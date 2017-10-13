<template>
  <div id='manuscriptApp' v-loading.fullscreen="sumitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitle'></span>
      </div>
      <div>
        <subject class='doc-section' ref="subject" @submitStart="submitStart" reciverTtitle="校对人"></subject>
        <description class='doc-section' ref="description" @submitEnd="submitEnd" :options="options">
          <manuscript-app ref="manuscript" @submitMiddle="submitMiddle"></manuscript-app>
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
import Subject from './component/subject.component.vue'
import Description from './component/description.component.vue'
import ManuscriptApp from './component/manuscriptApp.component.vue'
import suggestPath from '../../assets/images/suggestPath1.png'

export default {
  data() {
    return {
      docTitle: '发文稿纸',
      middleParams: '',
      options: { docType: 'FWG' }
      
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
    ManuscriptApp
  },
  methods: {
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
      this.$refs.subject.submitForm();
    },
    submitStart(val) {
      if (val) {
        this.$refs.manuscript.submitForm();
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
      console.log(params)
      if (params) {
        this.$store.dispatch('submitDoc', { params: Object.assign(params, this.middleParams), docTypeCode: 'FWG', url: '/doc/docFile' });
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
#manuscriptApp {}

</style>
