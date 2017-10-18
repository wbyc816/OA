<template>
  <div id='materialApp' v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitle'></span>
      </div>
      <div>
        <subject class='doc-section' ref="subject" @submitStart="submitStart"></subject>
        <description class='doc-section' ref="description" @submitEnd="submitEnd" :options="options">
          <material-app ref="material" @submitMiddle="submitMiddle"></material-app>
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
import MaterialApp from './component/materialApp.component.vue'
// import suggestPath from '../../assets/images/suggestPath1.png'

export default {
  data() {
    return {
      docTitle: '材料申请',
      middleParams: '',
      options: { docType: 'CLS' }
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('clear');
    next();
  },
  components: {
    Subject,
    Description,
    MaterialApp
  },
  methods: {
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
      this.$refs.subject.submitForm();
    },
    submitStart(val) {
      if (val) {
        this.$refs.material.checkEmpty();
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
        this.$store.dispatch('submitDoc', { params: Object.assign(params, this.middleParams), docTypeCode: 'CLS', url: '/doc/materialDoc' });
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
#materialApp {}

</style>
