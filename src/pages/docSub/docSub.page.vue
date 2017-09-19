<template>
  <div class="docIndexPage">
    <el-card>
      <div slot="header">
        <span>行政申请</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in adminData">
          <doc-list :data='item'></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='doc-block doc-finance'>
      <div slot="header">
        <span>Financial Documents</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in financeData">
          <doc-list :data='item'></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='doc-block doc-contrast'>
      <div slot="header" class='doc_title'>
        <span>Contract Documents <span class='doc_small-title'>(Contract Documents Manual)</span></span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in contrastData">
          <doc-list :data='item'></doc-list>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import DocList from '../../components/doc'
const adminData = [
  { 'logo': 'icon-write', 'color': '#FF754F', 'text': '呈批单', 'link': '/doc/approvalForm' },
  { 'logo': 'icon-file11', 'color': '#FF5F88', 'text': '发文稿纸', 'link': '/doc/manuscriptPaper' },
  { 'logo': 'icon-car', 'color': '#A5A3FF', 'text': '用车申请', 'link': '#' },
  { 'logo': 'icon-plane2', 'color': '#9FD867', 'text': '差旅申请', 'link': '/doc/businessTrip' },
  { 'logo': 'icon-documents', 'color': '#FF5F88', 'text': '材料申请', 'link': '#' },
  { 'logo': 'icon-biaodan', 'color': '#5BB5FC', 'text': '收文登记', 'link': '/doc/leisureTravel' }
];
const financeData = [
  { 'logo': 'icon-fukuan', 'color': '#5BB5FC', 'text': 'Budget Form', 'link': '/doc/budget' },
  { 'logo': 'icon-fukuan2', 'color': '#FF754F', 'text': 'Payment Requisition Form', 'link': '/doc/payment' },
  { 'logo': 'icon-fukuan1', 'color': '#A5A3FF', 'text': 'Reimbursement Form', 'link': '/doc/reimburse' },
  { 'logo': 'icon-yusuankongzhi', 'color': '#FF5F88', 'text': 'Contract Budget Change', 'link': '/doc/contractBudget' },
];
const contrastData = [
  { 'logo': 'icon-weibiaoti-4', 'color': '#FFE006', 'text': 'Pro-So Create', 'link': '#' },
  { 'logo': 'icon-contract', 'color': '#5BB5FC', 'text': 'Contract Approval(New)', 'link': '/doc/conApprovalNew' },
  { 'logo': 'icon-book-copy', 'color': '#FF5F88', 'text': 'Contract Supplement', 'link': '#' },
  { 'logo': 'icon-hetong', 'color': '#9FD867', 'text': 'Contract Approval', 'link': '/doc/conApproval' },
];

export default {
  data() {
    return {
      adminData,
      financeData,
      contrastData,
    };
  },
  components: {
    DocList
  }
}

</script>
<style lang='scss'>
.docIndexPage {
  .el-card {
    padding: 0 20px;
    .el-card__header {
      padding-left: 0;
      padding-right: 0;
    }
    .el-card__body {
      padding: 20px 0;
    }
  }



  .el-col {
    margin: 12px 0;
  }

  .doc_small-title {
    font-size: 14px;
  }
}

</style>
