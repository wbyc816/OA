<template>
  <div class="taskContentInput">
    <el-input type="textarea" :value="value" @change="fomat" ref="input" resize="none" :rows="8" :maxlength="maxlength">
    </el-input>
    <div class="tempBox">
      <span class="bgBox"></span>
      <el-dropdown trigger="click" class="dropdownBox" :class="{'active':showBox}" @visible-change="dropdownvisibleChange" @command="handleItemClick" :hide-on-click="false" menu-align="start">
        <span class="el-dropdown-link" @click="showBox=!showBox">
          <!-- <i class="iconfont icon-moban"></i> -->
        常用语
      </span>
        <el-dropdown-menu class="contentItemBox" slot="dropdown">
          <div class="itemWrap">
            <el-dropdown-item v-for="item in contentListAll" :command="item">{{item.templateAlias}}</el-dropdown-item>
            <el-dropdown-item class="emptyText" command="empty" v-if="contentListAll.length==0" disabled>未添加常用语</el-dropdown-item>
          </div>
          <el-dropdown-item class="editButton" divided command="edit"><i class="el-icon-setting"></i>设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: '',
    maxlength: { //最大长度，默认10
      type: Number,
      default: 500,
    },

  },
  data() {
    return {
      showBox: false,
      contentListAll: [],
      pageNumber: 1,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'showUsefulSetDialog'
    ])
  },
  created() {
    this.getContentAll();
  },
  watch:{
    'showUsefulSetDialog':function(newVal){
      if(!newVal){
        this.getContentAll();
      }
    }
  },
  methods: {
    fomat(val) {
      this.$emit('input', val);
      this.$emit('change', val);
      this.$refs.input.setCurrentValue(val)
    },
    dropdownvisibleChange(val) {
      if (!val) {
        this.showBox = val;
      }
    },
    handleItemClick(val) {
      if (val === 'edit') {
        this.$store.commit('setUsefulSetDialog',true);
      } else {
        if (this.value.length < 500 && val.taskContent) {
          var temp = (this.value + (this.value.length == 0 ? '' : '\n') + val.taskContent).substr(0, 500);
          this.fomat(temp);
        }
      }
    },
    getContentAll() {
      this.pageNumber = 1;
      this.$http.post('/doc/getTaskTemplte', { empId: this.userInfo.empId, pageNumber: 1, pageSize: 9999 })
        .then(res => {
          if (res.status == 0 && res.data) {
            this.contentListAll = res.data.records;
          } else {
            this.$message.error(res.message);
          }
        })
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.taskContentInput {
  position: relative;
  .el-textarea {
    border: 1px solid rgb(191, 202, 217);
    padding-top: 24px;
    .el-textarea__inner {
      border: none;
      padding-top: 3px;
    }
  }

  .tempBox {
    position: absolute;
    right: 0;
    top: 0;
    height: 25px;
    color: $sub;
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
    }
    .bgBox {
      display: inline-block;
      border-left: 25px solid transparent;
      border-top: 25px solid $sub;
    }
    .dropdownBox {
      position: absolute;
      right: 0;
      top: 0;
      width: 65px;
      height: 28px;
      opacity: 1;
      transition: all .3s;
      background: $sub; // padding-left: 10px;
      line-height: 28px;
      color: #fff;
      border-bottom-left-radius: 15px; // opacity: 0;
      &:hover,
      &.active {
        width: 65px;
        height: 28px;
        opacity: 1;
      }
      .el-dropdown-link {
        display: inline-block;
        width: 100%;
        padding-left: 10px;
        i {
          margin-right: 3px;
          font-size: 12px;
        }
      }
    }
  }
  .contentTableDialog {
    .el-dialog {
      width: 900px;
      .el-dialog__header {
        line-height: 1;
      }
      .el-dialog__body {
        padding: 0;
        .myTable {
          min-height: 25px;
          .contentColum {
            .cell {

              overflow: hidden;
              white-space: nowrap;
            }
          }
        }
        .buttonBox {
          padding: 10px 20px;
          text-align: right;
          button {
            border-radius: 3px;
            font-size: 14px;
          }
        }
        .pageBox {
          text-align: right;
          padding: 10px 0;
        }
      }
    }
  }
  .contentEditDialog {
    .el-dialog {
      width: 700px;
      .el-dialog__header {
        line-height: 1;
      }
      .el-dialog__body {
        .el-form-item {
          margin-bottom: 20px;
        }
      }
    }
  }
}

.contentItemBox {
  .itemWrap {
    max-height: 210px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-dropdown-menu__item {
    line-height: 25px;
    &.editButton {
      text-align: center;
      color: $main;
      line-height: 18px;
      i {
        margin-right: 5px;
      }
    }
    &.emptyText {
      text-align: center;
      line-height: 38px; // color: rgb(94, 113, 130);
    }
  }
}

</style>
