<template>
  <div class="duty" v-loading="organLoading">
    <el-card>
      <div slot="header">今日值班
        <router-link to="#">更多</router-link>
      </div>
      <el-menu mode="vertical" default-active="1">
        <el-menu-item-group>
          <el-submenu index="1">
            <template slot="title">IT服务部</template>
            <el-menu-item index="2-1">莫文 : 138 4564 7841</el-menu-item>
            <!-- <el-menu-item index="1-1">Doc Searching</el-menu-item> -->
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">地面服务部</template>
            <el-menu-item index="2-1">莫文耀 : 138 4164 7841</el-menu-item>
            <el-menu-item index="2-2">刘莉: 133 6415 57871</el-menu-item>
            <el-menu-item index="2-3">王立伟 : 134 3641 8874</el-menu-item>
            <el-menu-item index="2-4">王天峰 : 133 1248 4774</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">货运部</template>
            <el-menu-item index="3-1">宋丽萍：135 4887 2561</el-menu-item>
          </el-submenu>
        </el-menu-item-group>
      </el-menu>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      organLoading: false,
    }
  },
  created() {
    // if(this.depts != '' || this.depts != undefined || this.depts != null){
    //   this.organLoading = false;
    // }
  },
  mounted() {

  },
  computed: {
    ...mapGetters([
      'depts',
      'userInfo'
    ])
  },
  methods: {
    expand() {

    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.duty {
  margin-bottom: 20px;
  .el-card__header {
    a {
      float: right;
      color: #676767;
      font-size: 14px;
      line-height: 24px;
    }
  }
  .el-menu-item-group__title {
    display: none;
  }
  .el-card__body {
    padding: 0;
    .el-submenu__title {
      border-bottom: 1px solid #F2F2F2;
    }
  }
  .el-submenu.is-opened {
    .el-submenu__title {
      color: $main;
    }
    .el-menu {
      border-bottom: 1px solid #F2F2F2;
      li:hover {
        cursor: auto;
      }
      .is-active {
        color: #676767;
      }
    }
  }
  .el-submenu .el-menu-item {
    padding-left: 18px !important;
    font-size: 15px;
  }
}

</style>
