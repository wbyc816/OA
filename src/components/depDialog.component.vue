<template>
  <div class="depDialogBox">
    <el-dialog :visible.sync="depVisible" size="large" class="personDialog" @close="close">
      <el-row>
        <el-col :span='6'>
          <organ-list @reset="reset1" organType="dep" @depChange="depChange"></organ-list>
        </el-col>
        <el-col :span='18'>
          <div class="topSearch clearfix">
            <p class="tips">选择部门<span v-show="dialogType=='radio'">请单击部门选择</span></p>
            <el-input class="search" v-model.trim="params.name">
              <el-button slot="append" @click="search" :maxlength="20">搜索</el-button>
            </el-input>
          </div>
          <el-table :data="searchRes.records" class="myTable searchRes" v-loading.body="searchLoading" @row-click="selectPerson" @selection-change="handleSelectionChange" :row-key="rowKey" :height="430" ref='multipleTable' v-show="dialogType=='multi'">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="name" label="部门"></el-table-column>
            <el-table-column prop="companyName" label="所属公司"></el-table-column>
          </el-table>
          <el-table :data="searchRes.records" class="myTable searchRes" v-loading.body="searchLoading" @row-click="selectPerson" :height="430" @selection-change="handleSelectionChange" v-show="dialogType!='multi'">
            <el-table-column prop="name" label="部门"></el-table-column>
            <el-table-column prop="companyName" label="所属公司"></el-table-column>
          </el-table>
          <div class="pageBox" :style="{visibility:searchRes.records ? 'visible' : 'hidden'}">
            <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="searchRes.total">
            </el-pagination>
          </div>
          <div class="selInfoBox">
            <p>{{ dialogType=='radio'?'已选中的部门':' '}}</p>
            <div class="clearfix selInfo">
              <span v-if="selDep&&dialogType=='radio'">{{selDep.name}}</span>
              <span v-for="dep in multipleSelection" class="nameBox">{{dep.name}}</span>
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
      selDep: '',
      multipleSelection: [],
      initialReady: false,
      searchButton: false,
      searchLoading: false,
      params: {
        deptId: '',
        name: '',
        pageNumber: 1,
        pageSize: 10
      },
      searchRes: '',
      initData: true,
      depVisible: false
    }
  },
  props: {
    dialogType: {
      type: String,
      default: 'radio'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: [Array, Object, String]
    }
  },
  watch: {
    'dialogVisible': function(newVal) {
      this.depVisible = this.dialogVisible
      if (newVal) {
        this.initData = true;
        this.$store.dispatch('getDeptList');
        this.params.pageNumber = 1;
        this.params.deptId = this.DHId;
        this.getData();
      }
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
    this.$store.dispatch('getDeptList');
  },
  methods: {
    handleCurrentChange(page) {
      if (this.searchRes.records) {
        this.params.pageNumber = page;
        if (this.searchButton) {
          this.getData();
        } else {
          this.params.name = "";
          this.getData();
        }
      }
    },
    search() {
      this.searchButton = true;
      this.params.pageNumber = 1;
      this.getData();
    },
    selectPerson(row) {
      if (this.dialogType == 'radio') {
        if (row.empId != this.userInfo.empId) {
          this.selDep = row;

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
      return row.id
    },
    submitPerson() {
      if (this.dialogType == 'radio') {
        if (this.selDep) {
          this.$emit('updateDep', this.selDep);
          this.$emit('update:dialogVisible', false)
          this.selDep = '';
        } else {
          this.$message({
            message: '请先选择部门！',
            type: 'warning'
          })
        }
      } else {
        if (this.multipleSelection.length != 0) {

          this.$emit('updateDep', this.multipleSelection);
        } else {
          this.$message({
            message: '请先选择部门！',
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
      this.params.name = '';
    },
    getData() {
      this.$http.post('/dept/selectDeptOrgByName', this.params)
        .then(res => {
          if (res.status == 0) {
            this.searchRes = res.data
            if (this.$refs.multipleTable) {
              if (this.dialogType == 'multi' && this.initData) {
                this.initData = false;
                this.$refs.multipleTable.store.states.selection = this.clone(this.data);
                this.multipleSelection = this.clone(this.data);
              }
            }
          }
        }, res => {

        })
    },
    close() {
      this.$emit('update:dialogVisible', false)
    },
    depChange(id) {
      this.params.deptId = id;
      this.params.pageNumber = 1;
      this.getData();
    }
  }
}

</script>
<style lang='scss'>
$main:#0460AE;
.depDialogBox {
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
