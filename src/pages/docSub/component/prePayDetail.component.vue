<template>
  <div class="reimburseDetail clearfix">
    <el-table :data="info[0].items" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
      <el-table-column label="预算年度" property="budgetYear" width="80"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目">
        <template scope="scope">
          {{scope.row.budgetDeptName+'/'+scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <!-- <el-table-column property="invoiceTypeName" label="发票类型" width="100"></el-table-column> -->
      <el-table-column property="receiptTicket" label="增值税票号" width="130">
        <template scope="scope">
          <el-tooltip effect="dark" :content="scope.row.receiptTicket" placement="top">
            <div>
              <p v-for="(code,index) in scope.row.receiptTicket.split(',')" v-if="index<3" class="invoiceNum">{{index==2?'...':code}}</p>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column property="money" label="报销金额(元)" width="150">
        <template scope="scope">
          {{scope.row.accurencyName}} <span style="color:#0460AE">{{scope.row.money | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column property="rmb" label="人民币(元)" :formatter="formatMoney" width="110"></el-table-column>
    </el-table>
    <p class="totalMoney">合计金额 人民币 <span>{{info[0].totalMoney | toThousands}}元 {{info[0].totalMoney | moneyCh}}</span></p>
    <el-table :data="info[0].execstatis" :stripe="true" highlight-current-row style="width: 100%" class="appTable budgetTable ">
      <el-table-column label="预算年度" property="budgetYear" width="80"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目">
        <template scope="scope">
          {{scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="budgetInitMoney" label="年度预算(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="remainMoney" label="可用额度(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="cExecRate" label="执行比例" width="100"></el-table-column>
    </el-table>
    <el-table :data="info[0].pay" :stripe="true" highlight-current-row style="width: 100%" class="appTable docTable expandTable" v-if="info[0].pay.length>0">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" label-width="90px" inline>
            <el-form-item label="付款方式">
              <span>{{ props.row.paymentMethodCode }}</span>
            </el-form-item>
            <el-form-item label="开户行">
              <span>{{ props.row.paymentSupplierBank }}</span>
            </el-form-item>
            <el-form-item label="收款账户">
              <span>{{ props.row.paymentSupplierAccountName }}</span>
            </el-form-item>
            <el-form-item label="费用类型">
              <span>{{ props.row.costTypeName }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="预付款公文" property="paymentDocName">
        <template scope="scope">
          <router-link class="attch" :to="'/doc/docDetail/'+scope.row.paymentDocId">{{scope.row.paymentDocName}}</router-link>
        </template>
      </el-table-column>
      <el-table-column property="paymentSupplierName" label="收款供应商"></el-table-column>
      <el-table-column property="totalMoney" label="付款金额" width="180">
        <template scope="scope">
          人民币{{scope.row.totalMoney | toThousands}}
        </template>
      </el-table-column>
    </el-table>
    <p class="borderBox clearBoth"></p>
    <el-col :span="24">
      <h1 class="title">发票</h1>
      <p v-if="info" class="textContent">
        <a :href="vo.fileUrl" class="fileLink" v-if="vo.classify==2" v-for="vo in info[0].finFiles" target="_blank">{{vo.fileName+vo.fileTypeName}}</a>
      </p>
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
    formatMoney(row, column, cellValue) {
      return this.toThousands(cellValue)
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.reimburseDetail {
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
  .invoiceNum {
    line-height: 15px;
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
  .docTable {
    margin-top: 20px; // padding-bottom:20px;
    // border-bottom: 1px solid #D5DADF;
    .el-table__header th {
      background: $sub;
    }
    .el-table__header-wrapper thead div,
    .el-table__footer-wrapper thead div {
      background: $sub;
    }
  }
}

</style>
