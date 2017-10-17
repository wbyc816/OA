<template>
  <div class="personDialogBox">
    <el-dialog size="large" class="personDialog" :visible.sync="personVisible" @close="close">
      <el-row>
        <el-col :span='6'>
          <organ-list @reset="reset1"></organ-list>
        </el-col>
        <el-col :span='18'>
          <div class="topSearch clearfix">
            <p class="tips">选择收件人<span v-show="dialogType=='radio'">请单击姓名选择</span></p>
            <el-input class="search" v-model="name">
              <el-button slot="append" @click="search">搜索</el-button>
            </el-input>
          </div>
          <el-table :data="searchRes.empVoList" class="myTable searchRes" v-loading.body="searchLoading" @row-click="selectPerson" @selection-change="handleSelectionChange" :row-key="rowKey" :height="430" ref='multipleTable' v-show="dialogType=='multi'">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="110"></el-table-column>
            <el-table-column prop="depts" label="部门" width="250"></el-table-column>
            <el-table-column prop="jobtitle" label="职务"></el-table-column>
            <el-table-column prop="moblieNumber" label="状态" width="80"></el-table-column>
          </el-table>
          <el-table :data="searchRes.empVoList" class="myTable searchRes" v-loading.body="searchLoading" @row-click="selectPerson" :height="430" @selection-change="handleSelectionChange" v-show="dialogType!='multi'">
            <el-table-column prop="name" label="姓名" width="110"></el-table-column>
            <el-table-column prop="depts" label="部门" width="250"></el-table-column>
            <el-table-column prop="jobtitle" label="职务"></el-table-column>
            <el-table-column prop="moblieNumber" label="状态" width="80"></el-table-column>
          </el-table>
          <div class="pageBox" :style="{visibility:searchRes.empVoList ? 'visible' : 'hidden'}">
            <el-pagination @current-change="handleCurrentChange" :current-page="depPageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="searchRes.totalSize">
            </el-pagination>
          </div>
          <div class="selInfoBox">
            <p>{{ dialogType=='radio'?'已选中的收件人':' '}}</p>
            <div class="clearfix selInfo">
              <span v-if="selPerson&&dialogType=='radio'">{{selPerson.name}} - {{selPerson.depts}}</span>
              <span v-for="person in multipleSelection" class="nameBox">{{person.name}}</span>
              <el-button type="primary" size="large" @click="submitPerson">选中</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import OrganList from './organlist.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    OrganList
  },
  data() {
    return {
      name: '',
      selPerson: '',
      multipleSelection: [],
      initialReady: false,
      searchButton: false,
      personVisible: false
    }
  },
  props: {
    dialogType: {
      type: String,
      default: 'radio'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'visible': function(newVal) {
      this.personVisible = newVal;
      if (newVal) {
        if (this.isAdmin) {
          this.$store.dispatch('getDeptList');
        } else {
          this.$store.dispatch('setQueryDepId', this.userInfo.deptParentId)
          this.$store.dispatch('getDepById');
        }
        this.name="";
        this.$store.dispatch('setQueryPage', 1);
        this.$store.dispatch('queryEmpList', {});
      }
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

  },
  methods: {
    submitRefdoc: function() {

    },
    handleCurrentChange(page) {
      if (this.searchRes.empVoList) {
        this.$store.dispatch('setQueryPage', page);
        if (this.searchButton) {
          this.$store.dispatch('queryEmpList', { name: this.name })
        } else {
          this.$store.dispatch('queryEmpList', {})
        }
      }
    },
    search() {
      this.searchButton = true;
      // this.$store.dispatch('setQueryDepId', '')
      this.$store.dispatch('setQueryPage', 1);
      this.$store.dispatch('queryEmpList', { name: this.name })
    },
    selectPerson(row) {
      if (this.dialogType == 'radio') {
        if (row.empId != this.userInfo.empId) {
          this.selPerson = row;

        } else {
          this.$message({
            message: '请重新选择收件人！',
            type: 'warning'
          })
        }
      } else {
        this.$refs.multipleTable.toggleRowSelection(row);
      }
    },
    rowKey(row) {
      return row.empId
    },
    submitPerson() {
      if (this.dialogType == 'radio') {
        if (this.selPerson) {
          var reciver = {
            "reciDeptMajorName": this.selPerson.deptName,
            "reciDeptMajorId": this.selPerson.deptParentId,
            "reciDeptName": this.selPerson.depts,
            "reciDeptId": this.selPerson.deptId,
            "reciUserName": this.selPerson.name,
            "reciUserId": this.selPerson.empId,
          }
          this.$emit('updatePerson', reciver);
          this.$emit('update:visible', false)
          this.selPerson = '';
        } else {
          this.$message({
            message: '请先选择收件人！',
            type: 'warning'
          })
        }
      } else {
        if (this.multipleSelection.length != 0) {

          this.$emit('updatePerson', this.multipleSelection);
          this.$emit('update:visible', false)
        } else {
          this.$message({
            message: '请先选择收件人！',
            type: 'warning'
          })
        }
      }

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    reset1() {
      this.searchButton = false;
      this.name = '';
    },
    close() {
      this.$emit('update:visible', false)
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.personDialogBox {
  .topSearch {
    padding: 10px;
    line-height: 47px;
    .tips {
      float: left;
      font-size: 16px;
      span {
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .search {
      float: right;
      width: auto;
    }
  }
  .organlist .topMenu {
    height: 600px;
    padding-bottom: 100px;
  }
  .myTable {
    &:before {
      display: none;
    }
  }
  .pageBox {
    overflow: hidden;
    padding-right: 10px;
    padding-top: 5px;
    padding-bottom: 5px;
    border-bottom: 1px solid #D5DADF;
    .el-pagination {
      float: right;
    }
  }
  .selInfoBox {
    p {
      font-size: 16px;
      padding-left: 15px;
      line-height: 40px;
      height: 40px;
    }
    .selInfo {
      background-color: #E5E7EF;
      padding-left: 15px;
      font-size: 15px;
      position: relative;
      padding-right: 110px;
      min-height: 50px;
      padding-bottom: 10px;
      >span {
        color: $main;
        margin-right: 10px;
        display: inline-block;
        padding-top: 14px;
      }
      .nameBox {}
      button {
            height: 100%;
        width: 100px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
  }
  .el-table tr:hover {
    background-color: #ccc;
    cursor: pointer;
    >td {
      background-color: #ccc;
    }
  }
}

</style>
