<template>
  <div id="reimbursement">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>Reimbursement Search</span>
        <i class="iconfont icon-shuaxin"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-input placeholder="Paid From Date"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="To"></el-input>
        </el-col>
        <el-col :span="12">
          <el-select v-model="value" placeholder="Type">
            <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary">Search</el-button>
      </el-col>
    </el-row>
  </el-card>
  <el-card class="borderCard searchResult">
    <el-table :data="searchData" class="myTable">      
      <el-table-column prop="RefNo" label="Ref No." width="100"></el-table-column>
      <el-table-column prop="DocNo" label="Doc No." width="70"></el-table-column>
      <el-table-column prop="Subject" label="Subject" width="150"></el-table-column>
      <el-table-column prop="RequestAmounts" label="Request Amounts" width="120"></el-table-column>
      <el-table-column prop="PaidDate" label="Paid Date" width="85">
        <template scope="scope">
          <p>{{ scope.row.date }}</p>
          <p>{{ scope.row.time }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="PayAmount" label="Pay Amount" width="110"></el-table-column>
      <el-table-column prop="Type" label="Type" width="120"></el-table-column>
      <el-table-column prop="Status" label="Status" width="60"></el-table-column>
      <el-table-column label="" class-name="clickItem"> 
        <template scope="scope">
          <span @click="showDialog">Detail</span>
        </template>
      </el-table-column>
    </el-table>
    <p class="total">Total: 3 Record(s).</p>
  </el-card>

  <el-dialog title="Payment Requisition Form" v-model="paymentView" size="large" class="myDialog paymentDialog">
    <el-button type="primary" class="savePdf">Save as PDF</el-button>
    <div class="staff">
      <ul class="base">
        <li><span>Staff Information</span></li>
        <li><span>Reimbursement Staff</span><span>Lei Ling Jin</span></li>
        <li><span>Ref. No.</span><span>411032</span></li>
        <li><span>Staff No.</span><span>1000324713</span></li>
        <li><span>Staff HK No.</span><span>10037</span></li>
        <li><span>Company</span><span>HKA</span></li>
        <li><span>Department</span><span>IT</span></li>
        <li><span>Contact No.</span><span>3014 0841</span></li>
        <li><span>Email</span><span>Alex.hu@hkairlines.com</span></li>
        <li><span>Courses Information</span><span>User Organization IT</span></li>
      </ul>
      <ul class="base payment">
        <li><span>Payment Information</span></li>
        <li><span>Payee</span><span>Test</span></li>
        <li><span>Remittances</span></li>
        <li><span>Bank</span><span>HSBC</span></li>
        <li><span>Invoice/Credit Note</span><span>20841471 307131</span></li>
        <li><span>Due Date</span><span>2017-01-12</span></li>
        <li><span>Payment Type</span><span>Cash</span></li>
        <li><span>Company</span><span>HKA</span></li>
        <li><span>Corresponding Contract</span></li>
        <li><span>Description</span></li>
      </ul>
    </div>
    <el-table :data="paymentData" class="myTable">      
      <el-table-column prop="BudgetNature" label="Budget Nature" width="130"></el-table-column>
      <el-table-column prop="CostCenter" label="Cost Center" width="130"></el-table-column>
      <el-table-column prop="DocNo/ID" label=" Doc No/ID" width="110"></el-table-column>
      <el-table-column prop="InvoiceNo" label="Invoice No" width="160"></el-table-column>
      <el-table-column prop="AmountRequested" label="Amount Requested" width="150"></el-table-column>
      <el-table-column prop="AmountinHKD" label="Amount in HKD" width="150"></el-table-column>
      <el-table-column prop="PaymentAmount" label="Payment Amount" width="150"></el-table-column>
      <el-table-column prop="Currency" label="Currency" width="90"></el-table-column>
      <el-table-column prop="Total(HKD)" label="Total（HKD）"></el-table-column>
    </el-table>
  </el-dialog>
</div>
</template>
<script>
  const searchData=[
  {
    'RefNo':'108471081',
    'DocNo': '97371',
    Subject: 'Trip Reimbursement',
    RequestAmounts: 'HKD7938.23',
    date:'2017-02-12',
    time:  '18:31:31',
    PayAmount: 'HKD7938.23',
    Type: 'Reimbursement',
    Status: 'Agreed'
  },
  {
    'RefNo':'108471081',
    'DocNo': '97371',
    Subject: 'Trip Reimbursement',
    RequestAmounts: 'HKD7938.23',
    date:'2017-02-12',
    time:  '18:31:31',
    PayAmount: 'HKD7938.23',
    Type: 'Reimbursement',
    Status: 'Agreed'
  },
  {
    'RefNo':'108471081',
    'DocNo': '97371',
    Subject: 'Trip Reimbursement',
    RequestAmounts: 'HKD7938.23',
    date:'2017-02-12',
    time:  '18:31:31',
    PayAmount: 'HKD7938.23',
    Type: 'Reimbursement',
    Status: 'Agreed'
  },
  ]

  const paymentData=[
  {
    BudgetNature:'2017-01',
    'DocNo/ID': '41024487',
    InvoiceNo: '64717754544HK',
    CostCenter: 'IT',
    Currency: 'CNY',
    AmountRequested: '8,500.00',
    AmountinHKD: '8,500.00',
    PaymentAmount: '8,500.00',
    'Total(HKD)':'8,500.00'

  }
  ]
  const options= [{
    value: '选项1',
    label: '黄金糕'
  }, {
    value: '选项2',
    label: '双皮奶'
  }, {
    value: '选项3',
    label: '蚵仔煎'
  }, {
    value: '选项4',
    label: '龙须面'
  }, {
    value: '选项5',
    label: '北京烤鸭'
  }]

  export default{
    data(){
      return{
        searchData,
        handledBy:'',
        paymentView:false,
        paymentData,
        value: '',
        options,
      }
    },
    components:{

    },
    methods:{
      showDialog(){
        this.paymentView=true;
      }
    }
  }
</script>
<style lang='scss'>
  $purple: #7C5598;
  #reimbursement{
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .el-select{
          width: 60%;
        }
        button{
          height: 46px;
          width: 40%;
          float: right;
        }
      }
    }

    @mixin base-ul{
      display: flex;
      width: 100%;
      .base{
        width: 38%;
        border-right: 1px solid #F2F2F2;
        margin:18px 0;
        padding-right: 25px;
        li{
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #F2F2F2;
          padding-left: 24px;
          span{
            display: inline-block;
            position: relative;
            width: 50%;
            font-size: 15px;
            color: #393939;
          }
        }
        li:first-child{
          height: 35px;
          line-height: 15px;
        }
        li:last-child{
          border:none;
        }
      }
    }
    .description{
      width: 61%;
      font-size: 15px;
      position: relative;
      color:#393939;
      padding-left: 28px;
      p:first-child{
        color:$purple;
        height: 53px;
        line-height: 53px;
      }
      .attachment{  
        position: absolute;
        left: 0;
        bottom: 18px;
        width: 100%;
        box-sizing: border-box;
        padding-left: 28px;
        padding-right: 25px;
        li{
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #f2f2f2;
          span{
            display: inline-block;
            
          }
          span:first-child{
            color:$purple;
            width: 20%;
          }
        }
        li:first-child{
          border-top: 1px solid #f2f2f2;
        }
        li:last-child{
          span:last-child{
            text-decoration: underline;
          }
        }
      }
    }
    .searchResult{
      padding: 0;
      tr th:first-child .cell{           
              padding-left: 15px;           
          }
      .el-card__body{
        padding: 0;
        .el-table{
          tr td:first-child .cell{
            padding-left: 15px;
          }
          
          td{
            height: 70px;
          }
          td.clickItem{
            color:$purple;
            cursor: pointer;
          }
          td.timeItem{
            padding-right: 25px;
          }
        }
      }
      .total{
        height: 33px;
        line-height: 33px;
        padding-left: 15px;
        font-size: 14px;
        color: #95989A;
      }    
    }    
    .paymentDialog{
      .el-dialog__body{
        position: static;
      }
      .savePdf{
        position: absolute;
        top: 4px;
        right: 50px;
        height: 35px;
        border-radius: 2px;
        width: 152px;
        border: none;
        font-size: 16px;
      }
      .staff{
        @include base-ul;
        .base{
          li span:first-child{
            color:$purple;
          }
        }
        .payment{
          width: 61%;
          border:none;
          padding-left:25px;
          li{
            padding-left: 14px;
            span:first-child{
              width:30%;
            }
          }
        }       
      }
      .el-table{
        td{
          height: 54px;
        }
        tr th:first-child .cell,tr td:first-child .cell{
          padding-left: 20px;
        }
        .cell{
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }

  }


</style>
