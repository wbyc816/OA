<template>
  <div class="personDialogBox">
    <el-row>
      <el-col :span='6'>
        <organ-list></organ-list>
      </el-col>
      <el-col :span='18'>
        <div class="topSearch clearfix">
          <p class="tips">选择收件人<span>请双击姓名选择</span></p>
          <el-input class="search" v-model="name">
            <el-button slot="append" @click="search">搜索</el-button>
          </el-input>
        </div>
        <el-table :data="searchRes.empVoList" class="myTable searchRes" v-loading.body="searchLoading" @row-dblclick="selectPerson" :height="430">
          <el-table-column prop="name" label="姓名" width="110"></el-table-column>
          <el-table-column prop="depts" label="部门" width="450"></el-table-column>
          <el-table-column prop="jobtitle" label="职务" width="150"></el-table-column>
          <el-table-column prop="moblieNumber" label="手机"></el-table-column>
        </el-table>
        <div class="pageBox" :style="{visibility:searchRes.empVoList ? 'visible' : 'hidden'}">
          <el-pagination @current-change="handleCurrentChange" :current-page="depPageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="searchRes.totalSize">
          </el-pagination>
        </div>
        <div class="selInfoBox">
          <p>已选中的收件人</p>
          <div class="clearfix selInfo">
            <span v-if="selPerson">{{selPerson.name}} - {{selPerson.depts}}</span>
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
      selPerson: ''
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
    console.log(this.isAdmin)
    if (this.isAdmin) {
      this.$store.dispatch('getDeptList');
    } else {
      this.$store.dispatch('getDepById');
    }
    this.$store.dispatch('setQueryPage', 1);
    this.$store.dispatch('queryEmpList', {});
  },
  methods: {
    submitRefdoc: function() {

    },
    handleCurrentChange(page) {
      if (this.searchRes.data) {
        this.$store.dispatch('setQueryPage', page);
        this.$store.dispatch('queryEmpList', {})
      }
    },
    search() {
      this.$store.dispatch('setQueryPage', 1);
      this.$store.dispatch('queryEmpList', { name: this.name })

    },
    selectPerson(row) {
      console.log(row)
      if (row.empId != this.userInfo.empId) {
        this.selPerson = row;

      } else {
        this.$message({
          message: '请重新选择收件人！',
          type: 'warning'
        })
      }

    },
    submitPerson() {
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
    }
    .selInfo {
      background-color: #E5E7EF;
      line-height: 50px; // line-height
      padding-left: 15px;
      font-size: 15px;
      >span {
        color: $main;
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
