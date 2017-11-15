<template>
  <div id="meetingSearch">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>会议通知</span>
        <i class="iconfont icon-shuaxin" @click="reset"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-input v-model="searchParams.conferenceTitle" placeholder="会议名称"  :maxlength="50"></el-input>
        </el-col>
        <el-col :span="5">
          <el-date-picker v-model="searchParams.reserveDate" type="date" :editable="false" style="width:100%" placeholder="日期"></el-date-picker>
        </el-col>
        <el-col :span="5">
          <el-input v-model="searchParams.convenerName" placeholder="发起人"></el-input>
        </el-col>
        <el-col :span="3">
          <el-select v-model="status" placeholder="状态">
            <el-option key="0" label="全部" value="0"></el-option>
            <el-option key="1" label="正常" value="1"></el-option>
            <el-option key="2" label="已取消" value="2"></el-option>
            <el-option key="3" label="已结束" value="3"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable" @row-click="goDetail">
        <el-table-column prop="conferenceTitle" label="会议名称"></el-table-column>
        <el-table-column prop="convenerName" label="发起人" width="100"></el-table-column>
        <el-table-column prop="reserveDate" label="会议日期" width="100">
          <template scope="scope">
            {{scope.row.reserveDate | time('date')}}
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" width="80">
          <template scope="scope">
            {{scope.row.beginTime | time('hours')}}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="80">
          <template scope="scope">
            {{scope.row.endTime | time('hours')}}
          </template>
        </el-table-column>
        <el-table-column prop="roomName" label="房间" width="70"></el-table-column>
        <el-table-column prop="roomPlace" label="位置" width="100"></el-table-column>
        <el-table-column label="状态" class-name="clickItem" width="90">
          <template scope="scope">
            <template v-if="scope.row.isEnd!=1">
              <span v-if="scope.row.isCancel==1">已取消</span>
              <span class="cancelButton" v-else>正常</span>
            </template>
            <template v-else>
              <span>已结束</span>
            </template>
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
      value: '',
      value1: '',
      reserveDate: '',
      searchParams: {
        "conferenceTitle": "",
        "reserveDate": "",
        "isMyLaunched": "2",
        "pageSize": 10,
        "pageNumber": 1,
        "convenerName": "",
        "shortType": 2,
        "isCancel": "",
        "isEnd": ""
      },
      totalSize: 0,
      status: '',
      searchLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'roomList',
    ])
  },
  created() {
    this.initPage(this.$route.params);
  },
  beforeRouteUpdate (to, from, next) {
    this.initPage(to.params);
    next();
  },
  methods: {
    initPage(params) {
      if (params.type) {
        var type = params.type
        // console.log(type)

        if (type == 2) {
          this.status = '2'
        } else if (type == 3) {
          this.status = '3'
        }else{
          this.status=''
        }
      }
      this.getData();
    },
    getData() {
      var that = this;
      this.searchLoading = true;
      var params = Object.assign({ empId: this.userInfo.empId }, this.clone(this.searchParams))
      if (this.searchParams.reserveDate) {
        params.reserveDate = this.searchParams.reserveDate.getTime();
      }
      switch (this.status) {
        case "0": //全部
          params.isEnd = '';
          params.isCancel = '';
          params.isMyLaunched = '2'
          break;
        case '1': //正常
          params.isEnd = '0';
          params.isCancel = '0';
          params.isMyLaunched = '2'
          break;
        case '2': //已取消
          params.isEnd = '0';
          params.isCancel = '1';
          params.isMyLaunched = '';
          break;
        case '3': //已结束
          params.isEnd = '1';
          params.isCancel = '';
          params.isMyLaunched = '';
          break;
        default:
          ;
      }
      this.$http.post("/conference/conferReserveList", params, { body: true }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.searchData = res.data.records;
          this.totalSize = res.data.total;
        } else {
          this.searchData = [];
          this.totalSize = 0;
        }
      }, res => {

      })
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
      this.searchParams.conferenceTitle = '';
      this.searchParams.reserveDate = '';
      this.searchParams.convenerName = '';
      this.searchParams.status = '';
    },
    goDetail(row) {
      this.$router.push('/meeting/bookingDetail/' + row.id)
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#meetingSearch {
  .searchOptions {
    .el-card__body {
      .el-col {
        margin-top: 13px;
        margin-bottom: 13px;
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
    padding: 20px;
    text-align: right;
  }
}

</style>
