<template>
  <div class="materialDetail">
    <el-table :data="info[0].material" empty-text="未添加材料" class="appTable">
      <el-table-column type="index" label=" " width="40"></el-table-column>
      <el-table-column property="productName" label="品名" width="180"></el-table-column>
      <el-table-column property="specification" label="规格" width="90"></el-table-column>
      <el-table-column property="plannedUnitPrice" label="计划单价" width="100"></el-table-column>
      <el-table-column property="quantity" label="数量" width="90"></el-table-column>
      <el-table-column property="remark" label="备注"></el-table-column>
    </el-table>
    <p class="totalPrice" v-show="totalPrice!=0">合计金额<span>{{totalPrice | toThousands}}元 {{totalPrice | moneyCh}}</span></p>
    <el-table :data="info[0].materialItem" :stripe="true" highlight-current-row  class="appTable">
      <el-table-column type="expand">
        <template scope="props">
          <div class="remarkBox">
            <span>说明</span>
            <p>{{props.row.remark}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column property="budgetYear" label="预算年度" width="75">
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
      if (this.info[0].material.length != 0) {
        var num = 0;
        this.info[0].material.forEach(m => {
          num += m.plannedUnitPrice * m.quantity
        })
        return parseFloat(this.numFixed2(num))
      } else {
        return 0
      }
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
