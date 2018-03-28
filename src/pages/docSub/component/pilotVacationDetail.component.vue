<template>
  <div class="vacationDetail">
    <el-col :span="24">
      <h1 class="title">休假时间</h1>
      <p v-if="info" class="textContent">{{info[0].startDate}} {{info[0].startTime}} ~ {{info[0].endDate}} {{info[0].endTime}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">休假天数</h1>
      <p v-if="info" class="textContent">{{info[0].days}}天</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">休假类型</h1>
      <p v-if="info" class="textContent">{{info[0].typeName}}</p>
    </el-col>

    <el-col :span="12" class="rightBorder">
      <h1 class="title">机长/副驾驶</h1>
      <p v-if="info" class="textContent">{{info[0].role=="EMP1001"?"机长":"副驾驶"}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">飞行分部</h1>
      <p v-if="info" class="textContent">{{info[0].branch=="EMP1101"?"一分部":"二分部"}}</p>
    </el-col>

    <el-col :span="24" style="min-height:90px">
      <h1 class="title">工作交接</h1>
      <p v-if="info" class="textContent">{{info[0].handOver}}</p>
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
.vacationDetail {
  .el-col{
    background:#F7F7F7;
  }
  .remain{
    color:$main;
    display: inline-block;
    margin-left: 10px;
    padding-left:10px;
    border-left: 1px solid #D5DADF; 
  }
}

</style>
