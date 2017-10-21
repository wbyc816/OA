<template>
  <div class="budgetDetail">
    <el-table :data="info[0].finBudgetItems" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
      <el-table-column  label="预算年度" property="budgetYear" width="80"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目">
        <template scope="scope">
          {{scope.row.budgetDeptName+'/'+scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="budgetTotal" label="年度预算(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="budgetRemain" label="可用额度(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="budgetRate" label="执行比例" width="80"></el-table-column>
      <el-table-column property="money" label="申报额度(元)" :formatter="formatMoney" width="130"></el-table-column>
    </el-table>
    <!-- <p class="totalPrice" v-show="totalPrice!=0">合计金额<span>{{totalPrice}}元</span></p> -->
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
    totalPrice:function(){
      if(this.info.length!=0){
        var num=0;
        this.info.forEach(m=>{
          num+=m.plannedUnitPrice*m.quantity
        })
        return num
      }else{
        return 0
      }
    },
    ...mapGetters([
      'submitLoading'
    ])
  },
  methods: {
    formatMoney(row, column, cellValue){
      return this.toThousands(cellValue)
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.budgetDetail {
  padding:20px 0;
  clear:both;
  border-bottom: 1px solid #D5DADF;
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
}

</style>
