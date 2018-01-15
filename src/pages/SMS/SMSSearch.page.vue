<template>
  <div id="SMSSearch">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>短信管理</span>
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
              <el-input :value="sendText" readonly class="sendInput">
                <el-select v-model="selType" slot="prepend" placeholder="发送人" clearable style="width:100px" @change="typeChange">
                  <el-option label="人员" value="person"></el-option>
                  <el-option label="部门" value="dep"></el-option>
                </el-select>
                <el-button slot="append" icon="search" :disabled="!selType||(selType==='dep'&&userInfo.smsManger===1)" @click="showDialog"></el-button>
              </el-input>
            </el-col>
            <el-col :span="6">
              <el-select v-model="searchParams.sts" style="width:100%" placeholder="删除状态" clearable>
                <el-option label="已删除" value="1"></el-option>
                <el-option label="未删除" value="0"></el-option>
              </el-select>
            </el-col>
            <el-col :span="18">
              <el-date-picker v-model="timeline" placeholder="起始至截至日期" type="daterange" :editable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
            </el-col>
            <el-col :span="3" :offset="3">
              <el-button type="primary" @click="search" :disabled="searchLoading" class="searchButton">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable">
        <el-table-column prop="sendUserName" label="发送人" width="130"></el-table-column>
        <el-table-column prop="reciUserName" label="接收人" width="130"></el-table-column>
        <el-table-column prop="content" label="短信内容" class-name="contentColumn"></el-table-column>
        <el-table-column prop="sendStatus" label="短信状态" width="100">
          <template scope="scope">
            <span :class="{errorText:scope.row.sendStatus=='0'}">{{scope.row.sendStatus=='1'?'发送成功':'发送失败'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送日期" width="100"></el-table-column>
        <el-table-column label="操作" class-name="clickItem" width="70">
          <template scope="scope">
            <span class="cancelButton" @click.stop="goDetail(scope.row)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox clearfix" v-show="searchData.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="searchParams.pageNumber" :page-size="searchParams.pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
      </div>
    </el-card>
    <person-dialog @updatePerson="updatePerson" selText="发送人" :visible.sync="personVisible" :admin="userInfo.smsManger===4?'1':'0'"></person-dialog>
    <dep-dialog :dialogVisible.sync="depVisible" :data="selDepList" dialogType="multi" @updateDep="updateDep"></dep-dialog>
  </div>
</template>
<script>
import PersonDialog from '../../components/personDialog.component'
import DepDialog from '../../components/depDialog.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    PersonDialog,
    DepDialog
  },
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
        "sts": "",
        "deptIds": [],
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
      selType: '',
      personVisible: false,
      depVisible: false,
      selPerson: '',
      selDepList: []
    }
  },
  computed: {
    sendText: function() {
      var text = '';
      if (this.selType === 'person') {
        text = this.selPerson.name;
      } else if (this.selType === 'dep') {
        text = this.selDepList.map(d => d.name).join(' , ')
      }
      return text;
    },
    ...mapGetters([
      'userInfo',
      'roomList',
    ])
  },
  created() {
    // if (this.userInfo.smsManger === 0) {
    //   this.$router.push('/SMS/mySMS')
    // } else {
      // this.getData();
    // }
  },
  activated() {
    if (this.userInfo.smsManger === 0) {
      this.$router.push('/SMS/mySMS')
    } else {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.searchLoading = true;
      if (this.timeline && this.timeline.length != 0 && this.timeline[0]) {
        this.searchParams.startTime = this.timeFilter(+this.timeline[0], 'date') + ' 00:00:00';
        this.searchParams.endTime = this.timeFilter(+this.timeline[1], 'date') + ' 23:59:59';
      } else {
        this.searchParams.startTime = '';
        this.searchParams.endTime = '';
      }
      if (this.selPerson) {
        this.searchParams.userId = this.selPerson.empId;
      } else if (this.selDepList.length !== 0) {
        this.searchParams.deptIds = this.selDepList.map(d => d.id);
      } else {
        this.searchParams.userId = '';
        this.searchParams.deptIds = [];
      }
      this.$http.post("/tSmsSend/smsManageList", this.searchParams, { body: true }).then(res => {
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
    goDetail(row) {
      this.$router.push('/SMS/SMSDetail/' + row.id)
    },
    updatePerson(val) {
      this.selPerson = val;
    },
    updateDep(list) {
      this.selDepList = list;
    },
    showDialog() {
      if (this.selType === 'person') {
        this.personVisible = true;
      } else if (this.selType === 'dep') {
        this.depVisible = true;
      }
    },
    typeChange() {
      this.selPerson = '';
      if(this.userInfo.smsManger===1){
        this.selDepList=[{id:this.userInfo.deptVo.fatherDeptId,name:this.userInfo.deptVo.fatherDept}];
      }else{
        this.selDepList = [];
      }      
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
$sub:#1465C0;
#SMSSearch {
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
      .searchButton {
        height: 46px; // width: 40%;
        // float: right;
        font-size: 18px;
        width: 100%;
      }
      .sendInput {
        .el-input-group__prepend {
          border-radius: 0;
        }
        .el-input-group__append {
          border-radius: 0;
          button {
            height: 46px;
            background-color: $main;
            color: #fff;
            font-size: 20px;
          }
          .el-button.is-disabled,
          .el-button.is-disabled:hover,
          .el-button.is-disabled:focus {
            background-color: rgb(238, 241, 246);
            color: rgb(191, 202, 217);
          }
        }
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
    .el-pagination {
      float: right;
    }
  }
}

</style>
