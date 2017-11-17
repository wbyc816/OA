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
            <div class="selArea">
              <p class="header">选择角色</p>
              <ul>
                <li v-for="role in roleList" @click="addNode(role,3)">{{role.dictName}}</li>
              </ul>
            </div>
          </div>
        </el-col>
        <el-col :span='8' class="rightBox">
          <div class="rightHead clearfix">
            <span>审批路径</span>
            <i class="el-icon-close" @click="close"></i>
          </div>
          <ul class="nodeWrap" ref="nodeWrap">
            <li v-for="(node,nodeIndex) in pathList" class="nodeBox" :class="{'isEdit':nodeIndex===activeNode,'isSign':node.type==4||node.type==5||node.type==7}">
              <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
                <i class="el-icon-close nodeClose" @click="deleteNode(node,nodeIndex)"></i>
              </el-tooltip>
              <el-tooltip :enterable="false" effect="dark" :content="nodeIndex!==activeNode?'编辑':'完成'" placement="top">
                <i class="nodeEdit" :class="{'el-icon-check':nodeIndex===activeNode,'el-icon-edit':nodeIndex!==activeNode }" @click="editNode(node,nodeIndex)"></i>
              </el-tooltip>
              <span class="nodeIndex">{{nodeIndex+1}}</span>
              <span>{{node.typeIdName}}</span>
              <template v-if="node.children&&node.children.length!=0">
                <p v-for="(child,childIndex) in node.children" class="childPath" :class="{'isEdit':nodeIndex===activeNode&&childIndex===activeNodeChild}">
                  <el-tooltip :enterable="false" effect="dark" content="删除" placement="top">
                    <i class="el-icon-close childClose" @click="deleteChild(node,nodeIndex,childIndex)"></i>
                  </el-tooltip>
                  <el-tooltip :enterable="false" effect="dark" :content="nodeIndex!==activeNode||childIndex!==activeNodeChild?'编辑':'完成'" placement="top">
                    <i class="childEdit" :class="{'el-icon-check':nodeIndex===activeNode&&childIndex===activeNodeChild,'el-icon-edit':nodeIndex!==activeNode||childIndex!==activeNodeChild }" @click="editChild(node,nodeIndex,childIndex)"></i>
                  </el-tooltip>
                  {{child.typeIdName}}
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
      roleList: [],
      pathList: [],
      isPermission: 1,
      activeNode: '',
      activeNodeChild: ''
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
      this.pathList = this.clone(this.paths);
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
    this.getRoleList();
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
      // var last = this.pathList[this.pathList.length - 1];
      // if (last.nodeName == 'sign') {
      //   if (last.children.length == 0) {
      //     this.$message.warning('会签列表不能为空')
      //   } else {

      //   }
      // }
      var success = true;
      for (var i = 0; i < this.pathList.length; i++) {
        var p = this.pathList[i];
        if (p.type == 4 || p.type == 5||p.type==7) { //判断会签不能为空
          if (i == 0) {
            this.$message.warning('建议路径不能以会签开始！');
            success = false;
            break;
          } else if (!p.children || p.children.length == 0) {
            this.editNode(p, i);
            this.$message.warning('会签列表不能为空！');
            success = false;
            break;
          }else if(i==this.pathList.length-1){
            this.$message.warning('建议路径不能以会签结束！');
            success = false
          }
        } else {
          if (p.state && p.state == 1) {
            this.editNode(p, i);
            this.$message.warning(p.typeIdName + '需替换！');
            success = false;
            break;
          }
        }
      }
      if (success) {
        this.$emit('updatePath', this.pathList);
      }
    },
    close() {
      this.$emit('update:visible', false)
    },
    addNode(val, type) {
      var node = { type: type };
      if (type == 1) {
        node.typeId = val.deptId;
        node.typeIdName = val.deptName;
      } else if (type == 2) {
        node.typeId = val.empId;
        node.typeIdName = val.empName;
      } else if (type == 3) {
        node.typeId = val.dictCode;
        node.typeIdName = val.dictName;
      }
      if (this.activeNode !== '') { //编辑
        var activeNode = this.pathList[this.activeNode];
        if (this.activeNodeChild === '') { //普通编辑
          if (activeNode.type == 4) { //会签添加
            if (type == 1) {
              activeNode.children.push(node);
            }
          } else if (activeNode.type == 5||activeNode.type == 7) { //会签添加
            if (type == 2||type == 3) {
              activeNode.children.push(node);
            }
          } else if (activeNode.nodeName == 'sign') {
            activeNode.typeIdName = type == 1 ? '#部门会签#' : '#人员会签#';
            activeNode.type = type == 1 ? 4 : 5;
            activeNode.children.push(node);
          } else { //普通替换
            this.pathList.splice(this.activeNode, 1, node);
          }
        } else { //会签编辑
          if (activeNode.type == 4) {
            if (type == 1) {
              activeNode.children.splice(this.activeNodeChild, 1, node);
              activeNode.state = 0;
            }
          } else if (activeNode.type == 5||activeNode.type == 7) {
            if (type == 2||type==3) {
              activeNode.children.splice(this.activeNodeChild, 1, node);
              activeNode.state = 0;
            }
          }
        }
      } else { //添加
        if (this.type == '0') { //审批添加
          if (this.pathList.length == 0 ? true : this.pathList[this.pathList.length - 1].typeId != node.typeId) {
            this.pathList.push(node);
          }
        } else { //会签列表添加
            var last = this.pathList[this.pathList.length - 1]
            var children = last.children;
            if (!last.type) {
              last.typeIdName = type == 1 ? '#部门会签#' : '#人员会签#';
              last.type = type == 1 ? 4 : 5;
              children.push(node);
            } else if (last.type == 4 && type == 1) {
              children.push(node);
            } else if (last.type == 5 && (type == 2||type == 3)) {
              children.push(node);
            }
        }
        this.$nextTick(function() {
          this.$refs.nodeWrap.scrollTop = this.$refs.nodeWrap.scrollHeight;
        })
      }

    },
    editNode(node, index) {
      this.activeNodeChild = '';
      if (this.activeNode === index) {
        this.activeNode = ''
      } else {
        this.activeNode = index;
      }
    },
    editChild(node, nodeIndex, childIndex) {
      if (this.activeNode === nodeIndex && this.activeNodeChild === childIndex) {
        this.activeNode = '';
        this.activeNodeChild = ''
      } else {
        this.activeNode = nodeIndex;
        this.activeNodeChild = childIndex;
      }
    },
    deleteNode(node, index) {
      this.pathList.splice(index, 1);
      if (this.pathList.length == 0) {
        this.type = '0';
      }
      this.activeNode = '';
      this.activeNodeChild = '';
    },
    deleteChild(node, nodeIndex, childIndex) {
      node.children.splice(childIndex, 1);
      this.activeNode = '';
      this.activeNodeChild = '';
    },
    typeChange(val) {
      if (val == 0) { //审批
        // var last = this.pathList[this.pathList.length - 1];
        // if (last.nodeName == 'sign') {
        //   if (last.children.length != 0) {
        //     this.pathList.push({
        //       typeId: 'secretary',
        //       typeIdName: '发起会签人',
        //       type: 3
        //     })
        //   } else {
        //     this.pathList.splice(this.pathList.length - 1, 1);
        //   }
        // }
      } else {
        this.pathList.push({
          nodeName: 'sign',
          typeIdName: '#会签#',
          children: []
        })
      }
      this.activeNode = '';
      this.activeNodeChild = '';
    },
    getRoleList() {
      if (this.roleList.length == 0) {
        this.$http.post('/api/getDict', { dictCode: 'DOC13' })
          .then(res => {
            if (res.status == 0) {
              this.roleList = res.data;
            } else {

            }
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

      width: 1000px;
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
          left: 33.33%;
          top: 55px;
        }
        &:after {
          content: '';
          position: absolute;
          height: 100%;
          border-left: 1px solid #D5DADF;
          left: 66.66%;
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
          width: 33.33%;
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
          &.isEdit {
            background: #FF9300;
            color: #fff;
            .nodeClose,
            .nodeEdit {
              display: block;
              color: #fff;
            }
            .nodeIndex {
              color: #fff;
            }
            &.isSign {
              background: #D8EAFF;
              color: $main;
              >span {
                color: $main;
              }
              >i {
                color: #ccc;
                &:hover {
                  color: $main;
                }
              }
            }
          }
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
          .nodeEdit {
            position: absolute;
            top: 16px;
            right: 35px;
            display: none;
            color: #ccc;
            cursor: pointer;
            font-size: 14px;
            &:hover {
              color: #393939;
            }
          }
          &:hover {
            .nodeClose,
            .nodeEdit {
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
              margin-top: 5px;
              .childClose,
              .childEdit {
                top: 9px;
              }
            }
            &:hover {
              .childClose,
              .childEdit {
                display: block;
              }
            }
            &.isEdit {
              background: #FF9300;
              color: #fff;
              i {
                color: #fff;
              }
              .childClose,
              .childEdit {
                display: block;
              }
            }
            .childClose {
              position: absolute;
              top: 9px;
              right: 10px;
              display: none;
              color: #ccc;
              cursor: pointer;
              font-size: 12px;
              &:hover {
                color: #393939;
              }
            }
            .childEdit {
              position: absolute;
              top: 9px;
              right: 30px;
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
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
}

</style>
