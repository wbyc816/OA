<template>
  <div id='SMSHome'>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <keep-alive exclude="SMSDetail,SMSApp">
          <router-view></router-view>
        </keep-alive>
      </el-col>
      <el-col :span='6'>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
          <el-menu-item-group title="短信">
            <el-menu-item index='1' :route="{path:'/SMS/SMSApp'}">
              新建短信
            </el-menu-item>
            <el-menu-item index='2' :route="{path:'/SMS/mySMS'}">
              我的短信
            </el-menu-item>
            <el-menu-item index='3' :route="{path:'/SMS/SMSSearch'}">
              短信管理
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
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
  created() {},
  methods: {

  },
  watch: {
    '$route' (to, from) {
      // this.$store.dispatch('getConferenceNum');
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
#SMSHome {
  .mySideLink .el-menu-item i {
    color: $main;
  }
}

</style>
