<template>
  <div id="dutyEdit" :class="{'scrollDisappear': scrollDisappear}">
    <el-card class="searchOption">
      <div slot="header">
        <el-row>
          <el-col :span="4">
            查询值班信息
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="10">
        <el-col :span="11">
          <el-date-picker v-model="searchMsg.date" type="daterange" placeholder="起始及截止日期栏" style="width:100%">
          </el-date-picker>
        </el-col>
        <el-col :span="5">
          <dept-list @deptChange="deptChange"></dept-list>
        </el-col>
        <el-col :span="8">
          <el-row :gutter="0">
            <el-col :span="16">
              <el-input v-model="searchMsg.empName" placeholder="值班人"></el-input>
            </el-col>
            <el-col :span="8">
              <el-button class="search" @click="search" type="primary">搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="tableData">
      <div slot="header">
        <el-row>
          <el-col :span="4">
            编辑值班信息
          </el-col>
        </el-row>
      </div>
      <el-table :data="tableData" stripe highlight-current-row style="width: 100%">
        <el-table-column type="index" label=" " width="60">
        </el-table-column>
        <el-table-column property="dutyDate" label="日期" width="140">
        </el-table-column>
        <el-table-column property="deptName" label="部门" width="120">
        </el-table-column>
        <el-table-column property="empName" label="值班人" width="110">
        </el-table-column>
        <el-table-column property="mobileNumber" label="手机">
        </el-table-column>
        <el-table-column property="phoneNumber" label="电话">
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template style="font-size: 13px" scope="scope">
            <el-button style="font-size: 13px" @click="triggerDelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
            <el-button style="font-size: 13px" @click="triggerEdit(scope.$index,scope.row)" type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginateWrap" v-if="tableData.length!=0">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="paginate.Record" :page-sizes="paginate.pageSizes" :layout="paginate.layout" :total="paginate.total">
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="" :visible.sync="dialogVisible1" :show-close="false" size="tiny">
      <span>删除值班信息?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('dialogVisible1')">取 消</el-button>
        <el-button type="primary" @click="deleteConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑值班信息" :visible.sync="dialogVisible2" :show-close="false" top="10%" size="tiny">
      <el-form :model="currentRecord" :rules="rules">
        <el-form-item label="日期" prop="date" :label-width="formLabelWidth">
          <el-date-picker v-model="editDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" prop="dept" :label-width="formLabelWidth">
          <dept-list :deptName="currentRecord.deptName" @deptChange="deptTwoChange"></dept-list>
        </el-form-item>
        <el-form-item label="值班人" prop="emp" :label-width="formLabelWidth">
          <el-input v-model="currentRecord.empName"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" :label-width="formLabelWidth">
          <el-input v-model="currentRecord.mobileNumber"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="currentRecord.phoneNumber"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel('dialogVisible2')">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
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
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      editDate: '',
      tableData: [],
      sendData: {},
      searchMsg: {
        date: '',
        deptName: '',
        empName: '',
      },
      paginate: {
        pageSizes: [10, 12, 36],
        currentSize: 10,
        Record: 1,
        layout: "total,prev, pager, next, jumper",
        total: 0
      },
      currentRecord: {
        empName: '',
        deptName: '',
        mobileNumber: '',
        phoneNumber: '',
        id: ''
      },
      rules: {},
      currentIndex: '',
      dialogVisible1: false,
      dialogVisible2: false,
      scrollDisappear: true,
      formLabelWidth: '100px'
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    startDate() {
      return this.searchMsg.date ? util.formatTime(this.searchMsg.date[0], 'yyyyMMdd') : ''
    },
    endDate() {
      return this.searchMsg.date ? util.formatTime(this.searchMsg.date[1], 'yyyyMMdd') : ''
    }
  },
  created() {
    if (!this.userInfo.isDocsec || this.userInfo.isDocsec[1] != 1) {
      this.$router.push('/duty/dutyDetail')
    } else {
      this.searchMsg.date = [new Date(), new Date()]
      this.search()
    }
  },
  methods: {
    handleCurrentChange() {
      this.search()
    },
    deptChange(val) {
      this.searchMsg.deptName = val
    },
    deptTwoChange(val) {
      this.currentRecord.deptName = val
    },
    search() {
      api.getDutyMessage({
        startDate: this.startDate || '',
        endDate: this.endDate || '',
        deptName: this.searchMsg.deptName || '',
        empName: this.searchMsg.empName || '',
        pageNumber: this.paginaRecord || 1,
        pageSize: 10
      }).then((data) => {
        if (data.status == '0' && data.data.totalSize) {
          this.tableData = dataTransform(data.data.ondutyVolist, fmts)
          this.paginate.total = Number(data.data.totalSize)
        } else {
          this.tableData = [];
          this.paginate.total = 0;
        }
      })
    },
    triggerDelete(index, row) {
      this.dialogVisible1 = true
      this.currentIndex = index
      Object.assign(this.currentRecord, row)
      console.log(this.currentRecord.id)
    },
    triggerEdit(index, row) {
      this.dialogVisible2 = true
      this.currentIndex = index
      Object.assign(this.currentRecord, row)
      this.editDate = new Date(this.currentRecord.dutyDate)
      // console.log('currentRecord.deptName:' + this.currentRecord.deptName)
    },
    deleteConfirm() {
      this.$http.post('/onduty/deleteDutyInfo', { 'id': this.currentRecord.id }).then((data) => {
        if (data.status == 0) {
          this.tableData.splice(this.currentIndex, 1)
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      })
      this.cancel('dialogVisible1')
    },
    editConfirm() {
      this.formatTableData()
      console.log(this.sendData)
      this.$http.post('/onduty/addOrUpdateDutyInfo', { ondutylist: [this.sendData], useId: this.userInfo.empId }, { body: true }).then((data) => {
        if (data.status == '0') {
          this.$message({
            message: '提交成功',
            type: 'success',
          })
          this.tableData.splice(this.currentIndex, 1, this.currentRecord)
          this.cancel('dialogVisible2')
        } else {
          this.cancel('dialogVisible2')
          this.$message.error('提交失败')
        }
      })
    },
    formatTableData() {
      Object.keys(this.currentRecord).forEach(key => {
        if (key === 'dutyDate') {
          if (this.editDate) {
            this.sendData[key] = this.editDate.getTime()
          } else {
            this.sendData[key] = new Date(this.currentRecord[key]).getTime()
          }
        } else {
          if (this.currentRecord[key] === '空' || this.currentRecord[key] === '无') {
            this.sendData[key] = ''
          } else {
            this.sendData[key] = this.currentRecord[key]
          }
        }
      })
    },
    cancel(val) {
      this[val] = false
      this.currentRecord = {}
      this.editDate = ''
      this.scrollDisappear = false
    }
  },
  components: {
    deptList
  }
}

</script>
<style scope lang="scss">
@import '../../assets/scss/color.scss';

#dutyEdit {
  &.scrollDisappear {
    margin-right: 17px;
  }
  .el-table__body-wrapper {
    overflow-x: hidden;
  }
  .el-card {
    padding: 0;
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
        font-size: 13px !important;
        .el-button {
          font-size: 13px;
          text-align: center;
        }
      }
      thead {
        th:nth-last-child(2) {
          .cell {
            text-align: center
          }
        }
      }
      tr {
        td:last-child {
          text-align: center
        }
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
  .searchOption {
    .el-card__header,
    .el-card__body {
      padding-left: 20px;
    }
  }
  .tableData {
    .el-card__header {
      padding-left: 20px;
      font-size: 18px;
    }
    .el-card__body {
      padding: 0px;
    }
  }
  .paginateWrap {
    margin: 20px auto 10px;
    .el-pagination {
      text-align: right;
    }
  }
  .el-form-item__label {
    text-align: left
  }
  .el-form-item__label:before {
    content: ''
  }
}

</style>
