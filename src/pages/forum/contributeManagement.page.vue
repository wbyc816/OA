<template>
  <div id="contributeManagement">
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="empName" label="姓名" width="130"></el-table-column>
        <el-table-column prop="rewardCount" label="奖金" ></el-table-column>
        <el-table-column prop="praiseCount" label="点赞" class-name="contentColumn" width="130">
            
        </el-table-column>
        <el-table-column prop="replyCount" label="回复" width="100"></el-table-column>


        <el-table-column prop="mark1" label="是否在贡献榜" width="100">
            <template scope="scope">
                <!-- <span>{{scope.row.mark1==1?'是':"否"}}</span> -->
                <el-select v-model="scope.row.remark1" placeholder="请选择">
                    <el-option label="是" value="1" key="1">是</el-option>
                    <el-option label="否" value="0" key="0">否</el-option>
                </el-select>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="aa" label="点赞数" width="100"></el-table-column>
        <el-table-column prop="a" label="评论数" width="100"></el-table-column> -->
        <el-table-column prop="sort" label="排序" width="100">
            <template scope="scope">
                <money-input v-model.trim="scope.row.sort"></money-input>
            </template>
        </el-table-column>

        <el-table-column label="操作" class-name="clickItem" width="150">
          <template scope="scope">
            <span class="cancelButton" @click.stop="saveBtn(scope.row)" >保存</span>
            <span class="cancelButton" @click.stop="detailBtn(scope.row)" >查看</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox clearfix" v-show="searchData.length>0">
        <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalSize">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import MoneyInput from '../../components/moneyInput.component'
export default {
  data() {
    return {
      searchData: [],
      value: '',
      value1: '',
      reserveDate: '',
      dataTypes:[],
      "pageSize": 10,
      "pageNumber": 1,
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
    detailBtn(row){
      console.log(row)
      this.$router.push('/contributeDetail/' + row.empId+"/"+row.rewardCount+"/"+row.adoptCount+"/"+row.praiseCount);
    },
    saveBtn(row){
        this.$http.post("/forum/contributeSort", {
            id:row.id,
            number:row.sort,
            type:Number(row.remark1)
            }).then(res => {
            setTimeout(() => {
            this.searchLoading = false;
            }, 200)
            if (res.status == 0) {
                 this.$message.success('保存成功');
            } else {
                  this.$message.success('保存失败');
            }
       }, res => {

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
     
      this.$http.post("/forum/getContributeList", {
          type:5,
          pageNumber:this.pageNumber,
          pageSize:this.pageSize,
      }).then(res => {
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
      this.pageNumber = page;
      this.getData()
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
#contributeManagement {
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
