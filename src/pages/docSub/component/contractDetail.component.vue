<template>
  <div class="contractDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">供应商</h1>
      <p v-if="info" class="textContent">{{info[0].supplierName}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">合同类型</h1>
      <p v-if="info" class="textContent">{{info[0].contractTypeName}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">合同期限</h1>
      <p v-if="info" class="textContent">{{info[0].contractStartTime | time('ch')}}-{{info[0].contractEndTime | time('ch')}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">押金</h1>
      <p v-if="info" class="textContent">{{info[0].contractCashPledge}}元</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">公司范文</h1>
      <p v-if="info" class="textContent">{{info[0].isContractModel==1?'是':'否'}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">范文改动</h1>
      <p v-if="info" class="textContent">{{info[0].isContractModelModification==1?'是':'否'}}</p>
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
.contractDetail {

}

</style>
