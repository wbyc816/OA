<template>
  <div class="quitDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">入公司时间</h1>
      <p class="textContent">{{info.joinDate | time('ch')}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">预计离职日期</h1>
      <p v-if="info" class="textContent">{{info.planDimissionDate | time('ch')}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">申请日期</h1>
      <p v-if="info" class="textContent">{{+new Date(info.taskTime.slice(0,10)) | time('ch')}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">辞职理由</h1>
      <p v-if="info" class="textContent">{{info.dimissionReasonName}}</p>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    info: {
      type: Object
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
  created(){
    console.log(1111)
  },
  methods: {
    
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.quitDetail {
  .el-input {
    width: 100%;
  }
  .el-tag{
    margin-bottom: 5px;
  }
}

</style>
