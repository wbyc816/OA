<template>
  <div id="flightSearch">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>Flight Search</span>
        <div class="headRight" v-goto="{path:'/staffCenter/flightStatus'}">
          <i class="iconfont icon-zhuangtai"></i>
          <span>Flight Status</span>
          <i class="el-icon-arrow-right"></i>
        </div>        
      </div>
      <el-row :gutter="12">
        <el-col :span="24">
          <el-radio-group v-model="tripType">
            <el-radio label="date">One Way</el-radio>
            <el-radio label="daterange">Round Trip</el-radio>
          </el-radio-group>
        </el-col>
        <el-col :span="6">
          <el-input v-model="tripFrom" placeholder="From"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="tripTo"  placeholder="To" class="pullRight"></el-input>
        </el-col>
        <el-col :span="12">
          <search-date :type="tripType"></search-date>
        </el-col>       
      </el-row>
    </el-card>

    <table bgcolor="#fff" class="searchResult" width="100%" cellspacing="0" v-for="(res,index) in searchResult">
      <caption>
      {{res[0].type}}&nbsp;&nbsp;&nbsp;{{res[0].from}}({{res[0].fromShort}}) - {{res[0].to}}({{res[0].toShort}})&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{res[0].date}}({{res[0].day}})
      </caption>
      <tbody v-for="info in res">
        <tr>
          <td>
            <P>
              <span>{{info.Departure}}</span>
              <span>{{info.fromShort}}</span>
            </P>
            <p>
              <span>{{info.Arrival}}</span>
              <span>{{info.toShort}}</span>
            </p>
          </td>
          <td>
            <P>
              <span>{{info.flight}}</span>
              <span>{{info.company}}</span>
            </P>
            <p>
              <span>{{info.duration}}</span>
              <span>{{info.stop}} stop(s)</span>
              <span>AirEquipType:{{info.airEquipType}}</span>
            </p>
          </td>
          <td>
            <P>
              <span><i class="iconfont icon-shuangren"></i></span>
              <span>Economy Seats:  {{info.economySeatsNum}} | {{info.economySeatsLimit}}</span>
            </P>
            <p>
              <span><i class="iconfont icon-danren"></i></span>
              <span>Business Seat:  {{info.businessSeatNum}} | {{info.businessSeatLimit}}</span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>


  </div>
</template>
<script>

  import SearchDate from '../../components/searchDate'
  const searchData=[
  {
    'RefNo':'IT108471081',
    'BudgetNature': 'System Fee',
    AmoutPayable: '—',
    PaidAmount: '—',
    ApplicationTime: '2017-02-12 18:31:31',
    AmountRequested: '973,000(HKD)',
    Status: 'Agreed',
    Operation: 'Detail'
  },
  {
    'RefNo':'IT108471081',
    'BudgetNature': 'System Fee',
    AmoutPayable: '—',
    PaidAmount: '—',
    ApplicationTime: '2017-02-12 18:31:31',
    AmountRequested: '973,000(HKD)',
    Status: 'Agreed',
    Operation: 'Detail'
  },
  {
    'RefNo':'IT108471081',
    'BudgetNature': 'System Fee',
    AmoutPayable: '—',
    PaidAmount: '—',
    ApplicationTime: '2017-02-12 18:31:31',
    AmountRequested: '973,000(HKD)',
    Status: 'Agreed',
    Operation: 'Detail'
  }
  ]
  const searchResult=[
    [
    {
      type:'Departing',
      from:'Hong Kong',
      fromShort:'HKG',
      Departure:'9:50',
      to:'Beijing',
      toShort:'PEK',
      Arrival:'14:15',
      date:'2017-01-18',
      day:'Wednesday',
      flight:'HX312',
      company:'Hong Kong Airlines',
      duration:'4h25m',
      stop:0,
      airEquipType:'333',
      'economySeatsNum':234,
      'economySeatsLimit':260,
      'businessSeatNum':16,
      'businessSeatLimit':30,
    },
    {
      type:'Departing',
      from:'Hong Kong',
      fromShort:'HKG',
      Departure:'8:50',
      to:'Beijing',
      toShort:'PEK',
      Arrival:'14:15',
      date:'2017-01-18',
      day:'Wednesday',
      flight:'HX310',
      company:'Hong Kong Airlines',
      duration:'4h25m',
      stop:0,
      airEquipType:'333',
      'economySeatsNum':256,
      'economySeatsLimit':260,
      'businessSeatNum':36,
      'businessSeatLimit':24,
    }
    ],
    [
    {
      type:'Return',
      from:'Beijing',
      fromShort:'PEK',
      Departure:'14:50',
      to:'Hong Kong',
      toShort:'HKG',
      Arrival:'19:15',
      date:'2017-01-22',
      day:'Wednesday',
      flight:'HX312',
      company:'Hong Kong Airlines',
      duration:'4h25m',
      stop:0,
      airEquipType:'333',
      'economySeatsNum':256,
      'economySeatsLimit':260,
      'businessSeatNum':23,
      'businessSeatLimit':30,
    },
    {
      type:'Return',
      from:'Hong Kong',
      fromShort:'HKG',
      Departure:'12:50',
      to:'Beijing',
      toShort:'PEK',
      Arrival:'17:15',
      date:'2017-01-22',
      day:'Wednesday',
      flight:'HX313',
      company:'Hong Kong Airlines',
      duration:'4h25m',
      stop:0,
      airEquipType:'333',
      'economySeatsNum':256,
      'economySeatsLimit':260,
      'businessSeatNum':14,
      'businessSeatLimit':30,
    }
    ]
  ]
  export default{
    data(){
      return{
        searchData,
        handledBy:'',
        tripType:'date',
        tripFrom:'',
        tripTo:'',
        searchResult
      }
    },
    components:{
      SearchDate
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
  #flightSearch{
    .searchOptions{
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .el-col-24{
          padding: 10px 0;
        }
      }
    }
    .headRight{
      i:first-child{
        position:relative;
        top:3px;
        font-size:24px;
      }
    }
    .searchResult{

      caption{
        background: $purple;
        color: #fff;
        font-size: 15px;  
        text-align: left;
        padding-left: 15px;
        line-height: 57px;
      }
      td{
        padding:18px 35px;
        font-size: 15px;
        border-bottom: 1px solid #D5DADF;
        p{
          margin:7px 0;
          span{
            display: inline-block;
            i{
              color:$purple;
            }
          }
        }
      }
      tbody{
        $widths: (1: 20%, 2: 40%, 3: 40%);
        @each $num, $width in $widths {
          td:nth-child(#{$num}) {
            width: $width;
          }
        }
        td:first-child{
          border-right: 2px dashed #D5DADF;
          p{
            color:#151515;
            span{             
              width: 50%;
            }
            span:last-child{
              float: right;
            }
          }
        }
        td:nth-child(2){
          p:first-child{
            span:first-child{
              width:20%;
            }
            span:last-child{
              width:78%;
            }
          }
          P:last-child{
            span:nth-child(1){
              width: 23%;
            }
            span:nth-child(2){
              width: 25%;
            }
            span:nth-child(3){
              width: 48%;
            }
          }
        }
        td:nth-child(3){
          p{
            span:first-child{
              width:10%;
            }
            span:last-child{
              width: 78%;
            }
          }
        }
      }
      tbody:nth-child(even){
        background: #F7F7F7;
      }

    }    

  }


</style>
