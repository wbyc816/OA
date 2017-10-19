<template>
  <div id='meetingHome'>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <router-view></router-view>
      </el-col>
      <el-col :span='6'>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
          <el-menu-item-group title="会议预订与通知">
            <el-menu-item index='1' :route="{path:'/meeting/MyBooking'}">
              我发起的<i>{{conferenceNum.launchNum}}</i>
            </el-menu-item>
            <el-menu-item index='2' :route="{path:'/meeting/meetingSearch/1'}">
              我参与的<i>{{conferenceNum.partakeNum}}</i>
            </el-menu-item>
            <el-menu-item index='3' :route="{path:'/meeting/meetingSearch/2'}">
              取消的<i>{{conferenceNum.cancelNum}}</i>
            </el-menu-item>
            <el-menu-item index='4' :route="{path:'/meeting/meetingSearch/3'}">
              历史记录
            </el-menu-item>
            <el-menu-item index='5' :route="{path:'/meeting/meetingApp'}">
              预订会议室
            </el-menu-item>
            <el-menu-item index='6' :route="{path:'/meeting/ReservationAllRoom/all'}">
              会议室预订状态
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
        <el-card class="roomList" v-show="$route.name=='ReservationAllRoom'">
          <ul v-for="floor in roomList">
            <li>{{floor.roomPosition}}</li>
            <router-link tag="li" :to="'/meeting/ReservationAllRoom/'+room.id" v-for="room in floor.rooms">- {{room.roomName}}</router-link>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// const roomList = [{
//     floor: 'AFFC 10/F Training Room',
//     child: ['-Training Room A', '-Training Room B', '-Training Room C', '-Training Room D', '-Training Room E', '-Training Room F', '-Training Room G']
//   },
//   {
//     floor: '9/F Citygate',
//     child: ['-Meeting Room A', '-Main Conference Room   (Crisis Management Centre) ', '-Meeting Room B']
//   },
//   {
//     floor: '11/F Citygate',
//     child: ['-Meeting Room 1 ', '-Main Conference Room', '-Meeting Room 2 ']
//   },
//   {
//     floor: '7/F Citygate',
//     child: ['-Meeting Room A ', '-Interview Room', '-Boardroom ']
//   },
//   {
//     floor: 'Airport World Trade Centre',
//     child: ['-Room AB ', '-Training Room 4 ', '-Room CD ']
//   },
// ]
import { mapGetters, mapMutations } from 'vuex'
export default {

  data() {
    return {};
  },
  created() {
    this.$store.dispatch('getRoomPosition');
    // this.$store.commit('getConferenceType');
    this.$store.dispatch('getConferenceNum');
  },
  methods: {

  },
  watch:{
    '$route' (to, from){
      this.$store.dispatch('getConferenceNum');
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'roomList',
      'conferenceNum'
    ])
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
$brown: #985D55;
#meetingHome {
  .mySideLink .el-menu-item i {
    color: $main;
  }
  .searchBox {
    .doc-bar_title {
      font-size: 18px;
      line-height: 20px;
    }
    .el-card__body {
      padding-top: 15px;
      &>button {
        height: 46px;
        width: 50%;
        margin-top: 15px;
        font-size: 18px;
      }
    }
  }
  .roomList {
    padding: 0;
    .el-card__body {
      padding: 0;
    }
    ul {
      border-bottom: 1px solid #f2f2f2;
      li {
        padding-left: 12px;
      }
      li:first-child {
        line-height: 50px;
        border-bottom: 1px solid #f2f2f2;
        font-size: 16px;
        color: #676767;
      }
      li:nth-child(n+2) {
        line-height: 30px;
        color: $main;
        font-size: 15px;
        cursor: pointer;
      }
      li:nth-child(2) {
        padding-top: 5px;
      }
      li:last-child {
        padding-bottom: 5px;
      }
    }
  }
}

</style>
