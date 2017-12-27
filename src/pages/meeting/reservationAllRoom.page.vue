<template>
  <div id='ReservationAllRoom'>
    <el-card class="borderCard">
      <span slot="header">{{roomId==''?'所有房间':'按房间查看'}}</span>
      <el-row class="calendar" :gutter='28'>
        <el-col :span="8" v-for="(dayArray,index) in days">
          <div class="dayWrap">
            <p>{{dayArray[10] | time('month')}}</p>
            <table class="dayList">
              <tr>
                <td>一</td>
                <td>二</td>
                <td>三</td>
                <td>四</td>
                <td>五</td>
                <td>六</td>
                <td>天</td>
              </tr>
            </table>
            <ul class="dateBox clearfix">
              <li v-for="day in dayArray" :class="{'today':today==day,'Invalid':today>day,'selected':selectDay==day}" @click="select(day)">
                {{day | time('day')}}</li>
            </ul>
          </div>
        </el-col>
      </el-row>
      <div class="operation">
        <div class="select">
          <i class="el-icon-arrow-left flLeft" :class="{'Invalid':selectDay<=today}" @click="changeDay(-1)"></i>
          <span>{{selectDay | time('date')}}</span><span>{{selectDay | time('week')}}</span>
          <i class="el-icon-arrow-right flRight" :class="{'Invalid':selectDay>=lastDay}" @click="changeDay(1)"></i>
        </div>
        <div class="flRight note"><span v-for="item in conferenceType">{{item.typeName}}</span></div>
      </div>
      <el-row class="roomIntro" v-show="roomId!=''">
        <el-col :span="4">{{roomInfo.roomPlace}}{{roomInfo.roomName}}</el-col>
        <el-col :span="4">面积:{{roomInfo.roomArea}}平米</el-col>
        <el-col :span="4">容纳人数:{{roomInfo.galleryful}}</el-col>
        <el-col :span="12">描述:{{roomInfo.remark}}</el-col>
      </el-row>
      <ul class="timeLine">
        <li v-for="time in times">{{time}}</li>
        <li></li>
      </ul>
      <el-row class="roomDetail" v-for="row in timeList" v-show="timeList.length>0">
        <el-col :span='4' class="roomName"><span>{{row.roomName}}</span></el-col>
        <el-col :span='20'>
          <div class="lineBOX">
            <div class="borderDiv" v-for="o in 7"></div>
            <div class="line" v-for="plan in row.plan" :style="calPosition(plan)">
              <el-tooltip class="item" effect="dark" :content="timeFilter(plan.beginTime,'hours')+'-'+timeFilter(plan.endTime,'hours')" placement="top">
                <p>{{plan.beginTime | time('hours')}}-{{plan.endTime | time('hours')}}</p>
              </el-tooltip>
              <p :style="{background:handleBg(plan)}"></p>
              <el-tooltip class="item" effect="dark" :content="plan.dep" placement="bottom">
                <p>{{plan.dep}}</p>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="emptyText" v-show="timeList.length==0">暂无预定信息</div>
      <div class="operation borderTop" v-show="roomId==''">
        <div class="select">
          <i class="el-icon-arrow-left flLeft" :class="{'Invalid':selectDay<=today}" @click="changeDay(-1)"></i>
          <span>{{selectDay | time('date')}}</span><span>{{selectDay | time('week')}}</span>
          <i class="el-icon-arrow-right flRight" :class="{'Invalid':selectDay>=lastDay}" @click="changeDay(1)"></i>
        </div>
        <div class="flRight note"><span v-for="item in conferenceType">{{item.typeName}}</span></div>
      </div>
    </el-card>
  </div>
</template>
<script>
const times = ['22:00', '20:00', '18:00', '16:00', '14:00', '12:00', '10:00', '08:00'];
const colors = [{ type: '05d06a2d21f24d91aad56c1388308085', color: '#0460AE' }, { type: 'cbb01e09e33e4ade809b05d898a9b19a', color: '#BE3B7F' }, { type: '4bb396cbc6cf40ebb994e7d1a5a656f6', color: '#673ab7' }, { type: '05a82dcd2b72453cb86d011a44c712ee', color: '#2196f3' }]

import { mapGetters, mapMutations } from 'vuex'

