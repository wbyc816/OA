<template>
  <div class="personDialogBox">
    <el-row>
      <el-col :span='6'>
        <organ-list></organ-list>
      </el-col>
      <el-col :span='18'>
        <div class="topSearch clearfix">
          <p class="tips">选择收件人<span v-show="dialogType=='radio'">请双击姓名选择</span></p>
          <el-input class="search" v-model="name">
            <el-button slot="append" @click="search">搜索</el-button>
          </el-input>
        </div>
        <el-table :data="searchRes.empVoList" class="myTable searchRes" v-loading.body="searchLoading" @row-dblclick="selectPerson" :height="430" @selection-change="handleSelectionChange" ref='multipleTable' v-show="dialogType=='multi'">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="110"></el-table-column>
          <el-table-column prop="depts" label="部门" width="250"></el-table-column>
          <el-table-column prop="jobtitle" label="职务"></el-table-column>
          <el-table-column prop="moblieNumber" label="状态" width="80"></el-table-column>
        </el-table>
        <el-table :data="searchRes.empVoList" class="myTable searchRes" v-loading.body="searchLoading" @row-dblclick="selectPerson" :height="430" @selection-change="handleSelectionChange" ref='multipleTable' v-show="dialogType!='multi'">
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
      multipleSelection: ''
    }
  },
  props: {
    dialogType: {
      type: String,
      default: 'radio'
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
    if (this.isAdmin) {
      this.$store.dispatch('getDeptList');
    } else {
      this.$store.dispatch('setQueryDepId', this.userInfo.deptParentId)
      this.$store.dispatch('getDepById');
    }
    this.$store.dispatch('setQueryPage', 1);
    this.$store.dispatch('queryEmpList', {});
  },
  methods: {
    submitRefdoc: function() {

    },
    handleCurrentChange(page) {
      if (this.searchRes.empVoList) {
        this.$store.dispatch('setQueryPage', page);
        this.$store.dispatch('queryEmpList', {})
      }

    },
    search() {
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
      }
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
          this.$store.commit('setReciver', reciver);
          this.$emit('updatePerson');
        } else {
          this.$message({
            message: '请先选择收件人！',
            type: 'warning'
          })
        }
      } else {
        if (this.multipleSelection.length != 0) {

          this.$emit('updatePerson', this.multipleSelection);
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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
      width: initial;
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
      line-height: 50px; // line-height
      padding-left: 15px;
      font-size: 15px;
      >span {
        color: $main;
      }
      .nameBox {
        margin-right: 10px;
      }
      button {
        float: right;
        height: 50px;
        width: 100px;
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
