<template>
  <div class="materialDetail">
    <el-table :data="info" :stripe="true" highlight-current-row style="width: 100%" empty-text="未添加材料" class="appTable">
      <el-table-column type="index" label=" " width="40"></el-table-column>
      <el-table-column property="productName" label="品名" width="180"></el-table-column>
      <el-table-column property="specification" label="规格" width="90"></el-table-column>
      <el-table-column property="plannedUnitPriceL" label="计划单价" width="100"></el-table-column>
      <el-table-column property="quantity" label="数量" width="90"></el-table-column>
      <el-table-column property="remark" label="备注"></el-table-column>
    </el-table>
    <p class="totalPrice" v-show="totalPrice!=0">合计金额<span>{{totalPrice}}元</span></p>
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
      'sumitLoading'
    ])
  },
  methods: {

  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.materialDetail {
  padding:20px 0;
  clear:both;
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
