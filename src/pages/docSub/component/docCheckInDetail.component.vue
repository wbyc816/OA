<template>
  <div class="docCheckInDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">收文类型</h1>
      <p v-if="info" class="textContent">{{info[0].classify1}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">收文种类</h1>
      <p v-if="info" class="textContent">{{info[0].classify2}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">收文目录</h1>
      <p v-if="info" class="textContent">{{info[0].catalogueName}}</p>
    </el-col>
    <!-- <el-col :span="12">
      <h1 class="title">来文文号</h1>
      <p v-if="info" class="textContent">{{info[0].wordNo}}</p>
    </el-col> -->
    <!-- <el-col :span="24">
      <h1 class="title">来文单位</h1>
      <p v-if="info" class="textContent">{{info[0].receiveCompany}}</p>
    </el-col> -->
    <el-col :span="24">
      <h1 class="title">正文</h1>
      <p v-if="info" class="textContent attch"><a :href="info[0].url" target="_blank">{{info[0].fileName}}</a></p>
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
  created(){
  },
  methods: {
    
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.docCheckInDetail {
  .el-input {
    width: 100%;
  }
}

</style>
