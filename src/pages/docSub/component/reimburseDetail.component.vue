<template>
  <div class="reimburseDetail clearfix">
    <el-table :data="info[0].tDocFinReimbursement.tDocFinReimbursementItems" :stripe="true" highlight-current-row style="width: 100%" class="appTable">
      <el-table-column label="预算年度" property="budgetYear" width="80"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目">
        <template scope="scope">
          {{scope.row.budgetDeptName+'/'+scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="receiptTypeName" label="发票类型" width="100"></el-table-column>
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
    <p class="totalMoney">合计金额 人民币 <span>{{info[0].tDocFinReimbursement.totalMoney | toThousands}}元 {{info[0].tDocFinReimbursement.totalMoney | moneyCh}}</span></p>
    <el-table :data="info[0].budgetExeststisVoList" :stripe="true" highlight-current-row style="width: 100%" class="appTable budgetTable ">
      <el-table-column label="预算年度" property="budgetYear" width="80"></el-table-column>
      <el-table-column property="budgetDeptName" label="预算机构/科目">
        <template scope="scope">
          {{scope.row.deptName+'/'+scope.row.budgetItemName}}
        </template>
      </el-table-column>
      <el-table-column property="budgetInit" label="年度预算(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="availableMoney" label="可用额度(元)" :formatter="formatMoney" width="130"></el-table-column>
      <el-table-column property="cExecRate" label="执行比例" width="80"></el-table-column>
    </el-table>
    <el-row style="border-top: 1px solid #D5DADF;margin-top:20px;">
      <el-col :span="24">
        <h1 class="title">报销类型</h1>
        <p v-if="info" class="textContent">{{info[0].tDocFinReimbursement.docTypeName}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder">
        <h1 class="title">申请金额</h1>
        <p v-if="info" class="textContent">人民币 {{info[0].tDocFinReimbursement.totalMoney | toThousands}}</p>
      </el-col>
      <el-col :span="12">
        <h1 class="title">付款方式</h1>
        <p v-if="info[0].tDocFinReimbursement.paymentMethodCode!='FIN0104'" class="textContent">{{info[0].tDocFinReimbursement.paymentMethodName}}</p>
        <p class="textContent" v-else>{{info[0].tDocFinReimbursement.paymentOthers}}</p>
      </el-col>
      <el-col :span="12" class="rightBorder" v-if="info[0].tDocFinReimbursement.payeeName">
        <h1 class="title">收款人</h1>
        <p v-if="info" class="textContent">{{info[0].tDocFinReimbursement.payeeName}}</p>
      </el-col>
      <el-col :span="12" v-if="info[0].tDocFinReimbursement.payeeAccount">
        <h1 class="title">收款账户</h1>
        <p v-if="info" class="textContent">{{info[0].tDocFinReimbursement.payeeAccount}}</p>
      </el-col>
      <el-col :span="24" >
        <h1 class="title">开户行</h1>
        <p v-if="info" class="textContent">{{info[0].tDocFinReimbursement.payeeBankName}}</p>
      </el-col>
      <el-col :span="24">
        <h1 class="title">发票</h1>
        <p v-if="info" class="textContent">
          <a :href="vo.fileUrl" class="fileLink" v-if="vo.classify==2" v-for="vo in info[0].finFiles" target="_blank">{{vo.fileName+vo.fileTypeName}}</a>
        </p>
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
    formatMoney(row, column, cellValue) {
      return this.toThousands(cellValue)
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
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
}

</style>
