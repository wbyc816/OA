<template>
  <div class="duty" v-loading="organLoading">
    <el-card>
      <div slot="header">值班列表
        <router-link to="/duty/"  target= "_blank">更多</router-link>
      </div>
      <div class="dutyWrap">
        <div class="dutyBox clearfix" v-for="(item,index) in dutys" v-if="index<2">
          <div class="dateBox">
            <p v-if="index==0">今天</p>
            <p v-else-if="index==1">明天</p>
            <p v-else>{{item.oudutyDate | time('ch')}}
              <br/>{{item.oudutyDate | time('week')}}</p>
          </div>
          <div class="infoBox">
            <!-- <p v-for="(child,index) in item.onduty">
              <template v-if="index==0&&child.isLeader==1">
                <span>01</span><span>{{child.empName}}</span><span>{{child.mobileNumber | phone}}</span>
              </template>
            </p> -->
            <p v-for="(child,index) in item.onduty">
              <template v-if="child.isLeader==0">
                <span>AOC</span><span>{{child.empName}}</span><span>{{child.mobileNumber | phone}}</span>
              </template>
            </p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      organLoading: false
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
      'userInfo',
      'dutys'
    ])
  },
  methods: {
    getData() {
      if (this.dutys.length == 0) {
        this.$http.post('/onduty/getDutyInfo', )
          .then(res => {
            if (res.status == 0) {
              this.$store.commit('setDutys', res.data);
            } else {
              console.log('获取值班信息失败')
            }
          })
      }
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
    // border-bottom: 1px solid #b5b5b5;
  }
  .el-card__body {
    padding: 0 10px;
  }
  .name {
    padding-right: 20px; // display: inline-block;
  }
  .titleName {
    padding-left: 20px;
    padding-right: 10px;
  }
  .leader {
    line-height: 56px;
    height: 56px;
    padding-left: 20px;
    font-size: 14px;
    color: rgb(72, 86, 106);
  }
  .dutyBox {
    border-bottom: 1px solid #D5DADF;
    font-size: 14px;
    color: #676767;
    .dateBox {
      width: 35%;
      float: left;
      height: 80px;
      padding-left: 14px;
      padding-top: 20px;
      p {
        line-height: 20px;
        vertical-align: middle;
        display: inline-block;
      }
    }
    .infoBox {
      float: left;
      width: 65%;
      p {
        line-height:60px;
        height: 60px;
        padding-left: 10px;
        span:first-child {
          width: 40px;
          display: inline-block;
        }
        span:nth-child(2) {
          padding-right: 10px;
        }
        &:first-child {
          // border-bottom: 1px solid #F2F2F2;
        }
      }
    }
  }
  .dutyWrap {
    $colors: (1: #02B4EE, 2: #028CD2, 3: #026CB9, 4: #4B3D9D, 5: #761690, 6: #BE018C, 7: #E70282);
    @each $num,
    $color in $colors {
      .dutyBox:nth-child(#{$num}) {
        .dateBox {
          color: $color;
        }
        &:hover {
          background: $color;
          color: #fff;
          .dateBox {
            color: #FFF;
          }
        }
      }
    }
    .dutyBox:first-child {
      background: #0281EE;
      color: #fff;
      .dateBox {
        color: #FFF;
      }
    }
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
      border-bottom: 1px solid #F2F2F2; // transition:all 0.3s;
    }
    .el-menu-item {
      cursor: auto;
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
  .el-menu-item-group {
    >ul>.el-menu-item {
      border-bottom: 1px solid #F2F2F2;
    }
  }
  .el-submenu .el-menu-item {
    padding-left: 18px !important;
    font-size: 14px;
  }
}

</style>
