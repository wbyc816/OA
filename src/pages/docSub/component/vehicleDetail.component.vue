<template>
  <div class="vehicleDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">申请类型</h1>
      <p v-if="info" class="textContent">{{info[0].subtypeName}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">是否过夜</h1>
      <p v-if="info" class="textContent">{{info[0].isPassNight===1?'是':'否'}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">用车时间</h1>
      <p v-if="info" class="textContent">{{info[0].startTime | time('all')}} ~ {{info[0].endTime | time('all')}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">联系人</h1>
      <p v-if="info" class="textContent">{{info[0].contactUserName}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">联系电话</h1>
      <p v-if="info" class="textContent">{{info[0].contactPhone}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">用车部门</h1>
      <p v-if="info" class="textContent">{{info[0].contactDeptName}}</p>
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
.vehicleDetail {
  .el-input {
    width: 100%;
  }
}

</style>
