<template>
  <div id="mySMS">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>我的预定</span>
        <i class="iconfont icon-shuaxin" @click="reset"></i>
      </div>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-input v-model.trim="searchParams.conferenceTitle" placeholder="会议名称" :maxlength="50"></el-input>
        </el-col>
        <el-col :span="5">
          <el-date-picker v-model="searchParams.reserveDate" type="date" :editable="false" style="width:100%" placeholder="日期"></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchParams.roomPlace" style="width:100%" @change="changeRoomPlace" placeholder="位置">
            <el-option v-for="item in roomList" :key="item.roomPosition" :label="item.roomPosition" :value="item.roomPosition">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="searchParams.roomId" placeholder="房间" no-data-text="请先选择位置">
            <el-option v-for="item in rooms" :key="item.id" :label="item.roomName" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable" @row-click="goDetail">
        <el-table-column prop="conferenceNumber" label="预定编号" width="130"></el-table-column>
        <el-table-column prop="conferenceTitle" label="会议名称"></el-table-column>
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
        <el-table-column label="操作" class-name="clickItem" width="90">
          <template scope="scope">
            <span v-if="scope.row.isCancel==1">已取消</span>
            <span class="cancelButton" v-else @click.stop="cancel(scope.row)">取消</span>
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
        "isMyLaunched": 1,
        "pageSize": 10,
        "pageNumber": 1,
        "roomPlace": '',
        "roomId": '',
        // 'shortType':1
      },
      totalSize: 0,
      searchLoading: false
    }
  },
  computed: {
    rooms() {
      var temp = [];
      if (this.searchParams.roomPlace) {
        temp = this.roomList.find(r => r.roomPosition == this.searchParams.roomPlace).rooms;
      }
      return temp;
    },
    ...mapGetters([
      'userInfo',
      'roomList',
    ])
  },
  created() {
    this.getData();
  },
  components: {

  },
  methods: {
    changeRoomPlace() {
      this.searchParams.roomId = '';
    },
    getData() {
      var that = this;
      this.searchLoading = true;
      var params = Object.assign({ empId: this.userInfo.empId }, this.clone(this.searchParams))
      if (this.searchParams.reserveDate) {
        params.reserveDate = this.searchParams.reserveDate.getTime();
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
      this.searchParams.roomPlace = '';
      this.searchParams.roomId = '';
    },
    cancel(row) {
      this.$confirm('确定取消此次会议预定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/conference/cancalConference', { id: row.id,cancelEmpId:this.userInfo.empId,cancelName:this.userInfo.name },{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('取消成功');
              this.searchParams.pageNumber=1;
              this.getData();
              this.$store.dispatch('getConferenceNum');
            } else {
              this.$message.warning('取消失败')
            }
          })
      }).catch(() => {

      });
    },
    goDetail(row){
      this.$router.push('/meeting/bookingDetail/'+row.id)
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#mySMS {
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
            cursor: pointer;
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
  .pageBox{
    padding:20px;
    text-align: right;
  }
}

</style>
