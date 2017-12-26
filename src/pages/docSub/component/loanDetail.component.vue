<template>
  <div class="loanDetail">
    <el-col :span="12" class="rightBorder">
      <h1 class="title">申请金额</h1>
      <p v-if="info" class="textContent">{{info[0].accurencyName}}{{info[0].money | toThousands}}元</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">付款方式</h1>
      <p v-if="info" class="textContent">{{info[0].paymentMethodName}}</p>
    </el-col>
    <el-col :span="12" class="rightBorder">
      <h1 class="title">收款人</h1>
      <p v-if="info" class="textContent">{{info[0].gatherName}}</p>
    </el-col>
    <el-col :span="12">
      <h1 class="title">收款账户</h1>
      <p v-if="info" class="textContent">{{info[0].gatherAccount}}</p>
    </el-col>
     <el-col :span="12">
      <h1 class="title">借款期限</h1>
      <p v-if="info" class="textContent">{{info[0].borrowTerm=="FIN0802"?"短期":"长期"}}</p>
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
.loanDetail {

}

</style>
