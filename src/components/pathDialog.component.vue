<template>
  <div class="pathDialogBox">
    <el-dialog size="large" class="personDialog" :visible.sync="pathVisible" @close="close">
      <el-row class="boxWrap">
        <el-col :span='16' class="leftBox">
          <div class="leftHead clearfix">
            <span>选择审批方式</span>
            <el-radio-group v-model="type" class="myRadio" @change="typeChange">
              <el-radio-button label="0">审批<i></i></el-radio-button>
              <el-radio-button label="1" :disabled="pathList.length==0||isPermission==0">会签<i></i></el-radio-button>
            </el-radio-group>
          </div>
          <div class="selWrap clearfix">
            <div class="selArea">
              <p class="header">选择部门</p>
              <ul>
                <li v-for="dep in list.deptsVos" @click="addNode(dep,1)">{{dep.deptName}}</li>
              </ul>
            </div>
            <div class="selArea">
              <p class="header">选择公司领导</p>
              <ul>
                <li v-for="emp in list.empsVos" @click="addNode(emp,2)">{{emp.empName}}</li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span='8' class="rightBox">
          <div class="rightHead clearfix">
            <span>审批路径</span>
            <i class="el-icon-close" @click="close"></i>
          </div>
          <ul class="nodeWrap">
            <li v-for="(node,nodeIndex) in pathList" class="nodeBox">
              <i class="el-icon-close nodeClose" @click="deleteNode(node,nodeIndex)" v-if="node.type!=3"></i>
              <span class="nodeIndex">{{nodeIndex+1}}</span>
              <span v-if="!node.nodeName" :class="{'end':node.type==3}"><span v-if="node.type==3">#会签结束#</span>{{node.typeIdName}}</span>
              <template v-else>
                <span style="color:#0460AE">#会签#</span>
                <p v-for="(child,childIndex) in node.children" class="childPath">
                  <i class="el-icon-close childClose" @click="deleteChild(node,nodeIndex,childIndex)"></i> {{child.typeIdName}}
                </p>
              </template>
            </li>
          </ul>
          <el-button type="primary" class="submit" :disabled="pathList.length==0" @click="submit">提交</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {

  },
  data() {
    return {
      name: '',
      selPerson: '',
      multipleSelection: [],
      initialReady: false,
      searchButton: false,
      pathVisible: false,
      type: '0',
      list: {
        deptsVos: [],
        empsVos: []
      },
      pathList: [],
      isPermission: 1
    }
  },
  props: {
    paths: {
      type: Array,
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'visible': function(newVal) {
      this.pathVisible = newVal;
      this.type = '0';
      this.pathList=this.clone(this.paths);
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'searchLoading',
      'searchRes',
      'depPageNumber',
      'isAdmin'
    ])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.$http.post('/doc/suggestPath', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            this.list = res.data;
            this.isPermission = res.data.isPermission;
          }
        })
    },
    submit() {
      var last = this.pathList[this.pathList.length - 1];
      if (last.nodeName == 'sign') {
        if (last.children.length == 0) {
          this.$message.warning('会签列表不能为空')
        } else {
          this.pathList.push({
            typeId: 'secretary',
            typeIdName: '公文管理员',
            type: 3
          })
        }
      }
      this.$emit('updatePath', this.pathList);
    },
    close() {
      this.$emit('update:visible', false)
    },
    addNode(val, type) {
      if (type == 1) {
        var node = {
          typeId: val.deptId,
          typeIdName: val.deptName,
          type: type,
        }
      } else {
        var node = {
          typeId: val.empId,
          typeIdName: val.empName,
          type: type,
        }
      }
      if (this.type == '0') { //审批
        if (this.pathList.length == 0 ? true : this.pathList[this.pathList.length - 1].typeId != node.typeId) {
          this.pathList.push(node)
        }
      } else { //会签
        var children = this.pathList[this.pathList.length - 1].children;
        if (children.length == 0 ? true : (children[0].type == type && children.find(c => c.typeId == node.typeId) == undefined)) {
          children.push(node)
        }

      }
    },
    deleteNode(node, index) {
      this.pathList.splice(index, 1);
      if (this.pathList.length == 0) {
        this.type = '0';
      }
      if (node.nodeName == 'sign') {
        this.pathList.splice(index, 1);
        this.type = '0';
      }
      console.log(this.paths);
    },
    deleteChild(node, nodeIndex, childIndex) {
      node.children.splice(childIndex, 1);
      if (node.children.length == 0) {
        this.deleteNode(node, nodeIndex);
      }
    },
    typeChange(val) {
      if (val == 0) { //审批
        var last = this.pathList[this.pathList.length - 1];
        if (last.nodeName == 'sign') {
          if (last.children.length != 0) {
            this.pathList.push({
              typeId: 'secretary',
              typeIdName: '公文管理员',
              type: 3
            })
          } else {
            this.pathList.splice(this.pathList.length - 1, 1);
          }
        }
      } else {
        this.pathList.push({
          nodeName: 'sign',
          children: []
        })
      }
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
$sub:#1465C0;
.pathDialogBox {
  .el-icon-close {
    cursor: pointer;
  }
  .personDialog {
    .el-dialog {

      width: 800px;
      height: 600px;
    }
    .el-dialog__body {
      height: 100%;
    }
    .boxWrap {
      height: 100%;
      .leftBox,
      .rightBox {
        height: 100%;
      }
      .leftBox {
        position: relative;
        overflow: hidden;
        &:before {
          content: '';
          position: absolute;
          height: 100%;
          border-left: 1px solid #D5DADF;
          left: 50%;
          top: 55px;
        }
      }
      .rightBox {
        background: #EAECF7;
        position: relative;
        font-size: 16px;
        padding-bottom: 45px;
      }
      .leftHead {
        line-height: 55px;
        height: 55px;
        padding: 0 15px;
        border-bottom: 1px solid #D5DADF;
        .myRadio {
          float: right;
          line-height: inherit;
          .el-radio-button {
            margin-right: 0;
            margin-left: 15px;
            .el-radio-button__inner {
              padding: 0;
              width: 89px;
              height: 40px;
              line-height: 40px;
            }
          }
        }
      }
      .rightHead {
        font-size: 16px;
        padding: 0 10px;
        line-height: 35px;
        border-bottom: 1px solid #D5DADF;
        i {
          float: right;
          line-height: inherit;
        }
      }
      .selWrap {
        .selArea {
          width: 50%;
          float: left;
          .header {
            line-height: 40px;
            border-bottom: 1px dashed #D5DADF;
            padding-left: 20px;
          }
          ul {
            height: 500px;
            overflow: auto;
            padding: 10px 0;
            li {
              font-size: 15px;
              line-height: 35px;
              cursor: pointer;
              padding-left: 20px;

              &:hover {
                color: $main;
                background: #F7F7F7;
              }
            }
          }
        }
      }
      .nodeWrap {
        height: 500px;
        overflow: auto;
        .nodeBox {
          border-bottom: 1px solid #D5DADF;
          padding: 10px 8px;
          position: relative;
          color: #151515;
          .nodeClose {
            position: absolute;
            top: 16px;
            right: 10px;
            display: none;
            color: #ccc;
            cursor: pointer;
            font-size: 14px;
            &:hover {
              color: #393939;
            }
          }
          &:hover {
            .nodeClose {
              display: block;
            }
          }
          .nodeIndex {
            color: $sub;
            display: inline-block;
            width: 17px;
          }
          .childPath {
            line-height: 30px;
            color: $main;
            padding-left: 17px;
            position: relative;
            &:first-of-type {
              padding-top: 7px;
              .childClose {
                top: 16px;
              }
            }
            &:hover {
              .childClose {
                display: block;
              }
            }
            .childClose {
              position: absolute;
              top: 9px;
              right: 20px;
              display: none;
              color: #ccc;
              cursor: pointer;
              font-size: 12px;
              &:hover {
                color: #393939;
              }
            }
          }
          .end {
            color: $sub;
            span {
              padding-right: 5px;
            }
          }
        }
      }
      .submit {
        width: 267px;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
}

</style>
