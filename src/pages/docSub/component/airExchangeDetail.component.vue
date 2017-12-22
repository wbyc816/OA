<template>
  <div class="airExchangeDetail clearfix">
    <el-table :data="info[0].items" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
      <el-table-column type="expand">
        <template scope="props">
          <div class='tableExpandBox'>
            <div class="width50">
              <div>
                <span>预算机构/科目</span>
                <p>{{props.row.budgetDeptName}}/{{props.row.budgetItemName}}</p>
              </div>
              <div>
                <span>预算年度</span>
                <p>{{props.row.budgetYear}}</p>
              </div>
            </div>
            <div class="width50">
              <div>
                <span>执行比例</span>
                <p>{{props.row.executeRate}}</p>
              </div>
              <div>
                <span>换入器件名称</span>
                <p>{{props.row.changeIntoMaterialName}}</p>
              </div>
            </div>
            <div class="width50">
              <div>
                <span>换入件号</span>
                <p>{{props.row.changeIntoPieceNo}}</p>
              </div>
              <div>
                <span>换入数量</span>
                <p>{{props.row.changeIntoNum}}</p>
              </div>
            </div>
            <div class="width50">
              <div>
                <span>对方支付</span>
                <p>{{props.row.otherPayment}}</p>
              </div>
              <div>
                <span>我方支付</span>
                <p>{{props.row.ourPayment}}</p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="changeOutMaterialName" label="换出器件名称"></el-table-column>
      <el-table-column property="changeOutNum" label="换出数量" width="90"></el-table-column>
      <el-table-column property="changeOutPieceNo" label="换出件号" width="120"></el-table-column>
      <el-table-column property="changeOutSequenceNo" label="换出序号" width="120"></el-table-column>
      <el-table-column property="ourPayment" label="金额总计" width="150"></el-table-column>
    </el-table>
    <p class="totalMoney">合计金额 人民币 <span>{{info[0].rmb | toThousands}}元 {{info[0].rmb | moneyCh}}</span></p>
    <el-row style="border-top: 1px solid #D5DADF;margin-top:20px;">
      <el-col :span="12" class="rightBorder">
        <h1 class="title">优先级</h1>
        <p v-if="info" class="textContent">{{info[0].priority}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">币种</h1>
        <p v-if="info" class="textContent">{{info[0].accurencyName}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">供应商名称</h1>
        <p v-if="info" class="textContent">{{info[0].supplierName}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">开户行</h1>
        <p v-if="info" class="textContent">{{info[0].supplierBank}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">收款账户</h1>
        <p v-if="info" class="textContent">{{info[0].supplierBankAccountName}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">银行账号</h1>
        <p v-if="info" class="textContent">{{info[0].supplierBankAccountCode}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">订货周期</h1>
        <p v-if="info" class="textContent">{{info[0].orderCycle}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">需求日期</h1>
        <p v-if="info" class="textContent">{{info[0].requestDate | time('date')}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">前期询价对比</h1>
        <p v-if="info" class="textContent">{{info[0].earlyInquiryCompare}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">付款方式</h1>
        <p v-if="info" class="textContent">{{info[0].isAdvancePayment==1?'预付':'后付'}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">填表日期</h1>
        <p v-if="info" class="textContent">{{info[0].createTime | time('date')}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">金额总计</h1>
        <p v-if="info" class="textContent">{{info[0].rmb | toThousands}}元</p>
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
