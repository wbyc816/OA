<template>
  <div id='approval' v-loading.fullscreen="submitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitle'></span>
      </div>
      <div>
        <subject class='doc-section' ref="subject" @submitStart="submitStart"></subject>
        <description class='doc-section' ref="description" @submitEnd="submitEnd" :options="options"></description>
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
// import suggestPath from '../../assets/images/suggestPath.png'
export default {
  data() {
    return {
      docTitle: '呈批单',
      options: { docType: 'CPD' }
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  components: {
    Subject,
    Description,
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('clear');
    next();
  },
  methods: {
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
      this.$refs.subject.submitForm();
      console.log(1);
    },
    submitStart(val) {
      if (val) {
        console.log(3);
        this.$refs.description.submitForm();
      } else {
        console.log(3);
        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    },
    submitEnd(params) {
      console.log(params);
      if (params) {
        this.$store.dispatch('submitDoc', { params: params, docTypeCode: 'CPD', url: '/doc/submitDoc' })
      } else {

        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    }
  }
}

</script>
<style lang='scss'>


</style>
