<template>
  <div id="myForum">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>帖子管理</span>
        <span class="detailButton" @click="showDetail=!showDetail">{{!showDetail?'高级搜索':'收起'}}</span>
      </div>
      <el-collapse-transition>
        <div v-show="showDetail">
          <el-row :gutter="12">
            <el-col :span="8">
              <el-input v-model.trim="searchParams.forumTitle" placeholder="帖子标题" :maxlength="50"></el-input>
            </el-col>
            <el-col :span="8">
              <el-input v-model.trim="searchParams.createUser" placeholder="发帖人" :maxlength="50"></el-input>
            </el-col>
            <el-col :span="8">
              <el-select v-model="searchParams.forumType1" style="width:100%" placeholder="帖子类型" clearable>
                 <el-option
                    v-for="item in dataTypes"
                    :key="item.dictCode"
                    :label="item.dictName"
                    :value="item.dictCode">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-date-picker v-model="timeline" placeholder="发帖日期" type="daterange" :editable="false" style="width:100%" :picker-options="pickerOptions0"></el-date-picker>
            </el-col>
            <el-col :span="8" >
              <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="forum.taskUserName" label="发帖人" width="60"></el-table-column>
        <el-table-column prop="forum.forumTitle" label="贴子标题" width="170"></el-table-column>
        <el-table-column prop="forum.forumType1" label="帖子类型" width="70" class-name="contentColumn">
             <template scope="scope">
                <span>{{scope.row.forum.forumType1=='FUM0101'?'服务':(scope.row.forum.forumType1=='FUM0102'?"安全":"效益")}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="forum.createTime" label="发帖时间" width="70"></el-table-column>
        <el-table-column prop="forum.sts" label="启用状态" >
           <template scope="scope">
                <span>{{scope.row.forum.sts=='1'?'启用':"禁用"}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="forum.recommendSts" label="置顶状态" >
           <template scope="scope">
                <span>{{scope.row.forum.recommendSts==1?'置顶':"未置顶"}}</span>
            </template>
        </el-table-column>

       <el-table-column prop="forum.mark2" label="置顶排序" >
            <template scope="scope">
              <money-input v-model.trim="scope.row.forum.mark2"></money-input>
            </template>
        </el-table-column>

        <el-table-column prop="forum.limitTime" label="截止时间" width="100"></el-table-column>

        <el-table-column label="操作" class-name="clickItem" width="180">
          <template scope="scope">
            <span class="cancelButton" @click.stop="disableBtn(scope.row)" v-if="scope.row.forum.sts=='1'">禁用</span>
            <span class="cancelButton" @click.stop="enableBtn(scope.row)" v-if="scope.row.forum.sts=='0'">启用</span>
            <span class="cancelButton" @click.stop="top(scope.row)" v-if="scope.row.forum.recommendSts=='0'">置顶</span>
            <span class="cancelButton" @click.stop="canceltop(scope.row)" v-if="scope.row.forum.recommendSts=='1'">取消置顶</span>
            <span class="cancelButton" @click.stop="goDetail(scope.row)">查看</span>
            <span class="cancelButton" @click.stop="deleteForum([scope.row.forum.id])">删除</span>
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
import MoneyInput from '../../components/moneyInput.component'
import { mapGetters, mapMutations } from 'vuex'
export default {
  data() {
    return {
      searchData: [],
      value: '',
      value1: '',
      reserveDate: '',
      dataTypes:[],
      searchParams: {
        "pageSize": 10,
        "pageNumber": 1,
        "forumTitle": "",
        "createUser": "",
        "forumType1": "",
        "startTime": "",
        "endTime": "",
        displayType:2,
      },
      timeline: [],
      totalSize: 0,
      searchLoading: false,
      pickerOptions0: {
        // disabledDate(time) {
        //   return time.getTime() >= +new Date();
        // }
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
    this.getData();
    this.getDataType();
  },
  activated() {
    this.getData();
  },
  components: {
    MoneyInput
  },
  methods: {
    canceltop(rowData){
      this.$http.post('/forum/forumRecommend', {id:rowData.forum.id,sort:0})
        .then(res => {
          if (res.status == 0) {
            this.$message.success('取消置顶成功');
            this.getData();
          } else {
            this.$message.warning('取消置顶失败')
          }
      })
    },
    top(rowData){
      console.log(rowData)
      if(rowData.forum.mark2){
         this.$http.post('/forum/forumRecommend', {id:rowData.forum.id,sort:rowData.forum.mark2})
        .then(res => {
          if (res.status == 0) {
            this.$message.success('置顶成功');
            this.getData();
          } else {
            this.$message.warning('置顶失败')
          }
      })
      }else{
        this.$message.warning('请输入置顶顺序')
      }
     
    },
    disableBtn(rowData){
      console.log(rowData)
      var data={
            "operation": "4",
            "forum": {
                "id": rowData.forum.id
            },
        }  
        this.$http.post('/forum/addForumInfo', data,{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('禁用成功');
              this.getData();
            } else {
              this.$message.warning('禁用失败')
            }
          })

    },
    enableBtn(rowData){
      var data={
            "operation": "5",
            "forum": {
                "id": rowData.forum.id
            },
        }  
        this.$http.post('/forum/addForumInfo', data,{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('启用成功');
              this.getData();
            } else {
              this.$message.warning('启用失败')
            }
          })

    },
    getDataType() {
      this.$http.post("/api/getDict", {
         dictCode:"FUM01"
      }).then(res => {
        if (res.status == 0) {
          this.dataTypes = res.data;
          this.total = res.data.total;
         
        } else {
        }
      }, res => {

      })
    },
    getData() {
      this.searchLoading = true;
      if (this.timeline && this.timeline.length != 0&&this.timeline[0]) {
        this.searchParams.startTime = this.timeFilter(+this.timeline[0], 'date');
        this.searchParams.endTime = this.timeFilter(+this.timeline[1], 'date');
      } else {
        this.searchParams.startTime = '';
        this.searchParams.endTime = '';
      }
      this.$http.post("/forum/selectForumList", this.searchParams, { body: true }).then(res => {
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
      this.deleteForum(ids);
    },
    deleteForum(ids) {
        var forumId=ids[0];
      this.$confirm('确定删除所选短信记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var data={
            "operation": "3",
            "forum": {
                "id": forumId
            },
        }  
        this.$http.post('/forum/addForumInfo', data,{body:true})
          .then(res => {
            if (res.status == 0) {
              this.$message.success('删除成功');
              this.getData();
            } else {
              this.$message.warning('删除失败')
            }
          })
      }).catch(() => {

      });
    },
    goDetail(row) {
      this.$router.push('/forumManagementDetail/' + row.forum.id)
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
#myForum {
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
