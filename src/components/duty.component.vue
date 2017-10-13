<template>
  <div class="duty" v-loading="organLoading">
    <el-card>
      <div slot="header">今日值班
        <router-link to="/duty/">更多</router-link>
      </div>
      <p class="leader" v-if="dutys.leader&&dutys.leader.name"><span class="name">01 {{dutys.leader.name}}</span>{{dutys.leader.phone | phone}}</span>
      </p>
      <el-menu mode="vertical" default-active="1">
        <el-menu-item-group>
          <el-submenu :index="duty.deptName" v-for="duty in dutys.ondutylist">
            <template slot="title">{{duty.deptName}}</template>
            <el-menu-item :index="duty.deptName+child.empName" v-for="child in duty.onduty">
              <span class="name">{{child.empName}}</span>{{child.mobileNumber | phone}}
            </el-menu-item>
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
      dutys: { ondutylist: [] }
    }
  },
  created() {
    this.getData();
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
    getData() {
      var date1 = new Date().getTime()
      this.$http.post('/onduty/getDutyInfo', { dutyDate:"2017-09-30" })
        .then(res => {
          if (res.status == 0) {
            this.dutys = res.data;
          } else {
            console.log('获取值班信息失败')
          }
        })
    }
    
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.duty {
  margin-bottom: 20px;
  .name {
    width: 60px;
    display: inline-block;
  }
  .leader {
    line-height: 56px;
    height: 56px;
    padding-left: 20px;
    font-size: 14px;
    color: rgb(72, 86, 106);
    border-bottom: 1px solid #F2F2F2;
  }
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
