<template>
  <div id="macroStatistics">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>宏观统计</span>
        <i class="iconfont icon-shuaxin" @click="reset"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-select v-model="searchParams.taskDeptId" placeholder="呈报部门" clearable>
            <el-option :key="item.deptId" :label="item.deptName" :value="item.deptId" v-for="item in depList"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-cascader :clearable="true" :options="docTypeOptions" :props="defaultProp" v-model="docTypes" :show-all-levels="false" placeholder="公文类型"></el-cascader>
        </el-col>
        <el-col :span="8">
          <el-date-picker v-model="timeline" placeholder="呈报日期" type="daterange" :editable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
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
        <el-table-column prop="deptName" label="呈报部门" width="150"></el-table-column>
        <el-table-column prop="supplierName" label="公文类型"></el-table-column>
        <el-table-column prop="taskDocNum" label="呈报公文" width="100" align="center"></el-table-column>
        <el-table-column prop="signDocNum" label="签批公文" width="100" align="center"></el-table-column>
        <el-table-column prop="countersignNum" label="会签公文" width="100" align="center"></el-table-column>
        <el-table-column prop="overTimeNum" label="超时公文" width="100" align="center"></el-table-column>
        <el-table-column prop="overTimeProportion" label="超时比例" width="100" align="center"></el-table-column>
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
        "taskDeptId": "",
        "docType": "",
        "startTime": "",
        "endTime": "",
        "pageSize": 10,
        "pageNumber": 1,
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
      depList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'staticsPower'
    ])
  },
  created() {
    if (this.staticsPower != 1) {
      this.$router.replace('/doc/docSub');
    } else {
      this.getTypes();
      this.getDepList();
      this.timeline.push(new Date().setDate(1), new Date());
      this.getData();
    }
  },
  watch: {
    staticsPower: function(newVal) {
      if (newVal != 1) {
        this.$router.replace('/doc/docSub');
      }
    }
  },
  methods: {
    getData() {
      this.searchLoading = true;
      this.searchParams.docType = this.docTypes[this.docTypes.length - 1];
      if (this.timeline && this.timeline.length != 0) {
        this.searchParams.startTime = this.timeFilter(+this.timeline[0], 'date');
        this.searchParams.endTime = this.timeFilter(+this.timeline[1], 'date');
      } else {
        this.searchParams.startTime = '';
        this.searchParams.endTime = '';
      }
      this.$http.post("/doc/docMacroStatistics", this.searchParams, { body: true }).then(res => {
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
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#macroStatistics {
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
