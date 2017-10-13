<template>
  <div id="dutyEdit">
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="4">
            查询值班信息
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="10">
        <el-col :span="11">
          <el-date-picker v-model="date" type="daterange" placeholder="起始及截止日期栏">
          </el-date-picker>
        </el-col>
        <el-col :span="5">
          <dept-list @deptChange="deptChange"></dept-list>
        </el-col>
        <el-col :span="8">
          <el-row :gutter="0">
            <el-col :span="16">
              <el-input v-model="dutyPerson" placeholder="值班人"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button class="search" @click="console.log(1)" type="primary">搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="3" class="titleLeft">
            <span>编辑值班信息</span>
          </el-col>
          <el-col class="titleRight" :offset="17" :span="4">
            <el-button type="primary">提交并发布</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column property="dutyDate" sortable label="日期" width="120">
        </el-table-column>
        <el-table-column property="deptName" label="部门" width="120">
        </el-table-column>
        <el-table-column property="empName" label="值班人">
        </el-table-column>
        <el-table-column property="mobileNumber" label="手机">
        </el-table-column>
        <el-table-column property="phoneNumber" label="电话">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import deptList from '../../components/deptList.component'

export default {
  data() {
    return {
      date: '',
      department: '',
      dutyPerson: '',
      deptList: [],
      tableData: [],
      currentRow: null,
      paginate: {
        pageSizes: [5, 10, 12, 36],
        currentSize: 5,
        currentPage: 1,
        layout: "total, sizes, prev, pager, next, jumper",
        total: 4
      },
      deptName: '',
      empName: ''
    }
  },
  methods: {
    handleSizeChange() {

    },
    handleCurrentChange() {

    },
    deptChange(val) {
      this.deptName = val
      console.log(this.deptName)
    },
    search() {
      console.log(1)
    }
  },
  components: {
    deptList
  }
}
</script>

<style scope lang="scss">
#dutyEdit {
  .el-card {
    padding: 0 20px;
    .el-card__header {
      padding-left: 0;
      padding-right: 0;
      .titleLeft {
        font-size: 15px;
        padding-top: 10px;
      }
      .titleRight {
        // padding: 0;
        font-size: 13px;
        color: #0460AE;
        .el-button {
          border-radius: 2px;
        }
      }
    }
    .el-card__body {
      padding: 20px 0;
    }
    .search {
      height: 46px;
      margin-left: -3px;
    }
    .showBox {
      .boxTitle {
        background: #0460AE;
        color: #fff;
        padding: 10px 0;
        font-size: 16px;
        font-weight: 300;
        .el-col:last-child {
          text-align: right;
        }
      }
    }
    .alignCenter {
      text-align: center!important;
    }
  }
  .paginateWrap {
    margin: 20px auto 50px
  }
  .el-table {
    font-size: 5px !important;
  }
  #etable {
    .el-table-column {
      font-size: 8px !important;
    }
  }
}
</style>

