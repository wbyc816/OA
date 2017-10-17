<template>
  <div id='meetingHome'>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <router-view></router-view>
      </el-col>
      <el-col :span='6'>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
          <el-menu-item-group title="会议预订与通知">
            <el-menu-item index='/meeting/MyBooking'>
              我发起的<i>3</i>
            </el-menu-item>
            <el-menu-item index='#'>
              我参与的<i>4</i>
            </el-menu-item>
            <el-menu-item index='#'>
              取消的<i>4</i>
            </el-menu-item>
            <el-menu-item index='#'>
              历史记录
            </el-menu-item>
            <el-menu-item index='/meeting/meetingApp'>
              预定会议室
            </el-menu-item>
            <el-menu-item index='#'>
              会议室预订状态
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
        <el-card class="roomList">
          <ul v-for="floor in roomList">
            <li>{{floor.roomPosition}}</li>
            <li v-for="room in floor.rooms">- {{room.roomName}}</li>
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
  },
  methods: {

  },
  computed: {
    ...mapGetters([
      'userInfo',
      'roomList'
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
