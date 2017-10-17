<template>
  <div class="empUpgradeDetail">
    <el-col :span="12">
      <h1 class="title">晋升员工</h1>
      <p v-if="info" class="textContent">{{info[0].empName}}</p>
    </el-col>
    <el-col :span="12" class="blank">
      <h1 class="title"></h1>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props:{
    info:{
      type:Array
    }
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  methods: {

  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.empUpgradeDetail {

}

</style>
