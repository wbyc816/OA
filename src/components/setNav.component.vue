<template>
  <div id='setNav'>
    <el-card class="workbench">
      <div slot="header">
        <span>设置</span>
      </div>
      <el-menu>
        <el-menu-item index="1" @click.native="goToOthers('/set/loginPsw')">
          修改登录密码
        </el-menu-item>
        <el-menu-item index="2" @click.native="goToOthers('/set/personalPsw')">
          修改个人密码
        </el-menu-item>
        <el-menu-item index="3" @click.native="goToOthers('/set/phoneNumber')">
          修改手机号码
        </el-menu-item>
      </el-menu>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    goToOthers(param) {
      this.$router.push(param)
    }
  }
}
</script>

<style lang="scss">
$main: #0460AE;
$brown: #985D55;
$lan:#0460AE;
$sub:#1465C0;
$line: #D5DADF;

#setNav{
  .workbench {
    padding: 0;
    @mixin linkList($color) {
  .el-card__header {
    padding-left: 14px;
    border-bottom: 1px solid #f2f2f2;
  }
  .el-card__body {
    padding: 0;
  }
  .el-menu-item {
    border-bottom: 1px solid #f2f2f2;
    font-size: 16px;
    i:first-child {
      font-size: 23px;
      margin-right: 15px;
      color: $color;
      vertical-align: middle;
      &.icon-youhui {
        font-size: 18px;
      }
      &.icon-mail {
        vertical-align: top;
      }
    }
    .el-icon-arrow-right {
      line-height: 56px;
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
  .el-menu-item:hover {
    i {
      color: $color;
    }
    color:$color;
  }
  .el-menu-item.is-active {
    i:last-child {
      color: #676767;
    }
    color:#676767;
  }
}
    @include linkList($main);
    .el-menu-item{
      padding:0;
    }
    .el-card__header{
      padding-left: 20px;
    }
  }
}
</style>
