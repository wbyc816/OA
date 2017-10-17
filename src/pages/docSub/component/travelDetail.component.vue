<template>
  <div class="travelDetail">
    <el-col :span="24">
      <h1 class="title">出差时间</h1>
      <p v-if="info" class="textContent">{{info[0].startTime | time('all')}} ~ {{info[0].endTime | time('all')}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">出发地</h1>
      <p v-if="info" class="textContent">{{info[0].deptArea}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">目的地</h1>
      <p v-if="info" class="textContent">{{info[0].arrArea}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">出差人列表</h1>
      <p v-if="info" class="textContent">
        <el-tag type="primary" v-for="person in info[0].appPerson">{{person.travelUserName}}</el-tag>
      </p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">机票意向</h1>
      <div v-if="info" class="textContent">
        <p v-if="info[0].isBookFlight==1" class="bookFlight">
          <span class="iconfont">预定机票</span>
          <span class="iconfont">{{type}}</span>
        </p>
        <p v-else>否</p>
      </div>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">出差总预算</h1>
      <p v-if="info" class="textContent">{{info[0].budgetMoney}}元</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">超预算</h1>
      <p v-if="info" class="textContent" style="color:#0460AE">否</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">报销归口</h1>
      <p v-if="info" class="textContent">{{info[0].budgetItemName}}</p>
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
.travelDetail {
  .el-input {
    width: 100%;
  }
  .bookFlight{
    color:$main;
    span{
      position:relative;
      display: inline-block;
      margin-right: 60px;
      &:before{
        content: "\E6B7";
        position: absolute;
        font-size: 27px;
        right: -30px;
        top:-2px;
      }
    }
  }
  .el-tag{
    margin-bottom: 5px;
  }
}

</style>
