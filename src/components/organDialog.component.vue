<template>
  <div class="organDialogBox">
    <el-dialog :visible.sync="dialogVisible" title="选择人员" size="large" class="organDialog">
      <div class="transferBox clearfix">
        <div class="transferPanel leftPanel">
          <p class="panelHeader">待选列表</p>
          <div class="panelBody">
            <el-tree :data="data2" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
            </el-tree>
          </div>
          <p class="panelFooter">
          </p>
        </div>
        <div class="transferButton">
          <el-button type="primary" size="small" icon="arrow-right"></el-button>
          <el-button type="primary" size="small" icon="arrow-left"></el-button>
        </div>
        <div class="transferPanel rightPanel">
          <p class="panelHeader">已选列表</p>
          <div class="panelBody">
          </div>
          <p class="panelFooter">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkRightAll">全选</el-checkbox>
          </p>
        </div>
      </div>
      <div class="sumitBox">
        <el-button type="primary">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      checkLeftAll: false,
      checkRightAll: false,
      isIndeterminate: false,
      data2: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    'visible': function(newVal) {
      this.dialogVisible = this.visible;
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'depPageNumber',
      'isAdmin',
      'queryDepId',
      'DHId'
    ])
  },
  created() {},
  methods: {

  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.organDialogBox {
  .organDialog {
    .el-dialog {
      width: 800px;
      .transferBox {
        .transferPanel {
          border: 1px solid #d1dbe5;
          background: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
          display: inline-block;
          vertical-align: middle;
          width: 250px;
          box-sizing: border-box;
          position: relative;
          &.leftPanel {
            width: 400px;
            .el-tree{
              border:none;
            }
          }
          &.rightPanel {
            float: right;
          }
          .panelHeader {
            height: 36px;
            line-height: 36px;
            background: #fbfdff;
            margin: 0;
            padding-left: 20px;
            border-bottom: 1px solid #d1dbe5;
            box-sizing: border-box;
            color: #1f2d3d;
          }
          .panelBody {
            padding-bottom: 36px;
            height: 336px;
            overflow-y: auto;
          }
          .panelFooter {
            height: 36px;
            background: #fff;
            margin: 0;
            padding: 0;
            border-top: 1px solid #d1dbe5;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            z-index: 1;
            line-height: 36px;
            .el-checkbox {
              padding-left: 20px;
              color: #8391a5;
            }
          }
        }
        .transferButton {
          display: inline-block;
          vertical-align: middle;
          padding: 0 31px;
          .el-button {
            display: block;
            margin: 0 auto;
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 4px;
            &:first-child {
              margin-bottom: 6px;
            }
          }
        }
      }
      .sumitBox {
        text-align: center;
        padding-top: 20px;
        .el-button {
          width: 150px;
          border-radius: 5px;
        }
      }
    }
  }
}

</style>