export default {

  mounted() {

  },
  data() {
    return {
      days: [],
      today: 0,
      selectDay: 0,
      lastDay: 0,
      times,
      // timeList,
      reserveList: [],
      roomId: '',
      roomInfo: {}
    };
  },
  computed: {
    timeList() {
      var list = [];
      if (this.reserveList.length != 0) {
        this.reserveList.forEach(r => {
          var temp = {
            roomName: r.roomPlace + r.roomName,
            plan: []
          }
          if (r.roomVos.length != 0) {
            r.roomVos.forEach(p => {
              if (this.selectDay < p.beginTime) {
                temp.plan.push({
                  beginTime: p.beginTime,
                  endTime: p.endTime,
                  start: this.calWidth(p.beginTime),
                  width: this.calWidth(p.endTime) - this.calWidth(p.beginTime),
                  isInside: p.isInside,
                  dep: p.deptName + '-' + p.reserveName,
                  type: p.conferenceTypeId
                })
              }
            })
            list.push(temp);
          }

        })
      }
      return list;
    },
    ...mapGetters([
      'userInfo',
      'roomList',
      'conferenceType'
    ])
  },
  created() {
    if (this.$route.params.id == 'all') {
      this.roomId = ''
    } else {
      this.roomId = this.$route.params.id;
      this.getRoomInfo();
    }
    this.init();
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.id == 'all') {
      this.roomId = ''
    } else {
      this.roomId = to.params.id;
      this.getRoomInfo();
    }
    this.init();
    next();
  },
  methods: {
    init() {
      var today = new Date();
      var yearNow = today.getFullYear();
      var monthNow = today.getMonth();
      if (this.days.length == 0) {
        for (var i = 0; i < 3; i++) {
          this.days.push(this.getDays(yearNow, monthNow + i));
        }
      }
      this.today = this.selectDay = new Date(today.toDateString()).getTime();
      this.lastDay = new Date(yearNow, monthNow + 3, 0).getTime();
      this.getReserveList();
    },
    getDays(year, month) {
      var days = []
      var countDay = new Date(year, month + 1, 0).getDate();
      var firstDayWeek = new Date(year, month, 1).getDay();
      var days = [];
      for (var i = 0; i < firstDayWeek - 1; i++) {
        days.push('');
      }
      for (var i = 1; i <= countDay; i++) {
        days.push(new Date(year, month, i).getTime());
      }
      return days;
    },
    select(day) {
      if (day >= this.today) {
        this.selectDay = day;
        this.getReserveList();
      }
    },
    changeDay(sign) {
      if ((this.selectDay != this.today && sign != 1) || (this.selectDay != this.lastDay && sign != -1)) {
        this.selectDay = this.selectDay + 86400000 * sign;
        this.getReserveList();
      }
    },
    calPosition(plan) {
      var styleObj = {
        width: plan.width + '%',
        left: plan.start + '%',
      }
      return styleObj;
    },
    calColor(plan) {
      var styleObj = {
        background: ''
      };
      if (plan.type == "Internal") {
        styleObj.background = "#7C5598";
      } else {
        styleObj.background = "#BE3B7F";
      }
      return styleObj;
    },
    getReserveList() {
      this.$http.post('/conference/reserveRoomDetails', { roomId: this.roomId, reserveDate: this.timeFilter(this.selectDay, 'xie') })
        .then(res => {
          if (res.status == 0) {
            this.reserveList = res.data;
          } else {

          }
        })
    },
    calWidth(time) {
      var width = 0;
      var tempTime = time - this.selectDay - (8 * 60 * 60 * 1000);
      width = parseInt(tempTime) / (14 * 60 * 60 * 1000);
      return width * 100;
    },
    getRoomInfo() {
      this.$http.post('conference/findByid', { roomId: this.roomId })
        .then(res => {
          if (res.status == 0) {
            this.roomInfo = res.data;
          } else {

          }
        })
    },
    handleBg(plan) {
      console.log(plan);
      var temp = colors.find(c => c.type == plan.type) || { color: '#0460AE' };
      return temp.color;
    }
  },

}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
$brown: #BE3B7F;
#ReservationAllRoom {
  .Invalid {
    color: #95989A !important;
    cursor: not-allowed !important;
  }
  &>.borderCard {
    padding-bottom: 0;
    .el-card__body {
      padding: 0;
    }
  }

  .calendar {
    // padding-right: 10px;
    padding: 20px 0;
    border-bottom: 1px solid #F2F2F2;
    .el-col {
      &:nth-child(2) {
        border-left: 1px solid #F2F2F2;
        border-right: 1px solid #F2F2F2;
      }
      .dayWrap {
        width: 200px;
        margin: 0 auto;
      }
      p {
        font-size: 22px;
        text-align: center;
        color: $sub;
        padding-bottom: 15px;
        padding-top: 15px;
      }
      $man: 100%;
      .dayList {
        width: 100%;
        td {
          width: $man /7;
          font-size: 12px;
          text-align: center;
          height: 30px;
          vertical-align: middle;
          color: $sub;
          font-weight: bold;
        }
        td:nth-child(6),
        td:nth-child(7) {
          color: #D71718;
        }
      }
      .dateBox {
        // display: flex;
        // flex-wrap: wrap;
        li {
          // flex: 0 0 $man / 7;
          width: $man /7;
          float: left;
          position: relative;
          color: $sub;
          text-align: center;
          line-height: 28px;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          height: 28px;
        }
        li:nth-child(7n),
        li:nth-child(7n+6) {
          color: #E74C3C;
        }
        .today:before {
          content: '';
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin: 0 auto;
          height: 5px;
          width: 5px;
          border-radius: 100%;
          background: #D71718;
        }
        .selected {
          color: #fff !important;
          background: $main;
        }
      }
    }
  }
  .operation {
    width: 100%;
    padding: 0 5px;
    box-sizing: border-box;
    border-bottom: 1px solid #f2f2f2;
    .select {
      display: inline-block;
      width: 220px;
      line-height: 55px;
      padding-left: 20px;
      text-align: center;
      i {
        font-size: 16px;
        color: #777777;
        line-height: 55px;
        cursor: pointer;
      }
      span {
        font-size: 16px;
        padding: 5px;
      }
    }
    .note {
      line-height: 55px;
      span {
        position: relative;
        font-size: 15px;
        color: $main;
        padding-left: 25px;
        margin-right: 15px;
        &:before {
          content: '';
          display: block;
          position: absolute;
          width: 13px;
          height: 13px;
          border-radius: 100%;
          background: $main;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto 0;
        }
      }
      $widths: (1: $main, 2: $brown, 3: #673ab7, 4: #2196f3);
      @each $num,
      $width in $widths {
        span:nth-child(#{$num}) {
          color: $width;
          &:before {
            background: $width;
          }
        }
      }
    }
  }
  .roomIntro {
    background: $main;
    line-height: 70px;
    color: #fff;
    padding-left: 20px;
  }
  .timeLine {
    padding-left: 21px;
    padding-right: 5px;
    line-height: 40px;
    $widthLi: 100%/6*5/7;
    height: 40px;
    clear: both;
    right: -14px;
    position: relative;
    li {
      float: right;
      box-sizing: border-box;
      width: $widthLi;
      text-align: right;
    }
    li:last-child {
      width: 20px;
      height: 40px;
    }
    li:first-child {
      padding-right: 20px;
    }
  }
  .borderTop {
    border-top: 1px solid #f2f2f2;
  }
  .roomDetail {
    padding-left: 16px;
    line-height: 100px;
    padding-right: 5px;
    border-top: 2px dashed #D5DADF;
    .el-col {

      font-size: 13px;
      &.roomName span{
        display: inline-block;
        line-height: 1;
        vertical-align: middle;
        padding-right: 10px;
        text-align: center;
      }
      .lineBOX {
        height: 100px;
        position: relative;
        $width: 100%/7;
        .borderDiv {
          float: left;
          width: $width;
          height: 100px;
          border-right: 1px solid #F2F2F2;
          box-sizing: border-box;
        }
        .borderDiv:first-child {
          border-left: 1px solid #F2F2F2;
        }
        .line {
          position: absolute;
          width: 60%;
          left: 10%;
          height: 60px;
          top: 0;
          bottom: 0;
          margin: auto 0;
          line-height: 20px;
          p:first-child,
          p:last-child {
            font-size: 13px;
            text-align: center;
            margin: 5px 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          p:first-child {
            margin-top: 0;
          }
          p:last-child {}
          p:nth-child(2) {
            width: 100%;
            height: 5px;
            background: $main;
            position: relative;
            &:before {
              content: '';
              display: block;
              position: absolute;
              left: 0;
              top: -4px;
              height: 13px;
              width: 13px;
              border-radius: 50%;
              background: inherit;
            }
            &:after {
              content: '';
              display: block;
              position: absolute;
              right: 0;
              top: -4px;
              height: 13px;
              width: 13px;
              border-radius: 50%;
              background: inherit;
            }
          }
        }
      }
    }
    .el-col-4 {
      font-size: 15px;
    }
  }
  .emptyText {
    color: rgb(94, 113, 130);
    line-height: 50px;
    text-align: center;
    font-size: 14px;
  }
}

</style>
