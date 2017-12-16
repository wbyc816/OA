<template>
  <div class="commonBudgetDetail clearfix">
    <el-table :data="info[0].docCommonFinItem" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
      <el-table-column type="expand">
        <template scope="props">
          <div class="remarkBox">
            <span>说明</span>
            <p>{{props.row.remark}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="budgetDeptName" label="预算年度" width="75">
        <template scope="scope">
          {{info[0].budgetExeststisVos[scope.$index].budgetYear}}
        </template>
      </el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目">
        <template scope="scope">
          {{scope.row.budgetDeptName}}/{{scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="accurencyName" label="币种" width="75"></el-table-column>
      <el-table-column property="money" label="申请金额" width="140"></el-table-column>
      <el-table-column property="rmb" label="人民币(元)" width="125"></el-table-column>
    </el-table>
    <p class="totalMoney">合计金额 人民币 <span>{{info[0].docCommonFin.totalMoneyRmb | toThousands}}元 {{info[0].docCommonFin.totalMoneyRmb | moneyCh}}</span></p>
    <el-row style="border-top: 1px solid #D5DADF;margin-top:20px;">
      <el-col :span="24">
        <h1 class="title">呈批单子类型</h1>
        <p v-if="info" class="textContent">{{info[0].docCommonFin.docCommonTypeName}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">收款供应商</h1>
        <p v-if="info" class="textContent">{{info[0].docCommonFin.supplierName}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">收款账户</h1>
        <p v-if="info" class="textContent">{{info[0].docCommonFin.supplierBankAccountName}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title">开户行</h1>
        <p v-if="info" class="textContent">{{info[0].docCommonFin.supplierBank}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title">收款账号</h1>
        <p v-if="info" class="textContent">{{info[0].docCommonFin.supplierBankAccountCode}}</p>
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
    totalPrice: function() {
      if (this.info.length != 0) {
        var num = 0;
        this.info.forEach(m => {
          num += m.plannedUnitPrice * m.quantity
        })
        return num
      } else {
        return 0
      }
    },
    ...mapGetters([
      'submitLoading'
    ])
  },
  methods: {
    formatMoney(row, column, cellValue) {
      return this.toThousands(cellValue)
    },
    cc(scope){
      console.log(scope)
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.commonBudgetDetail {
  padding: 20px 0 0;
  clear: both; // border-bottom: 1px solid #D5DADF;
  .totalPrice {
    line-height: 40px;
    padding-left: 15px;
    border: 1px solid #D5DADF;
    border-top: none;
    font-size: 15px;
    span {
      margin-left: 5px;
      color: $main;
    }
  }
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
  .borderBox {
    padding-bottom: 20px;
    border-bottom: 1px solid #D5DADF;
  }
  .budgetTable {
    margin-top: 20px; // padding-bottom:20px;
    // border-bottom: 1px solid #D5DADF;
    .el-table__header th {
      background: #939393;
    }
    .el-table__header-wrapper thead div,
    .el-table__footer-wrapper thead div {
      background: #939393;
    }
  }
  .remarkBox {
    overflow: hidden;
    display: table;
    font-size: 15px;
    table-layout: fixed;
    min-height: 57px;
    span {
      color: #99a9bf;
      padding: 0 0 0 10px;
      line-height: 36px;
      width: 90px;
      display: table-cell;
      vertical-align: middle;
      word-wrap: break-word;
      word-break: break-word;
    }
    p {
      display: table-cell;
      vertical-align: middle;
      overflow: hidden;
      word-wrap: break-word;
      line-height: 19px;
      word-break: break-word;
    }
  }
}

</style>
