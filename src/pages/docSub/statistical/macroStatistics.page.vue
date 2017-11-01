<template>
  <div id="macroStatistics">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>宏观统计</span>
        <i class="iconfont icon-shuaxin" @click="reset"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-select v-model="searchParams.taskDeptId" placeholder="呈报部门">
            <el-option :key="item.dictCode" :label="item.dictName" :value="item.dictCode" v-for="item in 5"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-cascader :clearable="true" :options="docTypeOptions" :props="defaultProp" v-model="docTypes" :show-all-levels="false" placeholder="公文类型"></el-cascader>
        </el-col>
        <el-col :span="8">
          <el-date-picker v-model="timeline" placeholder="呈报日期" type="daterange" :editable="false" :clearable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable">
        <el-table-column prop="deptName" label="呈报部门" width="150"></el-table-column>
        <el-table-column prop="supplierName" label="公文类型"></el-table-column>
        <el-table-column prop="taskDocNum" label="呈报公文" width="100"></el-table-column>
        <el-table-column prop="signDocNum" label="签批公文" width="100"></el-table-column>
        <el-table-column prop="countersignNum" label="会签公文" width="100"></el-table-column>
        <el-table-column prop="overTimeNum" label="超时公文" width="100"></el-table-column>
        <el-table-column prop="overTimeProportion" label="超时比例" width="100"></el-table-column>
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
        "pageSize": 1,
        "pageNumber": 10,
      },
      timeline: [],
      totalSize: 1,
      searchLoading: false,
      docTypes: [],
      docTypeOptions: [],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() >= Date.now() - 8.64e7;
        }
      },
      defaultProp: {
        label: 'dictName',
        value: 'dictCode',
        children: 'childDict'
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    this.getTypes();
    this.getData();
  },
  methods: {
    getData() {
      this.searchLoading = true;
      this.searchParams.docType = this.docTypes[this.docTypes.length - 1];
      if (this.timeline.length != 0) {
        this.searchParams.startTime = +this.timeline[0];
        this.searchParams.endTime = +this.timeline[1];
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
