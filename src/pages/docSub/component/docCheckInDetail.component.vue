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
    <el-col :span="12" class="rightBorder">
      <h1 class="title">发文目录</h1>
      <p v-if="info" class="textContent">{{info[0].catalogueId}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">来文文号</h1>
      <p v-if="info" class="textContent">{{info[0].wordNo}}</p>
    </el-col>
    <el-col :span="24">
      <h1 class="title">正文</h1>
      <p v-if="info" class="textContent attch">{{info[0].fileName}}.pdf</p>
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
      'sumitLoading'
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
