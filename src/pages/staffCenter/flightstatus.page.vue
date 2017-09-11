<template>
  <div id="paymentSearch">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>Flight Status</span>
        <div class="headRight" v-goto="{path:'/staffCenter/flightSearch'}">
          <i class="iconfont icon-plane1"></i>
          <span>Flight Information</span>
          <i class="el-icon-arrow-right"></i>
        </div> 
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <search-date type="date" :button="false" tip="Date"></search-date>
        </el-col>
        <el-col :span="8">
          <el-radio-group v-model="flightStatusType" class="myRadio">
            <el-radio-button label="flightNo">Flight No.<i></i></el-radio-button>
            <el-radio-button label="route">Route<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="10">
          <div class="flightNo" v-show="flightStatusType=='flightNo'">
            <el-select v-model="flightNoTitle">
              <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input class="search">
              <el-button slot="append">Search</el-button>
            </el-input>
          </div>
          <div class="route" v-show="flightStatusType=='route'">
            <el-input v-model="tripFrom" placeholder="From">
            </el-input>
            <el-input class="search" v-model="tripTo" placeholder="To">
              <el-button slot="append">Search</el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult">
      <div slot="header">
        <span @click="show">Total Flights  155</span>
      </div>
      <ul class="tableHearder">
        <li style="width:113px">Departure Date</li>
        <li style="width:82px">From</li>
        <li style="width:82px">To</li>
        <li style="width:132px">Scheduled<br/>Departure Time</li>
        <li style="width:132px">Scheduled<br/>Arrival Time</li>
        <li style="width:132px">Actual<br/>Departure Time</li>
        <li style="width:132px">Actual<br/>Arrival Time</li>
        <li style="width:91px">Status</li>
      </ul>
      <el-table :data="searchData" class="myTable" :show-header="false">      
        <el-table-column prop="DepartureDate" label="Departure Date" width="110"></el-table-column>
        <el-table-column prop="From" label="From" width="80" class-name="purpleColor"></el-table-column>
        <el-table-column prop="To" label="To" width="80" class-name="purpleColor"></el-table-column>
        <el-table-column  label="Scheduled Departure Time" width="130">
          <template scope="scope">
            <p>{{ scope.row.date }}</p>
            <p>{{ scope.row.time }}</p>
          </template>
        </el-table-column>
        <el-table-column  label="ScheduledArrival Time" width="130">
          <template scope="scope">
            <p>{{ scope.row.date }}</p>
            <p>{{ scope.row.time }}</p>
          </template>
        </el-table-column>
        <el-table-column  label="Actual Departure Time" width="130">
          <template scope="scope">
            <p>{{ scope.row.date }}</p>
            <p>{{ scope.row.time }}</p>
          </template>
        </el-table-column>
        <el-table-column  label="Actual Arrival Time" width="130">
          <template scope="scope">
            <p>{{ scope.row.date }}</p>
            <p>{{ scope.row.time }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="Status" class-name="greenColor"> 

        </el-table-column>
      </el-table>
      <p class="total">Total: 4 Record(s).</p>
    </el-card>
  </div>
</template>
<script>
  import SearchDate from '../../components/searchDate'
  const searchData=[
  {
    'DepartureDate':'2017-01-18',
    'From': 'HKG',
    To: 'PEK',
    date: '2017-02-12',
    time: '18:31:31',
    Status: 'Arrived'
  },
  {
    'DepartureDate':'2017-01-18',
    'From': 'HKG',
    To: 'PEK',
    date: '2017-02-12',
    time: '18:31:31',
    Status: 'Arrived'
  },
  {
    'DepartureDate':'2017-01-18',
    'From': 'HKG',
    To: 'PEK',
    date: '2017-02-12',
    time: '18:31:31',
    Status: 'Arrived'
  },
  {
    'DepartureDate':'2017-01-18',
    'From': 'HKG',
    To: 'PEK',
    date: '2017-02-12',
    time: '18:31:31',
    Status: 'Arrived'
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
    label: 'HX'
  }, {
    value: '选项2',
    label: 'HD'
  }, {
    value: '选项3',
    label: 'HJ'
  }]; 
  export default{
    data(){
      return{
        searchData,
        handledBy:'',
        paymentView:false,
        paymentData,
        flightStatusType:'flightNo',
        options,
        flightNoTitle:'选项1',
        tripFrom:'',
        tripTo:'',
      }
    },
    components:{
      SearchDate
    },
    methods:{
      showDialog(){
        this.paymentView=true;
      },
      show(){
        console.log(this.$parent);
      }
    }
  }
</script>
<style lang='scss'>
  $purple: #7C5598;
  #paymentSearch{
    .purpleColor{
      color:$purple;
    }
    .greenColor{
      color:#0F6E0B;
    }
    .headRight{
      i:first-child{
        font-size:24px;
        position:relative;
        top:3px;
      }
    }
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .showDate{
          border-right: 1px solid #b7b7b7;
        }
        .myRadio{
          width: 100%;
          .el-radio-button{
            width: 45%;
            .el-radio-button__inner{
              width: 100%;
            }
            &:first-child{
              margin-right: 12px;
            }
          }
        }
        .flightNo{
          float: right;
          .el-select{
            width:20%;
          }
          .search{
            width: 78%;
            float: right;
          }
        }
        .route{
          float: right;
          .el-input:first-child{
            width:35%;
            display:inline-block;
          }
          .search{
            float: right;
            width: 63%;
            
          }
            
          
          button{         
            float: right;
            font-size: 18px;
            width: 103px;
            height: 46px;
            color: #fff;
            background: $purple;
            border-color:$purple;
          }
        }
      }
    }
    .searchResult{
      padding-bottom: 0;
      .el-card__body{
        padding: 0;
        .tableHearder{
          background: $purple;
          display: table;
          width: 100%;
          li{
            display: table-cell;
            padding-left: 15px;
            box-sizing: border-box;
            color:#fff;
            font-size: 13px;
            height: 44px;
            vertical-align: middle;
          }
        }
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

  }


</style>
