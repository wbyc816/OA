<template>
  <div class="moenyInput">
    <el-input :value="value" :class="{'hasUnit':hasUnit}" ref="input" @change="fomat" :maxlength="10" @blur="blurInput">
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
    hasUnit: {
      type: Boolean,
      default: true
    },
    prepend:{
      type: Boolean,
      default: true
    },
    append:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  created() {
    // if(this.depts != '' || this.depts != undefined || this.depts != null){
    //   this.organLoading = false;
    // }
  },
  mounted() {

  },
  computed: {

  },
  watch: {

  },
  methods: {
    fomat(val) {
      val = val.toString().match(/^\d+(?:\.\d{0,2})?/);
      if (val) {
        this.$emit('input', val[0]);
        this.$emit('change', val[0]);
        this.$refs.input.setCurrentValue(val[0]);
      } else {
        this.$emit('input', val[0]);
        this.$emit('change', val[0]);
        this.$refs.input.setCurrentValue('')
      }
    },
    blurInput(event) {
      var temp = event.target.value.split('.');
      if (temp.length == 2 && (temp[1] == undefined || temp[1] == '' || temp[1] == null)) {
        this.$emit('input', temp[0]);
        this.$emit('change', temp[0]);
        this.$refs.input.setCurrentValue(temp[0]);
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
    .el-input-group__append,
    .el-input-group__prepend {
      display: none;
    }
  }
  .hasUnit {
    input {
      padding-right: 30px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
      display: table-cell;
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
