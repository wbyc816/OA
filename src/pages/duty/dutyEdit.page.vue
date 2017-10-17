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
              <el-input v-model="empName" placeholder="值班人"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button class="search" @click="search" type="primary">搜索</el-button>
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
      <el-table :data="tableData" stripe highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column property="dutyDate" sortable label="日期" width="120">
        </el-table-column>
        <el-table-column property="deptName" label="部门" width="110">
        </el-table-column>
        <el-table-column property="empName" label="值班人" width="80">
        </el-table-column>
        <el-table-column property="mobileNumber" label="手机">
        </el-table-column>
        <el-table-column property="phoneNumber" label="电话">
        </el-table-column>
        <el-table-column fixed="right" width="150">
          <template scope="scope">
            <el-button @click="triggerDelete(scope.row)" type="text" size="small">删除</el-button>
            <el-button @click="triggerEdit(scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginateWrap" v-if="tableData.length">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="paginate.currentPage" :page-sizes="paginate.pageSizes" :layout="paginate.layout" :total="paginate.total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="" :visible.sync="dialogVisible1" size="tiny" :before-close="deleteConfirm">
      <span>删除值班信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible1 = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑值班信息" :visible.sync="dialogVisible2" size="tiny" :before-close="editConfirm">
      <el-form :model="currentRecord">
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker v-model="date" type="daterange" placeholder="起始及截止日期栏">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <dept-list @deptChange="deptChange"></dept-list>
        </el-form-item>
        <el-form-item label="值班人"  :label-width="formLabelWidth">
          <el-input v-model="currentRecord.empName"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="currentRecord.mobileNumber"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
           <el-input v-model="currentRecord.phoneNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
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
      empName: '',
      dialogVisible1: false,
      dialogVisible2: false,
      currentIndex: '',
      currentRecord: {
        dutyDate: '',
        empName: '',
        deptName: '',
        mobileNumber: '',
        phoneNumber: '',
      },
      formLabelWidth: '100px'
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
    handleSizeChange() {

    },
    handleCurrentChange() {

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
        console.log(data)
        if (data.status == '0' && data.data.totalSize) {
          this.tableData = dataTransform(data.data.ondutyVolist, fmts)
          this.paginate.total = data.data.totalSize
        }
      })
    },
    triggerDelete(val) {
      this.dialogVisible1 = true
      this.currentIndex = val
    },
    triggerEdit(val) {
      this.dialogVisible2 = true
      this.currentRecord = val
      console.log(val)
      console.log(this.currentRecord)
    },
    deleteConfirm(id) {
      // 发送请求并刷新页面数据
      api.deleteDutyInfo(id).then((data) => {
        if (data.status == 0) {
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    editConfirm() {
      // 发送请求 将修改后的对象发送到服务器
      // 修改和 更新共用接口
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
        font-size: 13px;
        color: #1465C0;
        .el-button {
          border-radius: 2px; // color: #0460AE;
        }
      }
    }
    .el-card__body {
      padding: 20px 0;
    }
    .el-table {
      .cell {
        font-size: 13px;
      }
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
    .myEditTable {
      width: 100%;
    }
    .alignCenter {
      text-align: center!important;
    }
  }
  .paginateWrap {
    margin: 20px auto 50px
  }
  .el-form-item__label{
    text-align: left
  }
}
</style>

