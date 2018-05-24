<template>
  <div id='forumHome'>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <keep-alive exclude="forumApp">
          <router-view></router-view>
        </keep-alive>
      </el-col>
      <el-col :span='6'>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
          <el-menu-item-group title="论坛">
            <el-menu-item index='1' :route="{path:'/forum/myforum'}">
              帖子管理
            </el-menu-item>
            <el-menu-item index='2' :route="{path:'/forum/forumApp'}">
              发帖
            </el-menu-item>
            <el-menu-item index='3' :route="{path:'/forum/contributeManagement'}">
              员工贡献榜管理
            </el-menu-item>
            <!-- <el-menu-item index='3' :route="{path:'/SMS/SMSSearch'}" v-if="userInfo.smsManger>0">
              短信管理
            </el-menu-item> -->
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
    return {
    };
  },
  created() {
  },
  methods: {
  },
  watch: {
    
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
#forumHome {
  .mySideLink .el-menu-item i {
    color: $main;
  }
}

</style>
