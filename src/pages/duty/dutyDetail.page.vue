<template>
  <div id="dutyDetail">
    <el-card>
      <div slot="header">
        <el-row>
          <el-col :span="4">
            今日值班
          </el-col>
          <el-col class="titleRight" :offset="16" :span="4">
            <i class="el-icon-date"></i>
            <a href="#/duty/dutyUpload" class="dutyUpload">新增值班信息</a>
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
          <!-- <el-row :gutter="0">
              <el-col :span="16">
                <el-input v-model="empName" placeholder="值班人"></el-input>
              </el-col>
              <el-col :span="8">
                <el-button class="search" @click="search" type="primary">搜索</el-button>
              </el-col>
            </el-row> -->
          <el-button class="search" @click="search" type="primary">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div slot="header">
        <el-row class="title">
          <!-- <el-col class="titleRight" :offset="20" :span="4">
              <i class="el-icon-edit"></i>
              <a style="color: #0460AE" href="#/duty/dutyEdit">值班信息维护</a>
            </el-col> -->
        </el-row>
      </div>
      <el-table :data="tableData" stripe highlight-current-row style="width: 100%">
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
    <div class="paginateWrap" v-if="tableData.length">
      <el-pagination @current-change="handleCurrentChange" :current-page.sync="paginate.currentPage" :page-sizes="paginate.pageSizes" :layout="paginate.layout" :total="paginate.total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import util from '../../common/util'
import api from '../../fetch/api'
import dataTransform from '../../common/dataTransform'
import { fmts } from '../../common/dutyConfig'
import deptList from '../../components/deptList.component'

export default {
  data() {
    return {
      date: '',
      deptList: [],
      tableData: [],
      currentRow: null,
      paginate: {
        pageSizes: [10, 12, 36],
        currentSize: 10,
        currentPage: 1,
        layout: "total,prev, pager, next, jumper",
        total: 0,
      },
      deptName: '',
      empName: ''
    }
  },
  computed: {
    startDate() {
      return this.date.length ? util.formatTime(this.date[0], 'yyyyMMdd') : ''
    },
    endDate() {
      return this.date.length ? util.formatTime(this.date[1], 'yyyyMMdd') : ''
    }
  },
  created() {
    const now = util.formatTime(new Date(), 'yyyyMMdd')
    api.getDeptList().then(data => {
      if (data.status == '0') {
        this.deptList = data.data.deptList[0].childNode
      }
    });
    api.getDutyMessage({
      startDate: now,
      endDate: now,
      deptName: '',
      empName: '',
      pageNumber: 1,
      pageSize: 10
    }).then(data => {
      if (data.status == '0' && data.data.totalSize) {
        this.tableData = dataTransform(data.data.ondutyVolist, fmts)
        this.paginate.total = data.data.totalSize
      }
    })
  },
  methods: {
    handleCurrentChange() {
      this.search()
    },
    deptChange(val) {
      this.deptName = val
    },
    search() {
      this.tableData = []
      api.getDutyMessage({
        startDate: this.startDate,
        endDate: this.endDate,
        deptName: this.deptName,
        empName: this.empName,
        pageNumber: this.paginate.currentPage,
        pageSize: 10
      }).then((data) => {
        if (data.status == '0' && data.data.totalSize) {
          this.tableData = dataTransform(data.data.ondutyVolist, fmts)
          this.paginate.total = data.data.totalSize
        }
      })
    }
  },
  components: {
    deptList
  }
}
</script>

<style scope lang="scss">
#dutyDetail {
  .el-card {
    padding: 0 20px;
    .el-card__header {
      padding-left: 0;
      padding-right: 0;
      .titleRight {
        font-size: 14px;
        color: #0460AE;
        .el-icon-date {
          margin-right: 5px;
        }
        .dutyUpload {
          cursor: pointer;
          color: #0460AE
        }
      }
    }
    .el-card__body {
      padding: 20px 0;
      .search {
        height: 46px;
        margin-left: -3px;
      }
      .el-table .cell {
        font-size: 13px;
      }
    }
    .alignCenter {
      text-align: center!important;
    }
  }
  .title {
    height: 22px;
  }
  .paginateWrap {
    margin: 20px auto 50px
  }
  .search{             // 临时search
    transform: translateX(-7px)
  }
}
</style>
