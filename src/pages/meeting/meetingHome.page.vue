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
            <el-menu-item index='5' :route="{path:'/meeting/meetingApp'}" v-if="userInfo.isDocsec&&userInfo.isDocsec[0]==1">
              预订会议室
            </el-menu-item>
            <el-menu-item index='6' :route="{path:'/meeting/ReservationAllRoom/all'}">
              会议室预订状态
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
        <el-card class="roomList borderCard" v-show="$route.name=='ReservationAllRoom'">
          <el-menu class="el-menu-vertical-demo" :default-openeds="roomList.map(r=>r.roomPosition)" router>
            <el-submenu :index="floor.roomPosition" v-for="(floor,index) in roomList" :key="floor.roomPosition">
              <template slot="title">{{floor.roomPosition}}</template>
              <el-menu-item :index="'/meeting/ReservationAllRoom/'+room.id" v-for="room in floor.rooms" :key="room.id">
                - {{room.roomName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {

  data() {
    return {};
  },
  created() {
    this.$store.dispatch('getRoomPosition');
    this.$store.dispatch('getConferenceType');
    this.$store.dispatch('getConferenceNum');
  },
  methods: {

  },
  watch: {
    '$route' (to, from) {
      this.$store.dispatch('getConferenceNum');
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'roomList',
      'conferenceNum',
      'conferenceType'
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
    .el-card__body {
      padding: 0;
    }

    .el-menu-vertical-demo {
      box-shadow: none;
      .el-submenu {}
      .el-submenu__title {
        color: #676767;
        font-size: 16px;
        border-bottom: none;
        height: 55px;
        line-height: 50px;
        padding-left: 14px!important;
        border-bottom: 1px solid #E9E9E9; // i {
      }
      .el-menu {
        border-bottom: 1px solid #E9E9E9;
        padding: 10px 0;
      }
      .el-menu-item {
        padding-left: 14px!important;
        font-size: 15px;
        height: 35px;
        line-height: 35px;
        color: $sub;
      }
    }
  }
}

</style>
