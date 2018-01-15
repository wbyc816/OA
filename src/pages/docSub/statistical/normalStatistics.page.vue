<template>
  <div id="normalStatistics">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>公文统计</span>
        <i class="iconfont icon-shuaxin" @click="reset"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-select v-model="searchParams.taskDeptId" placeholder="呈报部门" clearable :disabled="depList.length<2">
            <el-option :key="item.deptId" :label="item.deptName" :value="item.deptId" v-for="item in depList"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-cascader :clearable="true" :options="docTypeOptions" :props="defaultProp" v-model="docTypes" :show-all-levels="false" placeholder="公文类型"></el-cascader>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchParams.taskUserName" placeholder="呈报人"></el-input>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchParams.docNo" placeholder="公文编号"></el-input>
        </el-col>
        <el-col :span="8">
          <el-date-picker v-model="timeline" placeholder="呈报日期" type="daterange" :editable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
        </el-col>
        <el-col :span="12">
          <el-input v-model.trim="searchParams.keyWords" placeholder="公文标题"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <div slot="header" class="clearfix">
        <span v-if="timeline&&timeline.length>0&&timeline[0]">
          <template v-if="dayCount>1">
            {{+timeline[0] | time('ch')}} ~             
          </template>
            {{+timeline[1] | time('ch')}}
        </span>
        <!-- <span class="download"><i class="iconfont icon-icon202"></i>导出报表</span> -->
      </div>
      <el-table :data="searchData" class="myTable" @row-click="goDetail">
        <el-table-column prop="docTypeName" label="公文类型" width="100"></el-table-column>
        <el-table-column prop="taskUser" label="呈报人" width="100"></el-table-column>
        <el-table-column prop="docTitle" label="公文标题"></el-table-column>
        <el-table-column prop="taskTime" label="呈报时间" width="100"></el-table-column>
        <el-table-column prop="nodeName" label="公文状态" width="80">
          <template scope="scope">
            {{(scope.row.state=='3'||scope.row.state=='4')?'已归档':'审批中'}}
          </template>
        </el-table-column>
        <el-table-column prop="currentUser" label="当前签批人" width="100"></el-table-column>
        <el-table-column prop="isOvertime" label="超时状态" width="80">
          <template scope="scope">
            {{scope.row.isOvertime==1?'已超时':'正常'}}
          </template>
        </el-table-column>
        <el-table-column prop="overTimeProportion" label="超时节点" width="100">
          <template scope="scope">
            {{scope.row.isOvertime==1?scope.row.currentUser:''}}
          </template>
        </el-table-column>
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
        "taskUserName": '',
        "docNo": '',
        "keyWords": ''
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
      dayCount: 0
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
    ])
  },
  created() {
    if (this.staticsPower == 0) {
      this.$router.replace('/doc/docSub');
    } else {
      this.getTypes();
      this.getDepList();
      this.timeline.push(new Date(new Date().setHours(0, 0, 0, 0)), new Date());
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
      if (this.timeline && this.timeline.length != 0&&this.timeline[0]) {
        this.searchParams.startTime = this.timeFilter(+this.timeline[0], 'date');
        this.searchParams.endTime = this.timeFilter(+this.timeline[1], 'date');
      } else {
        this.searchParams.startTime = '';
        this.searchParams.endTime = '';
      }
      this.searchParams.userId = this.userInfo.empId;
      this.$http.post("/doc/docStatistics", this.searchParams, { body: true }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;
        }.bind(this), 200)
        this.dayCount++;
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
    goDetail(row) {
      // console.log(row);
      this.$router.push({ path: '/doc/docInfo/' + row.id, query: { code: row.docTypeCode } })
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
        this.$http.post('doc/docTaskDept', { userId: this.userInfo.empId })
          .then(res => {
            if (res.status == 0) {
              this.depList = res.data;
              if (this.depList.length < 2) {
                this.searchParams.taskDeptId = res.data[0].deptId;
              }
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
#normalStatistics {
  .el-cascader__label {
    line-height: 46px;
  }
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
