<template>
  <div id='faultDealHome'>
    <el-row :gutter='12'>
      <el-col :span='18'>
        <keep-alive exclude="faultDealDetail,faultDealApp">
          <router-view></router-view>
        </keep-alive>
      </el-col>
      <el-col :span='6'>
        <el-menu mode="vertical" v-bind:router="true" class="mySideLink">
          <el-menu-item-group title="接障">
            <!-- <el-menu-item index='1' :route="{path:'/faultDeal/faultDealApp'}">
              新建接障记录
            </el-menu-item> -->
            <el-menu-item index='2' :route="{path:'/faultDeal/myfaultDeal'}">
              我的接障记录
            </el-menu-item>
            <el-menu-item index='3' :route="{path:'/faultDeal/faultDealSearch'}">
              全部接障记录
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
#faultDealHome {
  .mySideLink .el-menu-item i {
    color: $main;
  }
}

</style>
