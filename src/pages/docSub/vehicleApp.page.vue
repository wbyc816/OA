<template>
  <div id='vehicleApp' v-loading.fullscreen="sumitLoading">
    <el-card>
      <div slot="header" class='doc_title'>
        <span v-text='docTitle'></span>
      </div>
      <div>
        <subject class='doc-section' ref="subject" @submitStart="submitStart"></subject>
        <description class='doc-section' ref="description" @submitEnd="submitEnd" :options="options">
          <vehicle-app ref="vehicle" @submitMiddle="submitMiddle"></vehicle-app>
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
import VehicleApp from './component/vehicleApplication.component.vue'
import suggestPath from '../../assets/images/suggestPath1.png'

export default {
  data() {
    return {
      docTitle: '用车申请',
      middleParams: '',
      options: { suggestPath: suggestPath }
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
    VehicleApp
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch('clear');
    next();
  },
  methods: {
    submitDoc() {
      this.$store.commit('SET_SUBMIT_LOADING', true)
      this.$refs.subject.submitForm();
    },
    submitStart(val) {
      if (val) {
        this.$refs.vehicle.submitForm();
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
        this.$store.dispatch('submitDoc', { params: Object.assign(params, this.middleParams), docTypeCode: 'YCS', url: '/doc/vehicleApplication' });
        this.middleParams = '';
      } else {
        this.$store.commit('SET_SUBMIT_LOADING', false)
      }
    }
  }
}

</script>
<style lang='scss'>


</style>
