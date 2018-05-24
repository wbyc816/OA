<template>
  <div class="floatBackButotn" :style="{left:backLeft+'px',top:backTop+'px'}" @click="$router.go(-1)" v-show="hisLenth!=1">
    <i class="iconfont icon-fanhui"></i>
  </div>
</template>
<script>
import jquery from 'jquery'
export default {
  props:{
    backTop:{
      type:Number,
      default:207
    }
  },
  data() {
    return {
      hisLenth: 1,
      backLeft: 1100,
      parentBlock:null
    }
  },
  mounted() {
    this.hisLenth = window.history.length;
    this.parentBlock=jquery('.floatBackButotn').parents('.container');
    jquery(window).resize(this.handlerResize);
    this.handlerResize();
  },
  methods: {
    handlerResize(){
      this.backLeft=1100+this.parentBlock.offset().left;
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
.floatBackButotn {
  background: $main;
  position: fixed;
  left: 794px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  cursor: pointer;
  opacity: 0.15;
  transition: opacity .3s;
  &:hover {
    opacity: 1;
  }
  i {
    color: #fff;
    display: block;
    line-height: 40px;
    text-align: center;
    font-size: 30px;
  }
}

</style>
