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
        <span>财务申请</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in financeData">
          <doc-list :data='item'></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='doc-block doc-contrast'>
      <div slot="header" class='doc_title'>
        <span>人事申请 </span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in contrastData">
          <doc-list :data='item'></doc-list>
        </el-col>
      </el-row>
    </el-card>
    <el-card class='doc-block doc-contrast'>
      <div slot="header" class='doc_title'>
        <span>优惠机票申请</span>
      </div>
      <el-row :gutter='15'>
        <el-col :span="6" :xs='12' v-for="item in ticketData">
          <doc-list :data='item'></doc-list>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import DocList from '../../components/doc'
const adminData = [
  { 'logo': 'icon-write', 'color': '#FF754F', 'text': '呈批单', 'link': '#/doc/docCommonApp/CPD' },
  { 'logo': 'icon-file11', 'color': '#FF5F88', 'text': '发文稿纸', 'link': '#/doc/docCommonApp/FWG' },
  { 'logo': 'icon-car', 'color': '#A5A3FF', 'text': '用车申请', 'link': '#/doc/docCommonApp/YCS' },
  { 'logo': 'icon-plane2', 'color': '#9FD867', 'text': '差旅申请', 'link': '#/doc/docCommonApp/CLV' },
  { 'logo': 'icon-documents', 'color': '#FF5F88', 'text': '材料申请', 'link': '#/doc/docCommonApp/CLS' },
  { 'logo': 'icon-biaodan', 'color': '#5BB5FC', 'text': '收文登记', 'link': '#/doc/docCommonApp/SWD' },
  { 'logo': 'icon-weibiaoti-4', 'color': '#FFE066', 'text': '合同申请', 'link': '#/doc/docCommonApp/HTS' },
];
const financeData = [
  { 'logo': 'icon-fukuan', 'color': '#5BB5FC', 'text': '预算申请', 'link': '#/doc/docCommonApp/YSS' },
  { 'logo': 'icon-fukuan2', 'color': '#FF754F', 'text': '付款申请', 'link': '#/doc/docCommonApp/FKS' },
  { 'logo': 'icon-fukuan1', 'color': '#A5A3FF', 'text': '报销申请', 'link': '#/doc/docCommonApp/BXS' },
  { 'logo': 'icon-yusuankongzhi', 'color': '#FF5F88', 'text': '借款申请', 'link': '#/doc/docCommonApp/JKS' },
  { 'logo': 'icon-imgtag', 'color': '#5BB5FC', 'text': '差旅报销申请', 'link': '#/doc/docCommonApp/CLB' },
  { 'logo': 'icon-manage', 'color': '#9FD867', 'text': '预付款核销申请', 'link': '#/doc/docCommonApp/YFK' },
];
const contrastData = [
  { 'logo': 'icon-rili', 'color': '#A5A3FF', 'text': '请假申请', 'link': '#/doc/docCommonApp/QJS' },
  { 'logo': 'icon-contract', 'color': '#FF5F88', 'text': '人员引进申请', 'link': '#/doc/docCommonApp/RYY' },
  { 'logo': 'icon-book-copy', 'color': '#9FD867', 'text': '转正申请', 'link': '#/doc/docCommonApp/ZZS' },
  { 'logo': 'icon-hetong', 'color': '#FF5F88', 'text': '培训申请', 'link': '#/doc/docCommonApp/PXS' },
  { 'logo': 'icon-file1', 'color': '#5BB5FC', 'text': '人事变动', 'link': '#/doc/docCommonApp/RSB' },
  { 'logo': 'icon-gongwen', 'color': '#FF754F', 'text': '工伤申请', 'link': '#/doc/docCommonApp/GSS' },
  { 'logo': 'icon-contract', 'color': '#FFE066', 'text': '离职申请', 'link': '#' },
  { 'logo': 'icon-biaodan', 'color': '#9FD867', 'text': '晋升申请', 'link': '#/doc/docCommonApp/JJS' },
];
const ticketData = [
  { 'logo': 'icon-qiaquan', 'color': '#FF754F', 'text': '宾客优惠机票', 'link': '#' },
  { 'logo': 'icon-jipiao', 'color': '#FF5F88', 'text': '员工优惠机票', 'link': '#' }
];
export default {
  data() {
    return {
      adminData,
      financeData,
      contrastData,
      ticketData
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
