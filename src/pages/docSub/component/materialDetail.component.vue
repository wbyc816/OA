<template>
  <div class="materialDetail">
    <el-table :data="info" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加材料">
      <el-table-column type="expand">
        <template scope="props">
          <div class="remarkBox">
            <span>预算机构/科目</span>
            <p>{{props.row.budgetDeptName}}/{{props.row.budgetItemName}}</p>
          </div>
          <div class="remarkBox">
            <span>预算年度</span>
            <p>{{props.row.budgetYear}}</p>
          </div>
          <div class="remarkBox">
            <span>费用归属部门</span>
            <p>{{props.row.budgetDeptName}}</p>
          </div>
          <div class="remarkBox">
            <span>执行比例</span>
            <p>{{props.row.budgetExeststisVo.cExecRate}}</p>
          </div>
          <div class="remarkBox">
            <span>币种</span>
            <p>{{props.row.accurencyName}}</p>
          </div>
          <div class="remarkBox">
            <span>人民币</span>
            <p>{{props.row.rmb}}元</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="productName" label="物品名称"></el-table-column>
      <el-table-column property="specification" label="型号" width="65"></el-table-column>
      <el-table-column property="plannedUnitPrice" label="单价" width="110"></el-table-column>
      <el-table-column property="quantity" label="数量" width="100"></el-table-column>
      <el-table-column property="money" label="总价" width="160"></el-table-column>
    </el-table>
    <p class="totalPrice" v-show="totalMoney!=0">合计人民币<span>{{totalMoney | toThousands}}元 {{totalMoney | moneyCh}}</span></p>
    <el-row style="border-top: 1px solid #D5DADF;">
      <el-col :span="12" class="rightBorder">
        <h1 class="title">总金额</h1>
        <p v-if="info" class="textContent">{{totalMoney}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">币种</h1>
        <p v-if="info" class="textContent">{{info[0].accurencyName}}</p>
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
    return {}
  },
  mounted() {},
  computed: {
    totalPrice: function() {
      if (this.info.length != 0) {
        var num = 0;
        this.info.forEach(m => {
          num += m.plannedUnitPrice * m.quantity
        })
        return parseFloat(this.numFixed2(num))
      } else {
        return 0
      }
    },
    totalMoney() {
      var num = 0;
      this.info.forEach(m => {
        num += parseFloat(m.money)
      })
      return parseFloat(this.numFixed2(num))
    },
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
.materialDetail {
  padding: 20px 0;
  clear: both;
  .totalPrice {
    line-height: 40px;
    padding-right: 15px;
    border: 1px solid #D5DADF;
    border-top: none;
    font-size: 15px;
    text-align: right;
    margin-bottom: 20px;
    span {
      margin-left: 5px;
      color: $main;
    }
  }
  .remarkBox {
    overflow: hidden;
    display: table;
    font-size: 15px;
    table-layout: fixed;
    min-height: 57px;
    width: 50%;
    float: left;
    span {
      color: #99a9bf;
      padding: 0 0 0 10px;
      line-height: 36px;
      width: 117px;
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
