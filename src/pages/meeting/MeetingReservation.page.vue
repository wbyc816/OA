<template>
  <div id='MeetingReservation'>
    <el-row :gutter='12'>
      <el-col :span='18' >
        <router-view></router-view>
      </el-col>
      <el-col :span='6'>
        <el-card class="borderCard searchBox">
          <div slot="header" class='doc-bar_title'>
            <span>Meeting Reservation</span>
          </div>
          <el-input class="search">
            <el-button slot="append">Search</el-button>
          </el-input>
          <el-button type="primary" v-goto="{name:'MyBooking'}">My Booking</el-button>
        </el-card>
        <el-card class="roomList">
          <ul v-for="floor in roomList">
            <li>{{floor.floor}}</li>
            <li v-for="room in floor.child" v-goto="{'name':'ReservationByRoom'}">{{room}}</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  const roomList=[
  {
    floor:'AFFC 10/F Training Room',
    child:['-Training Room A','-Training Room B','-Training Room C','-Training Room D','-Training Room E','-Training Room F','-Training Room G']
  },
  {
    floor:'9/F Citygate',
    child:['-Meeting Room A','-Main Conference Room   (Crisis Management Centre) ','-Meeting Room B']
  },
  {
    floor:'11/F Citygate',
    child:['-Meeting Room 1 ','-Main Conference Room','-Meeting Room 2 ']
  },
  {
    floor:'7/F Citygate',
    child:['-Meeting Room A ','-Interview Room','-Boardroom ']
  },
  {
    floor:'Airport World Trade Centre',
    child:['-Room AB ','-Training Room 4 ','-Room CD ']
  },
  ]
  export default{

    mounted(){
    },
    data(){
      return{
        roomList
      };
    },

    methods:{


    },
    computed:{

    }
  }

</script>
<style lang='scss'>
  $purple:#7C5598;
  $brown: #985D55;
  #MeetingReservation{
    .searchBox{
      .doc-bar_title{
        font-size: 18px;
        line-height: 20px;
      }
      .el-card__body{
        padding-top: 15px;
        &>button{
          height: 46px;
          width: 50%;
          margin-top: 15px;
          font-size: 18px;
        }
      }
      
    }
    &>.el-row>.el-col-6{
      .roomList{
        padding: 0;
        ul{
          border-bottom: 1px solid #f2f2f2;
          li{
            padding-left:12px;
          }
          li:first-child{
            line-height: 50px;
            border-bottom: 1px solid #f2f2f2;
            font-size: 16px;
            color:#676767;
          }
          li:nth-child(n+2){
            line-height: 30px;
            color:$purple;
            font-size: 15px;
            cursor: pointer;
          }
          li:nth-child(2){
            padding-top: 5px;
          }
          li:last-child{
            padding-bottom: 5px;
          }
        }
      }
    }
  }

</style>

