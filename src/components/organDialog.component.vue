<template>
  <div class="organDialogBox">
    <el-dialog :visible.sync="dialogVisible" title="选择人员" size="large" class="organDialog" @close="close">
      <div class="transferBox clearfix">
        <div class="transferPanel leftPanel">
          <p class="panelHeader">待选列表</p>
          <div class="panelBody">
            <el-tree :data="organList" show-checkbox lazy :load="loadNode" :default-expanded-keys="expandKeys" node-key="id" :props="defaultProps" @check-change="checkChange" ref="tree">
            </el-tree>
          </div>
          <p class="panelFooter">
          </p>
        </div>
        <div class="transferButton">
          <el-button type="primary" size="small" icon="arrow-right" @click="addPerson" :disabled="leftTempList.length===0"></el-button>
          <el-button type="primary" size="small" icon="arrow-left" @click="removePerson" :disabled="rightList.length===0"></el-button>
        </div>
        <div class="transferPanel rightPanel">
          <p class="panelHeader">已选列表</p>
          <div class="panelBody">
            <el-checkbox-group v-model="rightList" @change="rightChange">
              <el-checkbox v-for="person in selList" :label="person.id" :key="person.id">{{person.name}}</el-checkbox>
            </el-checkbox-group>
            <!-- <el-tree :data="selList" show-checkbox :props="defaultProps">
            </el-tree> -->
          </div>
          <p class="panelFooter">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkRightAll" @change="HandleCheckRightAll" :disabled="selList.length===0">
              {{(rightList.length===0?'共 ':'已选 '+rightList.length+'/')+selList.length+'人'}}
            </el-checkbox>
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
import _ from 'lodash'
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      checkLeftAll: false,
      checkRightAll: false,
      isIndeterminate: false,
      defaultProps: {
        children: 'childNode',
        label: 'name'
      },
      organList: [],
      expandKeys: [],
      leftList: [],
      leftTempList: [],
      selList: [],
      rightList: []
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
  created() {
    this.expandKeys.push(this.DHId);
    this.getOrgan();
  },
  methods: {
    getOrgan() {
      var leveNum = 0;

      function loopMap(arr, targetArr) {
        leveNum++;
        arr.forEach((dep) => {
          var temp = {
            id: dep.id,
            name: dep.name,
            type: 'dep',
            childNode: [],
            disabled: false,
            leveNum: leveNum
          }
          targetArr.push(temp)
          if (dep.childNode.length !== 0) {
            loopMap(dep.childNode, targetArr[targetArr.indexOf(temp)].childNode)
          }
        })
      }
      this.$http.post('/dept/selectDeptOrg')
        .then(res => {
          if (res.status == 0) {
            loopMap(res.data.deptList, this.organList);
          } else {

          }
        })
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        resolve(node.data);
      } else if (node.level === 1) {
        resolve(node.data.childNode);
      } else if (node.data.type === 'dep') {
        this.$http.post('/dept/selectDeptEmp', { deptId: node.data.id })
          .then(res => {
            if (res.status == 0) {
              if (res.data) {
                var tempArr = res.data.map(function(person) {
                  person.type='person';
                  person.disabled=false;
                  return person
                })
                var keys = tempArr.map(function(person) {
                  return person.id
                })
                console.log(tempArr)
                this.expandKeys = keys;
                setTimeout(() => {
                  resolve(tempArr.concat(node.data.childNode));
                }, 200)
              } else {
                resolve([])
              }
            } else {

            }
          })
      } else if (node.data.type === 'person') {
        resolve([])
      }
    },
    checkChange: _.debounce(function(data) {
      this.leftList = this.$refs.tree.getCheckedNodes(true).filter(person => person.type === 'person');
      this.leftTempList = this.leftList.filter(person => !person.disabled);
    }, 300),
    // checkChange(data) {
    //   console.log(data);
    // },
    addPerson() {
      this.selList = this.selList.concat(this.leftTempList);
      this.selList.forEach(person => person.disabled = true);
      this.leftTempList = [];
    },
    removePerson() {
      var leftIndexList = [];
      this.rightList.forEach(id => {
        for (var i = 0; i < this.selList.length; i++) {
          if (id === this.selList[i].id) {
            leftIndexList.push(i);
            break;
          }
        }
        for (var i = 0; i < this.leftList.length; i++) {
          if (this.leftList[i].id === id) {
            this.leftList[i].disabled = false;
            this.$refs.tree.setChecked(id, false);
            break;
          }
        }
      })
      leftIndexList.sort((a, b) => b - a);
      leftIndexList.forEach(index => {
        this.selList.splice(index, 1);
      })
      this.checkChange();
      this.rightList = [];
      this.checkRightAll = false;
      this.isIndeterminate = false;
    },
    close() {
      this.$emit('update:visible', false)
    },
    HandleCheckRightAll(event) {
      this.rightList = event.target.checked ? this.selList.map(s => s.id) : [];
      console.log(this.rightList);
      this.isIndeterminate = false;
    },
    rightChange(value) {
      let checkedCount = value.length;
      this.checkRightAll = checkedCount === this.selList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.selList.length;
    }
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
            .el-tree {
              border: none;
            }
          }
          &.rightPanel {
            float: right;
            .el-checkbox-group {
              .el-checkbox {
                display: block;
                line-height: 36px;
                height: 36px;
                cursor: pointer;
                margin: 0;
                padding-left: 25px;
                &:hover {
                  background: rgb(228, 231, 241);
                }
              }
            }
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
