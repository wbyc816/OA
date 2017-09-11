<template>
  <div id='leaveDutyTrip'>
    <el-card class="borderCard">
      <el-row class="calendar" :gutter='18'>
        <el-col :span="6" :offset='offsets[index]' v-for="(dayArray,index) in days">
          <p>{{dayArray[10] | time('month')}}</p>
          <table class="dayList">
            <tr>
              <td>Mon</td>
              <td>Tue</td>
              <td>Wed</td>
              <td>Thu</td>
              <td>Fri</td>
              <td>Sat</td>
              <td>Sun</td>
            </tr>                
          </table>
          <ul class="dateBox">
            <li v-for="day in dayArray" :class="{'today':today==day,'Invalid':today>day,'selected':selectDay==day}" @click="select(day)">
              {{day | time('day')}}</li>
            </ul>
          </el-col>
          <el-col :span="6"></el-col>
          <el-col :span="6"></el-col>
        </el-row>
        <div class="operation">
          <div class="select">
            <i class="el-icon-arrow-left flLeft" :class="{'Invalid':selectDay<=today}" @click="changeDay(-1)"></i>
            <span>{{selectDay | time}}</span><span>{{selectDay | time('week')}}</span>
            <i class="el-icon-arrow-right flRight"  :class="{'Invalid':selectDay>=lastDay}" @click="changeDay(1)"></i>
          </div>
        </div>
        <p class="formTitle">Duty Trip</p>
        <el-table :data="searchData" class="myTable">      
          <el-table-column prop="StaffName" label="Staff Name" width="130"></el-table-column>
          <el-table-column prop="Section" label="Section" width="180"></el-table-column>
          <el-table-column prop="Position" label="Position" width="130"></el-table-column>
          <el-table-column prop="TravelDate" label="Travel Date" width="150">
            <template scope="scope">
            <p>{{ scope.row.TravelStart }}~</p>
              <p>{{ scope.row.TravelEnd }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Destination" label="Destination" width="110"></el-table-column>
          <el-table-column prop="ContactInformation" label="Contact Information"></el-table-column>
        </el-table>
        <p class="total">Total: 3 Record(s).</p>
        <p class="formTitle">Leave</p>
        <el-table :data="searchData" class="myTable">      
          <el-table-column prop="StaffName" label="Staff Name" width="130"></el-table-column>
          <el-table-column prop="Section" label="Section" width="180"></el-table-column>
          <el-table-column prop="Position" label="Position" width="130"></el-table-column>
          <el-table-column prop="TravelDate" label="Travel Date" width="150">
            <template scope="scope">
            <p>{{ scope.row.TravelStart }}~</p>
              <p>{{ scope.row.TravelEnd }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Destination" label="Destination" width="110"></el-table-column>
          <el-table-column prop="ContactInformation" label="Contact Information"></el-table-column>
        </el-table>
        <p class="total">Total: 3 Record(s).</p>
      </el-card>
    </div>
  </template>
  <script>
    const searchData=[
    {
      'StaffName':'June Liu',
      'Section': 'Reseach & Development [BEIJING Office]',
      Position: 'Officer',
      TravelStart: '2017-02-12',
      TravelEnd: '2017-02-14',
      Destination:'PEK',
      ContactInformation:  'June.liu@hkairlines.com',
    },
    {
      'StaffName':'June Liu',
      'Section': 'Reseach & Development [BEIJING Office]',
      Position: 'Officer',
      TravelStart: '2017-02-12',
      TravelEnd: '2017-02-14',
      Destination:'PEK',
      ContactInformation:  'June.liu@hkairlines.com',
    },
    {
      'StaffName':'June Liu',
      'Section': 'Reseach & Development [BEIJING Office]',
      Position: 'Officer',
      TravelStart: '2017-02-12',
      TravelEnd: '2017-02-14',
      Destination:'PEK',
      ContactInformation:  'June.liu@hkairlines.com',
    },
    ]
    const offsets=[1,2,2];
    export default{

      mounted(){
        this.init();
      },
      data(){
        return{
          days:[],
          today:0,
          selectDay:0,
          lastDay:0,
          offsets,
          searchData
        };
      },

      methods:{
        init(){
          var today=new Date();
          var yearNow=today.getFullYear();
          var monthNow=today.getMonth();
          for(var i=0;i<3;i++){
            this.days.push(this.getDays(yearNow,monthNow+i));
          }
          this.today=this.selectDay=new Date(today.toDateString()).getTime();
          this.lastDay=new Date(yearNow,monthNow+3,0).getTime();
        },
        getDays(year,month){
          var days=[]
          var countDay=new Date(year,month+1,0).getDate();
          var firstDayWeek=new Date(year,month,1).getDay();
          var days=[];
          for(var i=0;i<firstDayWeek-1;i++){
            days.push('');
          }
          for(var i=1;i<=countDay;i++){
            days.push(new Date(year,month,i).getTime());
          }
          return days;
        },
        select(day){
          if(day>=this.today){
            this.selectDay=day;
          }
        },
        changeDay(sign){
          if((this.selectDay!=this.today&&sign!=1)||(this.selectDay!=this.lastDay&&sign!=-1)){
            this.selectDay=this.selectDay+86400000*sign;
          }     
        }

      },
      computed:{

      }
    }

  </script>
  <style lang='scss'>
    $purple:#7C5598;
    $brown: #985D55;
    #leaveDutyTrip{
      .Invalid{
        color:#95989A !important;
        cursor: not-allowed !important;
      }
      &>.borderCard{
        padding: 0;
        .el-card__body{
          padding:0;
        } 
      }

      .calendar{
        padding-right: 10px;
        border-bottom: 1px solid #F2F2F2;
        .el-col{
          padding: 20px 0 0;
          p{
            font-size: 25px;
            text-align: right;
            font-weight: bold;
            color:$purple;
            padding-right: 10px;
          }
          .dayList{
            width: 100%;
            td{
              font-size: 12px;
              text-align: center;
              height: 30px;
              vertical-align: middle;
              color:$purple;
              font-weight: bold;
            }
            td:nth-child(6),td:nth-child(7){
              color:#D71718;
            }
          }
          .dateBox{
            display: flex;
            flex-wrap:wrap;
            $man:100%;
            li{
              flex: 0 0 $man / 7;
              position:relative;
              color:$purple;
              text-align: center;
              line-height: 28px;
              font-weight: bold;
              font-size: 16px;
              cursor: pointer;
            }
            li:nth-child(7n),li:nth-child(7n+6){
              color:#D71718;
            }
            .today:before{
              content: '';
              display:block;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              margin:0 auto;
              height: 5px;
              width: 5px;
              border-radius:100%;
              background: #D71718;
            }
            .selected{
              color:#fff !important;
              background: $purple;
            }
          }
        }
      }
      .operation{
        width: 100%;
        padding:0 5px;
        box-sizing: border-box;
        border-bottom: 1px solid #f2f2f2;
        text-align: center;
        .select{
          display: inline-block;
          width: 220px;
          line-height: 55px;
          padding-left: 20px;
          text-align: center;
          i{
            font-size: 16px;
            color:#777777;
            line-height: 55px;
            cursor: pointer;
          }
          span{
            font-size: 16px;
            padding:5px;      
          }
        }
      }
      .formTitle{
        line-height: 55px;
        text-align: center;
        border-top: 1px solid #f2f2f2;
        font-size: 16px;
      }
      .myTable{
        tr th:first-child .cell{           
          padding-left: 15px;           
        }
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
      .total{
        height: 33px;
        line-height: 33px;
        padding-left: 15px;
        font-size: 14px;
        color: #95989A;
      }    
      .total:not(:last-child){
        margin-bottom: 15px;
      }
    }

  </style>

