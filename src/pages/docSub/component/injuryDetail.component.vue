<template>
  <div class="injuryDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">申请时间</h1>
      <p v-if="info" class="textContent">{{info[0].taskTime.slice(0,4)}}年{{info[0].taskTime.slice(5,7)}}月{{info[0].taskTime.slice(8,10)}}日</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">受伤时间</h1>
      <p v-if="info" class="textContent">{{info[0].injuryDate | time('ch')}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">医院</h1>
      <p v-if="info" class="textContent">{{info[0].hospital}}</p>
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
.injuryDetail {

}

</style>
