<template>
  <div class="airSellDetail clearfix">
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
                <span>序号</span>
                <p>{{props.row.airmaterialCode}}</p>
              </div>
            </div>
            <div class="width50">
              <div>
                <span>预算年度</span>
                <p>{{props.row.budgetYear}}</p>
              </div>
              <div>
                <span>单位</span>
                <p>{{props.row.unit}}</p>
              </div>
            </div>
            <div class="width50">
              <div>
                <span>执行比例</span>
                <p>{{props.row.excutionRatio}}</p>
              </div>
              <div>
                <span>件状态</span>
                <p>{{props.row.pieceStatus}}</p>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="airmaterialNameZn" label="器材中文名称"></el-table-column>
      <el-table-column property="pieceNo" label="件号" width="120"></el-table-column>
      <el-table-column property="pieceNum" label="合同数量"></el-table-column>
      <el-table-column property="unitPrice" label="单价" width="120"></el-table-column>
      <el-table-column property="totalPrice" label="总价" width="150"></el-table-column>
    </el-table>
    <p class="totalMoney">合同总金额 人民币 <span>{{info[0].rmbTotalMoney | toThousands}}元 {{info[0].rmbTotalMoney | moneyCh}}</span></p>
    <el-row style="border-top: 1px solid #D5DADF;margin-top:20px;">
      <el-col :span="12" class="rightBorder">
        <h1 class="title">合同子类型</h1>
        <p v-if="info" class="textContent">{{info[0].contractSubtypeName}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">优先级</h1>
        <p v-if="info" class="textContent">{{info[0].priority}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">币种</h1>
        <p v-if="info" class="textContent">{{info[0].accurencyName}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">供应商名称</h1>
        <p v-if="info" class="textContent">{{info[0].supplierName}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">开户行</h1>
        <p v-if="info" class="textContent">{{info[0].supplierBank}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">收款账户</h1>
        <p v-if="info" class="textContent">{{info[0].supplierBankAccoutName}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">银行账号</h1>
        <p v-if="info" class="textContent">{{info[0].supplierBankAccoutCode}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">填表日期</h1>
        <p v-if="info" class="textContent">{{info[0].createTime | time('date')}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">付款方式</h1>
        <p v-if="info" class="textContent">{{info[0].isAdvancePayment==1?'预付':'后付'}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">合同总金额</h1>
        <p v-if="info" class="textContent">{{info[0].totalManey | toThousands}}</p>
      </el-col>
      <el-col :span="24" v-if="info&&info[0].isAdvancePayment==1">        
        <h1 class="title">预付款百分比</h1>
        <p v-if="info" class="textContent">{{info[0].advancePaymentPercent}}%</p>
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
.airSellDetail {
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
