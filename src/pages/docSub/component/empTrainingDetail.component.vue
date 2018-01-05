<template>
  <div class="trainingDetail">
    <el-col :span="13" class="rightBorder">
      <h1 class="title">参训日期</h1>
      <p v-if="info" class="textContent">{{info[0].trainDate | time('ch')}} - {{info[0].trainEndDate | time('ch')}}</p>
    </el-col>
    <el-col :span="11">
      <h1 class="title">培训科目</h1>
      <p v-if="info" class="textContent">{{info[0].trainSubjects}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">参训部门/处室</h1>
      <p v-if="info" class="textContent">{{info[0].trainDeptMajorName}}/{{info[0].trainDeptName}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">参训人员</h1>
      <p v-if="info" class="textContent">
        <el-tag type="primary" v-for="person in info[0].persons">{{person.trainEmpName}}</el-tag>
      </p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">培训总预算</h1>
      <p v-if="info" class="textContent">{{info[0].trainTotalCost}}元</p>
    </el-col>
    <el-col :span="12" >
      <h1 class="title">单人培训差旅费</h1>
      <p v-if="info" class="textContent">{{info[0].trainPerTravelCost}}元</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">单人培训费用</h1>
      <p v-if="info" class="textContent">{{info[0].trainPerTrainlCost}}元</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">单人预算总费用</h1>
      <p v-if="info" class="textContent">{{info[0].trainPerCost}}元</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">参训人数</h1>
      <p v-if="info" class="textContent">{{info[0].trainPerCount}}人</p>
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
      type:''
    }
  },
  computed: {
    ...mapGetters([
      'submitLoading'
    ])
  },
  created(){
    if(this.info[0].isBookFlight==1){
      this.getType();
    }
  },
  methods: {
    getType(){
      this.$http.post('/api/getDict',{dictCode:'ADM05'})
      .then(res=>{
        if(res.status==0){
          this.type=res.data.find(i=>i.dictCode==this.info[0].bookType).dictName;
        }
      })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.trainingDetail {
  .el-input {
    width: 100%;
  }
  .el-tag{
    margin-bottom: 5px;
  }
}

</style>
