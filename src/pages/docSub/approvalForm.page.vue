<template>
  <div id='approval' v-loading.fullscreen="sumitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitle'></span>
      </div>
      <div>
        <subject class='doc-section' ref="subject" @submitSub="submitSub"></subject>
        <description class='doc-section' ref="description" @submitDes="submitDes"></description>
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
export default {
  data() {
    return {
      docTitle: '呈批单',
    }
  },
  computed: {
    ...mapGetters([
      'sumitLoading'
    ])
  },
  components: {
    Subject,
    Description,
  },
  methods: {
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
      this.$refs.subject.submitForm();
      console.log(1);
    },
    submitSub(val) {
      if (val) {
        console.log(3);
        this.$refs.description.submitForm();
      } else {
        console.log(3);
        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    },
    submitDes(params) {
      console.log(params);
      if (params) {
        this.$store.dispatch('submitDoc', params)
      } else {

        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    }
  }
}

</script>
<style lang='scss'>


</style>
