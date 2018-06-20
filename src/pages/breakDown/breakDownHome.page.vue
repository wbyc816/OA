<template>
  <div id='breakDownHome'>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <keep-alive exclude="breakDownDetail,breakDownApp">
          <router-view></router-view>
        </keep-alive>
      </el-col>
      <el-col :span='6'>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
          <el-menu-item-group title="接线">
            <el-menu-item index='1' :route="{path:'/breakDown/breakDownApp'}">
              新建接线记录
            </el-menu-item>
            <el-menu-item index='2' :route="{path:'/breakDown/myBreakDown'}">
              我的接线记录
            </el-menu-item>
            <el-menu-item index='3' :route="{path:'/breakDown/breakDownSearch'}">
              全部接线记录
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
#breakDownHome {
  .mySideLink .el-menu-item i {
    color: $main;
  }
}

</style>
