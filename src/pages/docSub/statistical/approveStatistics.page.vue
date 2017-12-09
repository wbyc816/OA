<template>
  <div id="approveStatistics">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>审批者统计</span>
        <i class="iconfont icon-shuaxin" @click="reset"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-select v-model="searchParams.isAdmin" placeholder="角色" clearable>
            <el-option label="公文管理员" value="1"></el-option>
            <el-option label="普通员工" value="0"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-cascader :clearable="true" :options="docTypeOptions" :props="defaultProp" v-model="docTypes" :show-all-levels="false" placeholder="公文类型"></el-cascader>
        </el-col>
        <el-col :span="12">
          <el-date-picker v-model="timeline" placeholder="呈报日期" type="daterange" :editable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
        </el-col>
        <el-col :span="20">
          <el-select v-model="searchParams.taskUserIds" multiple filterable clearable remote placeholder="请输入关键词搜索人员" :remote-method="remoteMethod" :multiple-limit="10" :loading="loading" style="width:100%">
            <el-option v-for="item in personList" :key="item.empId" :label="item.name" :value="item.empId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <div slot="header" class="clearfix">
        <span v-if="timeline&&timeline.length>0&&timeline[0]">{{+timeline[0] | time('ch')}} ~ {{+timeline[1] | time('ch')}}</span>
        <span class="download"><i class="iconfont icon-icon202"></i>导出报表</span>
      </div>
      <el-table :data="searchData" class="myTable">
        <el-table-column prop="userName" label="姓名" width="100"></el-table-column>
        <el-table-column prop="deptName" label="所属部门"></el-table-column>
        <el-table-column prop="roleName" label="角色" width="100"></el-table-column>
        <el-table-column prop="taskDocNum" label="呈报公文" width="70" align="center"></el-table-column>
        <el-table-column prop="signDocNum" label="签批公文" width="70" align="center"></el-table-column>
        <el-table-column prop="countersignLaunchNum" label="会签发起" width="70" align="center"></el-table-column>
        <el-table-column prop="countersignNum" label="会签公文" width="70" align="center"></el-table-column>
        <el-table-column prop="toReadingNum" label="待阅公文" width="70" align="center"></el-table-column>
        <el-table-column prop="distributeNum" label="分发公文" width="70" align="center"></el-table-column>
        <el-table-column prop="overTimeNum" label="超时公文" width="70" align="center"></el-table-column>
      </el-table>
      <div class="pageBox" v-show="searchData.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="searchParams.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      searchData: [],
      searchParams: {
        "docType": "",
        "startTime": "",
        "endTime": "",
        "pageSize": 10,
        "pageNumber": 1,
        "taskUserIds": [],
        "isAdmin": '',
        'docManageLevel': ''
      },
      timeline: [],
      totalSize: 0,
      searchLoading: false,
      docTypes: [],
      docTypeOptions: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() >= +new Date();
        }
      },
      defaultProp: {
        label: 'dictName',
        value: 'dictCode',
        children: 'childDict'
      },
      depList: [],
      loading: false,
      personList: [],

    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'staticsPower'
    ])
  },
  created() {
    if (this.staticsPower == 0) {
      this.$router.replace('/doc/docSub');
    } else {
      this.getTypes();
      this.getDepList();
      this.timeline.push(new Date().setDate(1), new Date());
      this.searchParams.docManageLevel = this.staticsPower
      this.getData();
    }
  },
  watch: {
    staticsPower: function(newVal) {
      if (newVal == 0) {
        this.$router.replace('/doc/docSub');
      }
    }
  },
  methods: {
    getData() {
      this.searchLoading = true;
      this.searchParams.docType = this.docTypes[this.docTypes.length - 1];
      var params = this.clone(this.searchParams);
      if (this.timeline && this.timeline.length != 0) {
        params.startTime = this.timeFilter(+this.timeline[0], 'date');
        params.endTime = this.timeFilter(+this.timeline[1], 'date');
      } else {
        params.startTime = '';
        params.endTime = '';
      }
      if (params.isAdmin === '') {
        delete params.isAdmin
      }
      params.userId=this.userInfo.empId;
      this.$http.post("/doc/approveDocStatistics", params, { body: true }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;
        }.bind(this), 200)
        if (res.status == 0) {
          this.searchData = res.data.records;
          this.totalSize = res.data.total;
        } else {
          this.searchData = [];
          this.totalSize = 0;
        }
      }, res => {})
    },
    handleCurrentChange(page) {
      console.log(page)
      this.searchParams.pageNumber = page;
      this.getData()
    },
    search() {
      this.searchParams.pageNumber = 1;
      this.getData();
    },
    reset() {
      this.searchParams.taskDeptId = '';
      this.searchParams.docType = '';
      this.searchParams.startTime = '';
      this.searchParams.endTime = '';
      this.searchParams.keyWords = '';
      this.searchParams.taskUserName = '';
      this.searchParams.docNo = '';
      this.searchParams.taskUserIds=[];
      this.timeline = [];
    },
    getTypes() {
      if (this.docTypeOptions.length == 0) {
        this.$http.post('/doc/getDocTypeTreeList')
          .then(res => {
            if (res.status == 0) {
              this.docTypeOptions = res.data
            } else {

            }
          })
      }
    },
    getDepList() {
      if (this.depList.length == 0) {
        this.$http.post('doc/docTaskDept')
          .then(res => {
            if (res.status == 0) {
              this.depList = res.data
            } else {

            }
          })
      }
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        clearTimeout(this.meTimeout);
        this.meTimeout = setTimeout(() => {
          this.$http.post('/emp/queryEmpDeptList', { name: query, deptId: this.userInfo.deptParentId, pageNumber: 1, pageSize: 50 })
            .then(res => {
              this.loading = false;
              if (res.status == 0) {
                this.personList = res.empVoList;
              } else {

              }
            })
        }, 600);
      } else {
        this.personList = [];
      }
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#approveStatistics {
  .searchOptions {
    .el-card__body {
      padding-top: 13px;

      .el-col {
        margin-bottom: 13px;
        margin-top: 0;
      }
      .el-col-6 {
        .el-select {
          width: 100%;
        }
      }
      .el-col-8 {
        .el-select {
          width: 60%;
        }
      }
      .el-select {
        >.el-input input {

          min-height: 46px;
        }
      }
      button {
        height: 46px; // width: 40%;
        // float: right;
        font-size: 18px;
        width: 100%;
      }
    }
  }
  .searchResult {
    .download {
      float: right;
      font-size: 15px;
      color: $main;
      cursor: pointer;
      i {
        font-size: 22px;
        vertical-align: sub;
        padding-right: 3px;
      }
    }
    padding: 0;
    tr th:first-child .cell {
      padding-left: 15px;
    }
    .el-card__body {
      padding: 0;
      .el-table {
        tr td:first-child .cell {
          padding-left: 15px;
        }

        td {
          height: 70px;
        }
        td.clickItem {
          .cancelButton {
            color: $main;
          }
        }
        td.timeItem {
          padding-right: 25px;
        }
      }
    }
    .total {
      height: 33px;
      line-height: 33px;
      padding-left: 15px;
      font-size: 14px;
      color: #95989A;
    }
  }
  .pageBox {
    padding: 10px 20px;
    text-align: right;
  }
}

</style>
