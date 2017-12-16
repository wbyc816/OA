<template>
  <div class="airExchangeDetail clearfix">
    <el-table :data="info[0].items" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
      <el-table-column property="budgetDeptName" label="预算机构/科目" width="200">
        <template scope="scope">
          {{scope.row.budgetDeptName}}/{{scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="executeRate" label="执行比例" width="90"></el-table-column>
      <el-table-column property="changeIntoMaterialName" label="换入器件名称" width="200"></el-table-column>
      <el-table-column property="changeIntoPieceNo" label="换入件号" width="90"></el-table-column>
      <el-table-column property="changeIntoSequenceNo" label="换入序号" width="90"></el-table-column>
      <el-table-column property="changeIntoNum" label="换入数量" width="90"></el-table-column>
      <el-table-column property="ourPayment" label="我方支付" width="90"></el-table-column>
      <el-table-column property="otherPayment" label="对方支付" width="90"></el-table-column>
      <el-table-column property="changeOutMaterialName" label="换出器件名称" width="200"></el-table-column>
      <el-table-column property="changeOutPieceNo" label="换出件号" width="90"></el-table-column>
      <el-table-column property="changeOutSequenceNo" label="换出序号" width="90"></el-table-column>
      <el-table-column property="changeOutNum" label="换出数量" width="90"></el-table-column>
    </el-table>
    <p class="totalMoney">合计金额 人民币 <span>{{info[0].rmb | toThousands}}元 {{info[0].rmb | moneyCh}}</span></p>
    <el-row style="border-top: 1px solid #D5DADF;margin-top:20px;">
      <el-col :span="12" class="rightBorder">
        <h1 class="title">优先级</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.priority}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">币种</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.accurencyName}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">供应商名称</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.supplierName}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">开户行</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.supplierBank}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">收款账户</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.supplierBankAccountName}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">付款方式</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.isAdvancePayment==1?'预付':'后付'}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">填表日期</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.createTime | time('date')}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">金额总计</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.rmb | toThousands}}元</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title" style="width:380px">选择供应商是否为独家修理厂家</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.isSupplierUnique==1?'是':'否'}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title" style="width:380px">选择供应商是否为协议供应商</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.isSupplierProtocol==1?'是':'否'}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title" style="width:380px">选择供应商是否为我公司已审核修理厂家</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.isSupplierCheck==1?'是':'否'}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title" style="width:380px">新件参考价格</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.newReferencePrice}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title" style="width:380px">购买该送修件参考价格</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.purchaseReferencePrice}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title" style="width:380px">修理费与购件费比例</h1>
        <p v-if="info" class="textContent">{{info[0].airmRor.repairPurchasePriceRate}}</p>
      </el-col>
    </el-row>
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
.airExchangeDetail {
  padding: 20px 0 0;
  clear: both; // border-bottom: 1px solid #D5DADF;
  .totalMoney {
    text-align: right;
    font-size: 15px;
    line-height: 38px;
    padding-right: 30px;

    border: 1px solid #D5DADF;
    border-top: none;
    span {
      color: $main;
    }
  }
  .budgetTable {
    margin-top: 20px;
    .el-table__header th {
      background: #939393;
    }
    .el-table__header-wrapper thead div,
    .el-table__footer-wrapper thead div {
      background: #939393;
    }
  }
}

</style>
