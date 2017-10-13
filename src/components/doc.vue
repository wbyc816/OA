<template>
  <a :href="data.link" :target='target' class='doc-block'>
    <span class='doc-title'>
      <span class='logo' :style={backgroundColor:data.color}>
        <i class='iconfont' :style="{'font-size': fontSize,'color': data.fontColor }" :class='data.logo'></i>
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
    display: flex;
    justify-content: left;
    align-items: center;
    float: right;
    width: 85%;
    height: 100%;
    font-size: 16px;
    line-height: 18px;
    text-indent: 14px;
    text-align: center;
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
    }
    .iconfont {
      line-height: 57px;
      text-indent: 0;
      color: #fff;
      /*color: green;
      background-color: white;*/
    }
    .doc-text {
      display: inline-block;
      max-width: 150px;
      padding-left: 40px;
      text-align: left;
      font-size: 14px;
      text-indent: 0;
      color: #393939;
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
    }
  },
  created() {
    if (/^http/.test(this.data.link)) {
      this.target = '_blank'
    } else {
      // this.data.link = '#' + this.data.link
    }
  }
}

</script>
