<template>
    <div>
      <el-card  class='doc-block doc-admin'>
        <div slot="header" class='doc_title'>
          <span>Administrative Documents</span>
        </div>
        <el-row :gutter='15'>
          <el-col :span="6" :xs='12' v-for="item in adminData">
            <doc-list :data='item'></doc-list>
          </el-col>
        </el-row>
      </el-card>
      <el-card  class='doc-block doc-finance'>
        <div slot="header" class='doc_title'>
          <span>Financial Documents <span class='doc_small-title'>(These documents must be approved by Cost Center and Finance Department.)</span></span>
        </div>
        <el-row :gutter='15'>
          <el-col :span="6" :xs='12' v-for="item in financeData">
            <doc-list :data='item'></doc-list>
          </el-col>
        </el-row>
      </el-card>
      <el-card  class='doc-block doc-contrast'>
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
<style scoped lang='scss'>
  .doc_title{
    font-size: 18px;
    line-height: 40px;
    border-bottom:1px solid #d5dadf;
    margin-top:-13px;
  }
  .el-col{
    margin:12px 0;
  }
  .doc_small-title{
    font-size: 14px;
  }
</style>
<script>
    import DocList from'../../components/doc'




    const  adminData=[
                    {'logo':'icon-file1','color':'#FF754F','text':'Approval Form','link':'/doc/approvalForm'},
                    {'logo':'icon-weibiaoti-4','color':'#FF5F88','text':'File Manuscript Paper','link':'/doc/manuscriptPaper'},
                    {'logo':'icon-rili','color':'#A5A3FF','text':'Staff Leave','link':'#'},
                    {'logo':'icon-jipiao','color':'#9FD867','text':'Business Trip','link':'/doc/businessTrip'},
                    {'logo':'icon-imgtag','color':'#5BB5FC','text':'Business Trip Ticket in Advance','link':'#'},
                    {'logo':'icon-qiaquan','color':'#FF754F','text':'Staff Leisure Travel','link':'/doc/leisureTravel'},
                    {'logo':'icon-mobile','color':'#FFE066','text':'Mobile Phone Services Request','link':'/doc/mobSerReq'},
                    {'logo':'icon-mingpian','color':'#A5A3FF','text':'Business Card','link':'/doc/businessCardReq'},
                    {'logo':'icon-geren','color':'#FF5F88','text':'Concession Voucher Form','link':'/doc/conVoucher'},
                    {'logo':'icon-biaodan','color':'#5BB5FC','text':'Procurement Requisition Form','link':'/doc/procureReq'},
                  ];
    const  financeData=[
                    {'logo':'icon-fukuan','color':'#5BB5FC','text':'Budget Form','link':'/doc/budget'},
                    {'logo':'icon-fukuan2','color':'#FF754F','text':'Payment Requisition Form','link':'/doc/payment'},
                    {'logo':'icon-fukuan1','color':'#A5A3FF','text':'Reimbursement Form','link':'/doc/reimburse'},
                    {'logo':'icon-yusuankongzhi','color':'#FF5F88','text':'Contract Budget Change','link':'/doc/contractBudget'},
                  ];
    const   contrastData=[
                    {'logo':'icon-weibiaoti-4','color':'#FFE006','text':'Pro-So Create','link':'#'},
                    {'logo':'icon-contract','color':'#5BB5FC','text':'Contract Approval(New)','link':'/doc/conApprovalNew'},
                    {'logo':'icon-book-copy','color':'#FF5F88','text':'Contract Supplement','link':'#'},
                    {'logo':'icon-hetong','color':'#9FD867','text':'Contract Approval','link':'/doc/conApproval'},
                  ];

    export default{
        data(){
            return{
              adminData,
              financeData,
              contrastData,
            };
        },
        components:{
            DocList
        }
    }
</script>
