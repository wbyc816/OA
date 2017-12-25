<template>
  <a :href="data.link" class='doc-block' :target="target" @click="goTo($event)">
    <span class='doc-title'>
      <span class='logo' :style="{'background-color':data.color, 'padding': data.padding}">
        <i class='iconfont' :style="{'font-size': data.font ? data.font : fontSize }" :class='data.logo'></i>
      </span>
      <span class='doc-text' v-text='data.text'></span>
    </span>
  </a>
</template>
<style scoped lang='scss'>
.doc-block {
  display: inline-block;
  width: 100%;
  height: 57px;
  cursor: pointer;
  .doc-title {
    position: relative;
    float: right;
    width: 85%;
    height: 100%;
    font-size: 16px;
    line-height: 57px;
    padding: 0 7px 0 38px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(#000, 0.16);
    .logo {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 57px;
      height: 57px;
      text-indent: 0;
      transform: translate(-50%, 0);
      border-radius: 50%;
      background: url('../assets/images/doc-item-shadow1.png') 0 0;
      text-align: center;
    }
    .iconfont {
      line-height: 57px;
      text-indent: 0;
      color: #fff;
    }
    .doc-text {
      display: inline-block; // max-width: 130px;
      text-align: left;
      font-size: 14px;
      text-indent: 0;
      color: #393939;
      line-height: 17px;
      vertical-align: middle;
    }
  }
}

</style>
<script>
export default {
  data() {
    return {
      target: '_self',
    }
  },
  props: {
    data: {
      type: Object,
      require: true
    },
    fontSize: {
      type: String,
      default: '22px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disableText: {
      type: String,
      default: '未开放，敬请期待'
    }
  },
  created() {
    if (/^http/.test(this.data.link)) {
      this.target = '_blank'
    } else {

    }
  },
  methods: {
    goTo(event) {
      if (this.disabled) {
        event.preventDefault();
        this.$message.info(this.disableText);
      } else {
        // if (!/^http/.test(this.data.link)) {
        //   console.log(this.data.link)
        //   this.$router.push(this.data.link);
        // }
      }
    }
  }
}

</script>
