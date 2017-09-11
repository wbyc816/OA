<template>
  <div id="myRequest">
    <el-card class="borderCard searchResult">
      <span slot="header">My Request</span>
      <el-table :data="searchData" class="myTable">      
        <el-table-column prop="RequestNo" label="Request No." width="110"></el-table-column>
        <el-table-column prop="JobTitle" label="Job Title" width="240"></el-table-column>
        <el-table-column prop="StaffName" label="Staff Name" width="130"></el-table-column>
        <el-table-column prop="TelNo" label="Tel No." width="110"></el-table-column>
        <el-table-column prop="Status" label="Status" width="80"></el-table-column>
        <el-table-column label="Create Time" width="120">
          <template scope="scope">
            <p>{{ scope.row.date }}</p>
            <p>{{ scope.row.time }}</p>
          </template>
        </el-table-column>       
        <el-table-column label="Operation" class-name="clickItem"> 
          <template scope="scope">
            <span @click="showDialog">View</span>
          </template>
        </el-table-column>
      </el-table>
      <p class="total">Total: 3 Record(s).</p>
    </el-card>

    <el-dialog title="My Request" v-model="paymentView" size="large" class="myDialog paymentDialog">
      <div class="staff">
        <ul class="base">
          <li><span>Request No.</span><span>2014097147</span></li>
          <li><span>Job Title</span><span>IT Service Testing</span></li>
          <li><span>Job Categories</span><span>Hardware Problem</span></li>
          <li><span>Urgency</span><span>Normal</span></li>
          <li><span>Staff Name</span><span>Alex Yu</span></li>
          <li><span>Email Address</span><span>alex.yu@hkairlines.com</span></li>
          <li><span>Tel No.</span><span>3014 0841</span></li>
        </ul>
        <ul class="base payment">
          <li><span>Description</span></li>
          <li><span>Attached Document</span><span>32332.jpg</span></li>
          <li><span>Action Summary</span><span>测试</span></li>
          <li><span>Status Updated</span>
            <span class="buttonGroup">
              <el-radio-group v-model="statusType" class="myRadio">
                <el-radio-button label="Close">Case Close<i></i></el-radio-button>
                <el-radio-button label="Required">Followup Required<i></i></el-radio-button>
              </el-radio-group>
            </span>

          </li>
          <li><span>Attached Document</span></li>
          <li><span>Reply User</span><span>Leo Liu</span></li>
          <li><span>Reply Time</span><span>2017-01-03 15:32:31</span></li>
        </ul>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  const searchData=[
  {
    'RequestNo':'IT108471081',
    'JobTitle': 'It Service ',
    'StaffName': 'Alex.Yu',
    'TelNo': '5208 1323',
    'date': '2017-02-12',
    'time': '18:31:31',
    'Status': 'Closed'
  },
  {
    'RequestNo':'IT108471081',
    'JobTitle': 'System Problem',
    'StaffName': 'Alex.Yu',
    'TelNo': '—',
    'date': '2017-02-12',
    'time': '18:31:31',
    'Status': 'Closed'
  },
  {
    'RequestNo':'IT108471081',
    'JobTitle': 'It Service Testing',
    'StaffName': 'Alex.Yu',
    'TelNo': '—',
    'date': '2017-02-12',
    'time': '18:31:31',
    'Status': 'Closed'
  }
  ]


  export default{
    data(){
      return{
        searchData,
        handledBy:'',
        paymentView:false,
        statusType:'Close'
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
  #myRequest{
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .el-select{
          width: 100%;
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
          &>span{
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
      padding-bottom: 0;
      .el-card__body{
        padding: 0;
        .el-table{
          .cell{
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
        .base:last-child{
          li span:first-child{
            color:$purple;
          }
        }
        .payment{
          width: 61%;
          border:none;
          padding-left:25px;
          li:first-child{
            height:86px;
          }
          li{
            padding-left: 14px;
            span:first-child{
              width:30%;
            }
            .buttonGroup{
              position: relative;
              .el-radio-group{
                position: absolute;
                top: -28px;
                left: -5px;
              }
            }
          }
        }       
      }
    }

  }


</style>
