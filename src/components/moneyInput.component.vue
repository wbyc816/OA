<template>
  <div class="moenyInput">
    <el-input :value="value" :class="{'hasUnit':append}" ref="input" @change="fomat" :maxlength="maxlength" @blur="blurInput" :readonly="readonly" :disabled="disabled" :placeholder="placeholder">
      <template slot="prepend" v-if="prepend">
        <slot name="prepend"></slot>
      </template>
      <template slot="append" v-if="append">
        <slot name="append"></slot>
      </template>
    </el-input>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: '',
    prepend: { //是否有前置元素，默认有
      type: Boolean,
      default: true
    },
    append: { //是否有后置元素，默认有
      type: Boolean,
      default: true
    },
    maxlength: { //最大长度，默认10
      type: Number,
      default: 10,
    },
    type: { //类型，默认money，可选int(整数)、int0（整数含0）、invoice(发票号)
      type: String,
      default: 'money'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    fomat(val) {
      if (this.type == 'money') {
        val = val.toString().match(/^[1-9]([0-9]{0,})+(?:\.\d{0,2})?/);
      } else if (this.type == 'int') {
        val = val.toString().match(/^[1-9][0-9]{0,}/)
      } else if (this.type == 'int0') {
        val = val.toString().match(/^[0-9]{0,}/)
      } else if (this.type == 'invoice') {
        val = val.toString().match(/^[0-9]([0-9]\,|[0-9]){0,}/)
      }
      if (val) {
        this.$emit('input', val[0]);
        this.$emit('change', val[0]);
        this.$refs.input.setCurrentValue(val[0]);
      } else {
        this.$emit('input', '');
        this.$emit('change', '');
        this.$refs.input.setCurrentValue('')
      }
    },
    blurInput(event) {
      if (this.type == 'money') {
        var temp = event.target.value.split('.');
        if (temp.length == 2 && (temp[1] == undefined || temp[1] == '' || temp[1] == null)) {
          this.$emit('input', temp[0]);
          this.$emit('change', temp[0]);
          this.$refs.input.setCurrentValue(temp[0]);
        }
      } else if (this.type == 'invoice') {
        var temp = event.target.value.replace(/\,$/, '');
        this.$emit('input', temp);
        this.$emit('change', temp);
        this.$refs.input.setCurrentValue(temp);
      } else if (this.type == 'int0') {
        var temp = parseFloat(event.target.value);
        if (temp === 0) {
          temp=temp+'';
          this.$emit('input', temp);
          this.$emit('change', temp);
          this.$refs.input.setCurrentValue(temp);
        }
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.moenyInput {

  .el-input {
    height: 46px;
    .el-input-group__append,
    .el-input-group__prepend {
      display: table-cell;
    }
  }
  .hasUnit {
    input {
      padding-right: 30px;
    }

    .el-input-group__append {
      border: none;
      position: absolute;
      top: 0;
      right: 10px;
      line-height: 46px;
      background: transparent;
      color: #393939;
      padding: 0;
      width: auto;
    }
  }
}

</style>
