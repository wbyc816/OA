<template>
  <div class="docCheckInDetail">
    <el-col :span="24">
      <h1 class="title">呈批单子类型</h1>
      <p v-if="info" class="textContent">{{info[0].docCommon.docCommonTypeName}}</p>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    info: {
      type: Array
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  created() {},
  methods: {

  }
}

</script>
<style lang='scss'>
$main:#0460AE;

</style>
