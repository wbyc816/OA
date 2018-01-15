<template>
  <div id="mySMS">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>我的短信</span>
        <span class="detailButton" @click="showDetail=!showDetail">{{!showDetail?'高级搜索':'收起'}}</span>
      </div>
      <el-collapse-transition>
        <div v-show="showDetail">
          <el-row :gutter="12">
            <el-col :span="18">
              <el-input v-model.trim="searchParams.content" placeholder="短信内容" :maxlength="50"></el-input>
            </el-col>
            <el-col :span="6">
              <el-select v-model="searchParams.sendStatus" style="width:100%" placeholder="短信状态" clearable>
                <el-option label="发送成功" value="1"></el-option>
                <el-option label="发送失败" value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="timeline" placeholder="起始至截至日期" type="daterange" :editable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
            </el-col>
            <el-col :span="3" :offset="3">
              <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="sendUserName" label="发送人" width="130"></el-table-column>
        <el-table-column prop="reciUserName" label="接收人" width="130"></el-table-column>
        <el-table-column prop="content" label="短信内容" class-name="contentColumn"></el-table-column>
        <el-table-column prop="sendStatus" label="短信状态" width="100">
          <template scope="scope">
            <span :class="{errorText:scope.row.sendStatus=='0'}">{{scope.row.sendStatus=='1'?'发送成功':'发送失败'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送日期" width="100"></el-table-column>
        <el-table-column label="操作" class-name="clickItem" width="90">
          <template scope="scope">
            <span class="cancelButton" @click.stop="goDetail(scope.row)">查看</span>
            <span class="cancelButton" @click.stop="deleteSMS([scope.row.id])">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox clearfix" v-show="searchData.length>0">
        <span v-show="selList.length!=0" class="bottomDel">已选<i>{{selList.length}}</i>条记录<i @click="deleteSel">删除</i></span>
        <el-pagination @current-change="handleCurrentChange" :current-page="searchParams.pageNumber" :page-size="searchParams.pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
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
        "pageSize": 15,
        "pageNumber": 1,
        "userId": "",
        "content": "",
        "sendStatus": "",
        "startTime": "",
        "endTime": "",
      },
      timeline: [],
      totalSize: 0,
      searchLoading: false,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() >= +new Date();
        }
      },
      showDetail: false,
      selList:[]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'roomList',
    ])
  },
  created() {
    this.searchParams.userId = this.userInfo.empId;
    this.getData();
  },
  activated() {
    this.getData();
  },
  components: {

  },
  methods: {
    getData() {
      this.searchLoading = true;
      if (this.timeline && this.timeline.length != 0&&this.timeline[0]) {
        this.searchParams.startTime = this.timeFilter(+this.timeline[0], 'date') + ' 00:00:00';
        this.searchParams.endTime = this.timeFilter(+this.timeline[1], 'date') + ' 23:59:59';
      } else {
        this.searchParams.startTime = '';
        this.searchParams.endTime = '';
      }
      this.$http.post("/tSmsSend/selectMySms", this.searchParams, { body: true }).then(res => {
        setTimeout(() => {
          this.searchLoading = false;
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
    deleteSel(){
      var ids=this.selList.map(s=>s.id);
      this.deleteSMS(ids);
    },
    deleteSMS(ids) {
      this.$confirm('确定删除所选短信记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post('/tSmsSend/deleteById', ids,{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('删除成功');
              this.searchParams.pageNumber = 1;
              this.getData();
            } else {
              this.$message.warning('删除失败')
            }
          })
      }).catch(() => {

      });
    },
    goDetail(row) {
      this.$router.push('/SMS/SMSDetail/' + row.id)
    },
    handleSelectionChange(val){
      this.selList=val;
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#mySMS {
  .searchOptions {
    .detailButton {
      float: right;
      color: $main;
      cursor: pointer;
    }
    .el-card__body {
      padding-bottom: 13px;
      .el-col {
        margin-top: 13px; // margin-bottom: 13px;
      }
      .el-col-6 {
        .el-select {
          width: 100%;
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
          height: 60px;
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
      .contentColumn {
        .cell {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
      .errorText {
        color: red;
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
    .el-pagination{
      float:right;
    }
    .bottomDel{
      float:left;
      i{
        font-style: normal;
        color:$main;
        cursor:pointer;
        padding:0 5px;
      }
    }
  }
}

</style>
