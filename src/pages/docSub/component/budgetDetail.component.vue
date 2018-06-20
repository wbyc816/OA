<template>
  <div class="budgetDetail">
    <el-table  :data="info[0].finBudgetItems" :stripe="true" highlight-current-row style="width: 100%" class="appTable" v-if="info&&info[0].finBudgetItems">
      <el-table-column label=" " width="50" class-name="upDown">
        <template scope="scope">
          <span v-if="parseFloat(scope.row.money)>0" style="background:rgb(72, 153, 223)">调增</span>
          <span v-else style="background:#FF8460">调减</span>
        </template>
      </el-table-column>
      <el-table-column label="预算年度" property="budgetYear" width="80"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目" >
        <template scope="scope">
          {{scope.row.budgetDeptName+'/'+scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="budgetTotal" label="年度预算(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="budgetRemain" label="可用额度(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="budgetRate" label="执行比例" width="80"></el-table-column>
      <el-table-column property="money" label="申报额度(元)" :formatter="formatMoney" width="130"></el-table-column>
    </el-table>

    <el-table  :data="info[0].finBudgetChanges" :stripe="true" highlight-current-row style="width: 100%" class="appTable" v-if="info&&info[0].finBudgetChanges">
      <el-table-column label=" " width="50" class-name="upDown">
        <template scope="scope">
          <span v-if="parseFloat(scope.row.money)>0" style="background:rgb(72, 153, 223)">调增</span>
          <span v-else style="background:#FF8460">调减</span>
        </template>
      </el-table-column>
      <el-table-column label="预算年度" property="budgetYear"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目"  >
        <template scope="scope">
          {{scope.row.budgetDeptName+'/'+scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <!-- <el-table-column property="budgetTotal" label="年度预算(元)" :formatter="formatMoney" width="130"></el-table-column> -->
      <!-- <el-table-column property="budgetRemain" label="可用额度(元)" :formatter="formatMoney" width="130"></el-table-column> -->
      <el-table-column property="budgetNewName" label="申请机构/科目"></el-table-column>
      <el-table-column property="money" label="申报额度(元)" :formatter="formatMoney" width="130"></el-table-column>
    </el-table>
    <p class="totalPrice" v-show="totalPrice!=0" v-if="info">合计金额<span>{{totalPrice}}元 {{totalPrice | moneyCh}}</span></p>
    <el-col :span="24">
      <h1 class="title">申请类型</h1>
      <p v-if="docDetialInfo" class="textContent">{{docDetialInfo.typeCodes}}</p>
    </el-col>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    info:'',
    docDetialInfo:''
  },
  data() {
    return {

    }
  },
  computed: {
    totalPrice: function() {
      return this.info[0].totalMoney
    },
    ...mapGetters([
      'submitLoading'
    ])
  },
  created(){
    console.log(this.docDetialInfo)
  },
  methods: {
    formatMoney(row, column, cellValue) {
      return this.toThousands(cellValue)
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.budgetDetail {
  // padding: 20px 0;
  clear: both; // border-bottom: 1px solid #D5DADF;
  .totalPrice {
    text-align: right;
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
  .upDown {
    .cell {
      padding-left: 0;
      span {
        color: #fff;
        width: 42px;
        height: 42px;
        line-height: 37px;
        display: inline-block;
        text-align: center;
        font-size: 14px;
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        padding: 3px;
      }
    }
  }
}

</style>
