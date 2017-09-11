<template>
  <div id='ReservationAllRoom'>
    <el-card class="borderCard">
      <span slot="header">All Room</span>
      <el-row class="calendar" :gutter='18'>
        <el-col :span="6">
          <img src="../../../assets/images/roomMap.png">
        </el-col>
        <el-col :span="6" v-for="dayArray in days">
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
          <div class="flRight note"><span>Internal</span><span>External</span></div>
        </div>
        <ul class="timeLine">

          <li v-for="time in times">{{time}}</li>
          <li></li>
        </ul>
        <el-row class="roomDetail" v-for="row in timeList">
          <el-col  :span='4'>{{row.roomName}}</el-col>
          <el-col  :span='20'>
            <div class="lineBOX">
              <div class="borderDiv" v-for="o in 7"></div>
              <div class="line" v-for="plan in row.plan" :style="calPosition(plan)">
                <p>{{plan.timePeriod}}</p>
                <p :style="calColor(plan)"></p>
                <p>{{plan.dep}}</p>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="operation borderTop">
          <div class="select">
            <i class="el-icon-arrow-left flLeft" :class="{'Invalid':selectDay<=today}" @click="changeDay(-1)"></i>
            <span>{{selectDay | time}}</span><span>{{selectDay | time('week')}}</span>
            <i class="el-icon-arrow-right flRight"  :class="{'Invalid':selectDay>=lastDay}" @click="changeDay(1)"></i>
          </div>
          <div class="flRight note"><span>Internal</span><span>External</span></div>
        </div>
      </el-card>
    </div>
  </template>
  <script>
const times=['21:00','19:00','17:00','15:00','13:00','11:00','09:00','07:00'];
const timeList=[
{  
  roomName:'Training Room A',
  plan:[{
    timePeriod:'09:00-11:00',
    start:4,
    width:4,
    dep:'CRM-R',
    type:'Internal'
  }]
},
{  
  roomName:'Training Room B',
  plan:[{
    timePeriod:'10:00-11:00',
    start:6,
    width:2,
    dep:'HR-NEO',
    type:'Internal'
  },{
    timePeriod:'13:00-15:30',
    start:12,
    width:5,
    dep:'ENG-ELT',
    type:'Internal'
  }]
},
{  
  roomName:'Training Room C',
  plan:[{
    timePeriod:'9:00-12:00',
    start:4,
    width:6,
    dep:'CRM-R',
    type:'External'
  },{
    timePeriod:'16:00-21:00',
    start:18,
    width:10,
    dep:'ENG-ELT',
    type:'Internal'
  }]
},
{  
  roomName:'Training Room D',
  plan:[{
    timePeriod:'9:00-12:00',
    start:4,
    width:6,
    dep:'CRM-R',
    type:'External'
  },{
    timePeriod:'16:00-21:00',
    start:18,
    width:10,
    dep:'ENG-ELT',
    type:'Internal'
  }]
}
]
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
      times,
      timeList,
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
    },
    calPosition(plan){
      var styleObj={
        width:plan.width/28*100+'%',
        left:plan.start/28*100+'%',
      }
      return styleObj;
    },
    calColor(plan){
      var styleObj={
        background:''
      };
      if(plan.type=="Internal"){
        styleObj.background="#7C5598";
      }else{
        styleObj.background="#985D55";
      }
      return styleObj;
    }

  },
  computed:{

  }
}

</script>
<style lang='scss'>
  $purple:#7C5598;
  $brown: #985D55;
  #ReservationAllRoom{
    .Invalid{
      color:#95989A !important;
      cursor: not-allowed !important;
    }
    &>.borderCard{
      padding-bottom: 0;
      .el-card__body{
        padding:0;
      } 
    }

    .calendar{
      padding-right: 10px;
      border-bottom: 1px solid #F2F2F2;
      .el-col:first-child{
        padding-top:30px;
        img{
          width:100%;
        }
      }
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
      .note{
        line-height: 55px;
        padding-right: 20px;
        span{          
          position: relative;          
          font-size: 15px;
          color:$purple;
          padding-left: 25px;
          &:before{
            content:'';
            display: block;
            position: absolute;
            width: 13px;
            height: 13px;
            border-radius: 100%;
            background: $purple;
            left: 0;
            top:0;
            bottom: 0;
            margin:auto 0;
          }
        }
        span:last-child{
          color:$brown;
          margin-left: 15px;
          &:before{
            background:$brown;
          }
        }
      }
    }
    .timeLine{
      padding-left: 16px;
      padding-right: 5px;
      line-height: 40px;
      $widthLi:100%/6*5/7;
      height:40px;
      clear: both;
      right: -19px;
      position: relative;
      li{
        float: right;
        box-sizing: border-box;
        width:$widthLi;
        text-align: right;
      }
      li:last-child{
        width: 20px;
        height: 40px;
      }
      li:first-child{
        padding-right: 20px;
      }
    }
    .borderTop{
      border-top: 1px solid #f2f2f2;
    }
    .roomDetail{
      padding-left: 16px;
      line-height: 100px;
      padding-right: 5px;
      border-top: 2px dashed #D5DADF;
      .el-col{

        font-size: 13px;
        .lineBOX{
          height: 100px;
          position: relative;
          $width:100%/7;
          .borderDiv{
            float: left;
            width: $width;
            height: 100px;
            border-right: 1px solid #F2F2F2;
            box-sizing: border-box;
          }
          .borderDiv:first-child{
            border-left: 1px solid #F2F2F2;
          }
          .line{
            position: absolute;
            width: 60%;
            left:10%;
            height: 60px;
            top:0;
            bottom: 0;
            margin:auto 0;
            line-height: 20px;
            p:first-child,p:last-child{
              font-size:13px;
              text-align: center;
              margin:5px 0;
              white-space: nowrap;
            }
            p:first-child{
              margin-top: 0;

            }
            p:nth-child(2){
              width: 100%;
              height: 5px;
              background: $purple;
              position: relative;
              &:before{
                content:'';
                display: block;
                position: absolute;
                left:0;
                top:-4px;
                height: 13px;
                width: 13px;
                border-radius: 50%;
                background: inherit;
              }
              &:after{
                content:'';
                display: block;
                position: absolute;
                right:0;
                top:-4px;
                height: 13px;
                width: 13px;
                border-radius: 50%;
                background: inherit;
              }
            }
          }
        }
      }
      .el-col-4{
        font-size: 15px;
      }
    }
  }

</style>

