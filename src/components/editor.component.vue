<template>
  <div class="editorWrap" :class="{'isFocus':isFocus}">
    <div v-html="content" @input="result" ref="editor" style="height:400px" @focus="isFocus=true" @blur="isFocus=false">
    </div>
    <div class="tempBox" @click="setContent(tempText)">
      <i class="iconfont icon-moban"></i>模板
    </div>
    <p class="remainNum" :style="{color:isOver?'#ff4949':''}">
      <template v-if="!isOver">
        还能输入<span>{{remainNum}}</span>个字
      </template>
      <template v-else>
        已超出最大输入长度,将不能提交
      </template>
    </p>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import WangEditor from 'wangeditor'
export default {
  data() {
    return {
      editor: '',
      remainNum: 5000,
      isOver: false,
      content: '',
      tempText: '',
      isFocus: false
    }
  },
  computed: {
    ...mapGetters([
      'baseURL',
      'docType',
      'userInfo'
    ])
  },
  watch: {
    docType: function(newval) {
      if (newval.length != 0) {
        this.handleTemp();
      }
    }
  },
  mounted() {
    this.handleTemp();
    const editor = new WangEditor(this.$refs.editor);
    editor.config.printLog = false;
    editor.config.menus = ['bold', 'underline', 'italic', 'eraser', 'forecolor', 'bgcolor', '|', 'unorderlist', 'orderlist', 'alignleft', 'aligncenter', 'alignright', 'indent'];
    editor.config.menuFixed = false;
    editor.create();
    this.editor = editor;
  },
  methods: {
    result() {
      this.$emit('input', this.editor.$txt.html());
      this.calcNum();
    },
    calcNum() {
      if (this.editor) {
        var num = this.editor.$txt.text().length;
        this.remainNum = 5000 - num;
        if (this.remainNum < 0) {
          this.remainNum = 0;
        }
        this.$emit('updateLen', num)
      }
    },
    handleTemp() {
      if (this.docType.length != 0) {
        var doc = this.docType.find(d => d.docTypeCode == this.$route.params.code);
        this.tempText = doc.temPlate;
      }
    },
    setContent(val) {
      this.editor.$txt.html(val);
      this.$emit('input', this.editor.$txt.html());
      this.calcNum();
    },
    // focusEditor() {
    //   this.isFocus = true;
    // }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.editorWrap {

  .wangEditor-container {
    border: 1px solid #B7B7B7;
    .wangEditor-menu-container {
      height: 30px;
    }
    .wangEditor-txt {
      line-height: 24px;
      b{
          font-weight:700;
          line-height:inherit;
        }
      i{
        font-style: italic;
        line-height:inherit;
      }
      p,h1,h2,h3,h4,h5 {
        margin: 0;
        color: #393939;
        font-size: 16px!important;
        font-family: Arial;
        line-height: 24px!important;
        *{
          line-height:inherit;
        }
        span {
          font-size: 16px!important;
        }

      }
    }
  }
  &.isFocus {
    .wangEditor-container {
      border-color: $main;
    }
  }
  .tempBox {
    // background :$sub;
    position: absolute;
    right: 0;
    top: 0;
    height: 30px;
    color: $sub; // transform:rotate(45deg);
    cursor: pointer;
    z-index: 1;
    padding-right: 13px;
    line-height: 30px;
    i {
      margin-right: 3px;
      font-size: 12px;
    }
  }
  .remainNum {
    position: absolute;
    right: 0px;
    bottom: -30px;
    color: #9a9a9a;
    font-size: 12px;
    span {
      color: $main;
    }
  }
}

</style>
