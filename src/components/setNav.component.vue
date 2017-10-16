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
@import '../assets/scss/color.scss';
@import '../assets/scss/mixins.scss';

#setNav{
  .workbench {
    padding: 0;
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
