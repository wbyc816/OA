<template>
  <div class="empBecomeDetail">
    <!-- <el-col :span="12" class="rightBorder">
      <h1 class="title">入公司时间</h1>
      <p v-if="info" class="textContent">{{info[0].probationTime | time('ch')}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">签订合同时间</h1>
      <p v-if="info" class="textContent">{{info[0].contractDate | time('ch')}}</p>
    </el-col> -->
    <el-col :span="12" class="rightBorder">
      <h1 class="title">试用期开始</h1>
      <p v-if="info" class="textContent">{{info[0].probationTime | time('ch')}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">试用期结束</h1>
      <p v-if="info" class="textContent">{{info[0].probationEndTime | time('ch')}}</p>
    </el-col>
    <el-col :span="24" style="min-height:90px">
      <h1 class="title">自我评价</h1>
      <p v-if="info" class="textContent">{{info[0].evaluation}}</p>
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
.empBecomeDetail {

}

</style>
