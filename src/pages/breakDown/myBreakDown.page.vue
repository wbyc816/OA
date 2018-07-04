<template>
  <div id="myBreakDown">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>我的接线</span>
        <span class="detailButton" @click="showDetail=!showDetail">{{!showDetail?'高级搜索':'收起'}}</span>
      </div>
      <el-collapse-transition>
        <div v-show="showDetail">
          <el-row :gutter="12">
           

            <!-- <el-col :span="6">
              <el-select v-model="searchParams.isFeedback" style="width:100%" placeholder="是否30分钟反馈" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-col> -->

            <el-col :span="6">
              <el-select v-model="searchParams.isFeedback1" style="width:100%" placeholder="反馈状态" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-col>

            <el-col :span="6">
              <el-select v-model="searchParams.isSolve" style="width:100%" placeholder="解决状态" clearable>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-col>

            <el-col :span="6">
              <el-select v-model="searchParams.isNightWork" style="width:100%" placeholder="白班/夜班" clearable>
                <el-option label="夜班" value="1"></el-option>
                <el-option label="白班" value="0"></el-option>
              </el-select>
            </el-col>

            <!-- <el-col :span="6">
                <el-input v-model.trim="searchParams.operatorName" placeholder="接线人" :maxlength="50"></el-input>
            </el-col> -->

            <!-- <el-col :span="6">
                <el-input v-model.trim="searchParams.deptMajorId" placeholder="接障人" :maxlength="50"></el-input>
            </el-col> -->
             <el-col :span="6">
                <!-- <el-input v-model.trim="searchParams.faultDealEmpName" placeholder="接障人" :maxlength="50"></el-input> -->
                <el-autocomplete
                 style="width:100%"
                  v-model="faultDealEmpName"
                  :fetch-suggestions="querySearchAsyncDeal"
                  placeholder="接障人"
                  @select="handleSelectDeal"
                  :props="faultDeal"
                  ref="faultDealEmpName"
                  class="faultDealEmpName">
                </el-autocomplete>
            </el-col>

            <el-col :span="6">
                <!-- <el-input v-model.trim="searchParams.deptMajorId" placeholder="报障部门" :maxlength="50"></el-input> -->
              <el-autocomplete
                style="width:100%"
                v-model="deptMajorIdValue"
                  :fetch-suggestions="querySearchAsyncDeptMajorId"
                  placeholder="报障部门"
                  @select="handleSelectDeptMajorId"
                  :props="Deptprops"
                  ref="deptMajorIdValue"
                  class="deptMajorIdValue">
              </el-autocomplete>
            </el-col>

            <!-- <el-col :span="6">
                <el-input v-model.trim="searchParams.deptMajorId" placeholder="报障部门" :maxlength="50"></el-input>
            </el-col> -->

            <el-col :span="6">
              <el-select v-model="searchParams.faultType" placeholder="故障类别" clearable>
                <el-option v-for="item in faultTypes" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-col>

            <el-col :span="5">
              <el-select v-model="searchParams.faultSystem" placeholder="故障系统" clearable>
                <el-option v-for="item in faultSystems" :label="item.dictName" :value="item.dictCode"></el-option>
              </el-select>
            </el-col>

           

            <el-col :span="7">
              <el-date-picker v-model="timeline" placeholder="起始至截至日期" type="daterange" :editable="false" style="width:100%" ></el-date-picker>
            </el-col>
          
            <el-col :span="3" :offset="18">
              <el-button type="primary" @click="search" :disabled="searchLoading">搜索</el-button>
            </el-col>
            <el-col :span="3">
              <el-button type="primary" @click="exportExcel" :disabled="searchLoading">导出</el-button>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </el-card>
    <el-card class="borderCard searchResult" v-loading="searchLoading">
      <el-table :data="searchData" class="myTable" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
               <el-table-column prop="createDate" label="日期" width="100"></el-table-column>
        <el-table-column prop="operatorName" label="接线人"></el-table-column>
        <el-table-column prop="faultDealEmpName" label="接障人"></el-table-column>
        <el-table-column prop="empName" label="报障人" ></el-table-column>
        <el-table-column prop="deptMajorName" label="报障部门" width="100"></el-table-column>
        <!-- <el-table-column prop="isFeedback" label="30分钟反馈状态" width="120">
          <template scope="scope">
            <span>{{scope.row.isFeedback=='1'?'已反馈':'未反馈'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="isFeedback1" label="反馈状态" >
          <template scope="scope">
            <span>{{scope.row.isFeedback1=='1'?'已反馈':'未反馈'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isSolve" label="解决状态" >
          <template scope="scope">
            <span>{{scope.row.isSolve=='1'?'已解决':'未解决'}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="isNightWork" label="白班/夜班" >
          <template scope="scope">
            <span>{{scope.row.isNightWork=='0'?'白班':'夜班'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="faultType" label="故障类别" >
        </el-table-column>
        <el-table-column prop="faultSystem" label="故障系统"  width="120">
        </el-table-column>
        <el-table-column label="操作" class-name="clickItem">
          <template scope="scope">
            <span class="cancelButton" @click.stop="goDetail(scope.row)">编辑</span>
            <!-- <span class="cancelButton" @click.stop="deleteBreakDown([scope.row.id])">删除</span> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pageBox clearfix" v-show="searchData.length>0">
        <!-- <span v-show="selList.length!=0" class="bottomDel">已选<i>{{selList.length}}</i>条记录<i @click="deleteSel">删除</i></span> -->
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
      faultTypes:[],
      faultSystems:[],
      searchData: [],
      empNames: [],
      deptMajorNames: [],
      value: '',
      value1: '',
      reserveDate: '',
      deptMajorIdValue:"",
      faultDealEmpName:"",
      reserveDate: '',
      testprops:{
        value:"name",
        label:"name"
      },
      faultDeal:{
        value:"empName",
        label:"empName"
      },
       Deptprops:{
        value:"budgetDeptName",
        label:"budgetDeptName"
      },
      searchParams: {
        "pageSize": 10,
        "pageNumber": 1,
        "operatorName": "",
        "deptMajorId": "",
        "faultSystem": "",
        "isNightWork": "",
        "isSolve": "",
        "isFeedback1": "",
        "isFeedback": "",
        "startTime": "",
        "endTime": "",
        "faultType": "",
        "faultDealEmpName": "",
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
      'baseURL'
    ])
  },
  created() {
    this.getData();
    this.faultType();
    this.faultSystem();
  },
  activated() {
    this.getData();
  },
  components: {

  },
  methods: {
     exportExcel(){
        // console.log(this.baseURL+"/fault/exportFault?isNightWork="+this.searchParams.isNightWork+"&startTime="+this.searchParams.startTime +"&endTime="+this.searchParams.endTime+"&operatorName="+this.userInfo.name+"&isFeedback1="+this.searchParams.isFeedback1+"&isSolve="+this.searchParams.isSolve+"&isFeedback="+this.searchParams.isFeedback+"&faultType="+this.searchParams.faultType+"&faultSystem="+this.searchParams.faultSystem+"&deptMajorId="+this.searchParams.deptMajorId+"&faultDealEmpName="+this.searchParams.faultDealEmpName)
        
        window.open(this.baseURL+"/fault/exportFault?isNightWork="+this.searchParams.isNightWork+"&startTime="+this.searchParams.startTime +"&endTime="+this.searchParams.endTime+"&operatorName="+this.userInfo.name+"&isFeedback1="+this.searchParams.isFeedback1+"&isSolve="+this.searchParams.isSolve+"&isFeedback="+this.searchParams.isFeedback+"&faultType="+this.searchParams.faultType+"&faultSystem="+this.searchParams.faultSystem+"&deptMajorId="+this.searchParams.deptMajorId+"&faultDealEmpName="+this.searchParams.faultDealEmpName)
      },
      handleSelectDeal(item) {
        // this.getEmpBankAccount(item.empId);
        // this.searchParams.faultDealEmpName=item.empId;
        
      },
      handleSelectDeptMajorId(item) {
        // this.getEmpBankAccount(item.empId);
        this.searchParams.deptMajorId=item.budgetDeptCode;
        
      },
    querySearchAsyncDeal(queryString, cb) {
         if(this.faultDealEmpName=="")
         this.searchParams.faultDealEmpName="";
         this.$http.post('/fault/getfaultDealEmpNames', { 
            // name:this.operatorId,
            // pageSize:100,
         })
        .then(res => {
          if (res.status == 0) {
          if(res.data)
            for(var i=0;i<res.data.length;i++){
              this.empNames[i]=res.data[i];
            }
          }
        })
        this.restaurants=this.empNames;
        var restaurants = this.restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb( queryString ? restaurants.filter(this.createStateFilterDeal(queryString)) : restaurants);
        }, 500);
      },
       createStateFilterDeal(queryString) {
        return (state) => {
          return (state.empName.indexOf(queryString.toLowerCase()) >-1 );
        };
      },
        createStateFilter(queryString) {
        return (state) => {
          return (state.name.indexOf(queryString.toLowerCase()) >-1 );
        };
      },
      querySearchAsyncDeptMajorId(queryString, cb) {
         if(this.deptMajorIdValue=="")
         this.searchParams.deptMajorId="";
         this.$http.post('/doc/getBudItemTreeList', { 
         })
        .then(res => {
          if (res.status == 0) {
          if(res.data)
            for(var i=0;i<res.data.length;i++){
              this.deptMajorNames[i]=res.data[i];
            }
          }
        })
        console.log(this.deptMajorNames)
        this.restaurant=this.deptMajorNames;
        var restaurant = this.restaurant;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb( queryString ? restaurant.filter(this.createStateFilterDept(queryString)) : restaurant);
        }, 500);
      },
    createStateFilterDept(queryString) {
      return (state) => {
        return (state.budgetDeptName.indexOf(queryString.toLowerCase()) >-1 );
      };
    },
    faultType(){
       this.$http.post('/api/getDict', { dictCode: 'FAU02' })
        .then(res => {
          if (res.status == '0') {
            this.faultTypes = res.data;
          } else {

          }
        }, res => {

        })
    },
    faultSystem(){
       this.$http.post('/api/getDict', { dictCode: 'FAU03' })
        .then(res => {
          if (res.status == '0') {
            this.faultSystems = res.data;
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
      this.searchParams.operatorName=this.userInfo.name;
      this.searchParams.faultDealEmpName=this.faultDealEmpName;
       this.$http.post("/emp/getEmpInfoById", {id: this.userInfo.empId})
        .then(res => {
          if (res.status == 0) {
            this.searchParams.operatorName=res.data.name;
            this.$http.post("/fault/getFaultInfoList", this.searchParams, { body: true }).then(res => {
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
              }
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
      this.deleteBreakDown(ids);
    },
    // deleteBreakDown(ids) {
    //   this.$confirm('确定删除所选短信记录?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     this.$http.post('/tSmsSend/deleteById', ids,{body:true})
    //       .then(res => {
    //         if (res.status == 0) {
    //           this.$message.success('删除成功');
    //           this.searchParams.pageNumber = 1;
    //           this.getData();
    //         } else {
    //           this.$message.warning('删除失败')
    //         }
    //       })
    //   }).catch(() => {

    //   });
    // },
    goDetail(row) {
      this.$router.push('/breakDown/breakDownDetail/' + row.id)
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
#myBreakDown {
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
