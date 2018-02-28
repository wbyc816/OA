<template>
  <div id="flightException" >
    <div >
    <search-exception :title="topTitle" @search="setReport" @searchTwo="setReportTwo" hasOverTime></search-exception>
        <el-table :data="recordData" stripe style="width: 100%" :fit="true" v-loading.body="searchLoading" >
        <el-table-column prop="flightNo" label="航班号" width="90">
        </el-table-column>

        <el-table-column prop="flightDate" label="航班日期" width="115">
            <template scope="scope">
                <span>{{ scope.row.flightDate | time('date')}}</span>
            </template>
        </el-table-column>

         <el-table-column prop="acReg" label="机号" width="90">
        </el-table-column>

        <el-table-column prop="out" label="A滑出时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.out | time('hours')}}</span>
            </template>
        </el-table-column>

          <el-table-column prop="taxiTime" label="Q滑出时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.taxiTime | time('hours')}}</span>
            </template>
        </el-table-column>

         <el-table-column prop="diffEngonTime" label="滑出差值时间" width="120">
            <template scope="scope">
                <span v-if="scope.row.diffEngonTime_sts==1" style="color:red">{{ scope.row.diffEngonTime}}分钟</span>
                <span v-if="scope.row.diffEngonTime_sts==0">{{ scope.row.diffEngonTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="aEngoffTime" label="A关车时间" width="100">
            <template scope="scope">
                <span>{{ Date.parse(new Date(scope.row.aEngoffTime)) | time("hours") }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="engoffTime" label="Q关车时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.engoffTime | time('hours')}}</span>
            </template>
        </el-table-column>

            <el-table-column prop="diffEngoffTime" label="关车差值时间" width="120" >
            <template scope="scope">
                <span v-if="scope.row.diffEngoffTime_sts==1" style="color:red">{{ scope.row.diffEngoffTime}}分钟</span>
                <span v-if="scope.row.diffEngoffTime_sts==0">{{ scope.row.diffEngoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="departureAirportName" label="出发地" width="130">
        </el-table-column>

         <el-table-column prop="departure3Code" label="出发地三字码" width="120">
        </el-table-column>

        <el-table-column prop="arrivalAirportName" label="目的地" width="130">
        </el-table-column>

         <el-table-column prop="arrival3Code" label="目的地三字码" width="120">
        </el-table-column>

        <el-table-column prop="leftPersonName" label="机组人员" width="200">
             <template scope="scope">
                <span>{{ scope.row.pilot}} {{ scope.row.copilot}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="diffFlightTime" label="飞行时间" width="100">
            <template scope="scope">
                <span>{{scope.row.diffFlightTime}} 分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="aAIRTime" label="A空中时间" width="120">
            <template scope="scope">
               <span>{{scope.row.aAIRTime}} 分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="qAIRTime" label="Q空中时间" width="120">
            <template scope="scope">
               <span>{{scope.row.qAIRTime}} 分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="diffAirTime" label="空中时间差值" width="120">
            <template scope="scope">
                <span v-if="scope.row.diffAirTime_sts==1" style="color:red">{{ scope.row.diffAirTime}}分钟</span>
                <span v-if="scope.row.diffAirTime_sts==0">{{ scope.row.diffAirTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" width="115">
            <template scope="scope">
               <el-input name="remark" v-model="scope.row.remark" style="border:0px" :readonly="readonlyOne" ></el-input>
            </template>
        </el-table-column>

        <el-table-column  label="操作" width="200">
          <template scope="scope">
            <el-button @click.native.prevent="editTableOne(scope)" type="text" size="small">编辑
            </el-button>
            <el-button @click.native.prevent="saveTableOne(scope)" type="text" size="small">保存
            </el-button>
          </template>
        </el-table-column>

        </el-table>
        <div class="pageBox" >
            <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
        </div>

        <div slot="header">
        <div style="background:white;font-size:18px;padding:10px">{{bottomTitle}}</div>
        </div>

        <el-table :data="compareData" stripe style="width: 100%" :fit="true" v-loading.body="searchLoading">
        <el-table-column prop="flightNo" label="航班号" width="90">
        </el-table-column>

        <el-table-column prop="flightDate" label="航班日期" width="115">
            <template scope="scope">
                <span>{{ scope.row.flightDate | time('date')}}</span>
            </template>
        </el-table-column>

         <el-table-column prop="acReg" label="机号" width="90">
        </el-table-column>

        <el-table-column prop="out" label="A滑出时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.out | time('hours')}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="taxiTime" label="Q滑出时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.taxiTime | time('hours')}}</span>
            </template>
        </el-table-column>

         <el-table-column prop="diffEngonTime" label="滑出差值时间" width="130">
            <template scope="scope">
                <span v-if="scope.row.diffEngonTime_sts==1" style="color:red">{{ scope.row.diffEngonTime}}分钟</span>
                <span v-if="scope.row.diffEngonTime_sts==0">{{ scope.row.diffEngonTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="aEngoffTime" label="A关车时间" width="100">
            <template scope="scope">
                <span>{{ Date.parse(new Date(scope.row.aEngoffTime)) | time("hours") }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="engoffTime" label="Q关车时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.engoffTime | time('hours')}}</span>
            </template>
        </el-table-column>

            <el-table-column prop="diffEngoffTime" label="关车差值时间" width="130" >
            <template scope="scope">
                <span v-if="scope.row.diffEngoffTime_sts==1" style="color:red">{{ scope.row.diffEngoffTime}}分钟</span>
                <span v-if="scope.row.diffEngoffTime_sts==0">{{ scope.row.diffEngoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="departureAirportName" label="出发地" width="130">
        </el-table-column>

        <el-table-column prop="departure3Code" label="出发地三字码" width="120">
        </el-table-column>

        <el-table-column prop="arrivalAirportName" label="目的地" width="130">
        </el-table-column>

        <el-table-column prop="arrival3Code" label="目的地三字码" width="120">
        </el-table-column>

        <el-table-column prop="leftPersonName" label="机组人员" width="200">
             <template scope="scope">
                <span>{{ scope.row.pilot}} {{ scope.row.copilot}}</span>
            </template>
        </el-table-column>

          <el-table-column prop="diffFlightTime" label="飞行时间" width="100">
            <template scope="scope">
                <span>{{scope.row.diffFlightTime}} 分钟</span>
            </template>
        </el-table-column>

         <el-table-column prop="aAIRTime" label="A空中时间" width="120">
            <template scope="scope">
               <span>{{scope.row.aAIRTime}} 分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="qAIRTime" label="Q空中时间" width="120">
            <template scope="scope">
               <span>{{scope.row.qAIRTime}} 分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="diffAirTime" label="空中时间差值" width="120">
            <template scope="scope">
                <span >{{ scope.row.diffAirTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" width="115">
            <template scope="scope">
               <el-input name="remarkTwo" v-model="scope.row.remark" style="border:0px" :readonly="readonlyOne" ></el-input>
            </template>
        </el-table-column>

        <el-table-column  label="操作" width="200">
          <template scope="scope">
            <el-button @click.native.prevent="editTableTwo(scope)" type="text" size="small">编辑
            </el-button>
            <el-button @click.native.prevent="saveTableOne(scope)" type="text" size="small">保存
            </el-button>
          </template>
        </el-table-column>

        </el-table>
    
    
    <div class="pageBox" >
      <el-pagination @current-change="handleCurrentChangeTwo" :current-page="params.pageNumberTwo" :page-size="20" layout="total, prev, pager, next, jumper" :total="totalSizeTwo">
      </el-pagination>
    </div>

    
    
  </div>
  </div>
</template>
<script>
import searchException  from '../components/searchException.component'
import { docConfig } from '../common/docConfig'
import { mapGetters } from 'vuex'



import util from '../common/util'
export default {
  
 
  data() {
    return {
      tableData:[],
      tip:"",
      contractView: false,
      pageNumber:1,
      pageNumberTwo:1,
      sortoil:{},
      topTitle:"",
      bottomTitle:"",
      params: {
        "beginTime":"",
        "endTime": "",
        "departureAirport": "",
        "arrivalAirport": "",
        "flightNo":"",
        "acReg":"",
       
      },
      beginTime:"",
      endTime:"",
      fiveBeginTime:"",
      fiveEndTime:"",
      recordData: [],
      compareData:[],
      clickSearch:false,
      totalSize: 0,
      totalSizeTwo: 0,
      searchLoading: false,
      readonlyOne:true,
      readonlyTwo:true,
      input__inner_two:false,
      remark:"",
      flightTrends: {
        "sumFlight": 0,
        "departure": 0,
        "arrival": 0,
        "delay": 0,
        "controlDelay": 0,
        "busyAirportDelay": 0,
        "securityDelay": 0,
        "sumDelay": 0
      },
    //   searchOptions: {isOverTime:''}
    }
  },
  mounted() {
    //   this.editTableOne();
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'urgency',
    ])
  },
  components: {
    searchException,
  },
  created() {
    this.getDate();
    this.getData();
    this.getFlightTrends();
  },
  methods: {
    editTableOne(scope){
        if(scope){
            var index=scope.$index;
            var rel=document.getElementsByName("remark");
            for(var i=0;i<rel.length;i++){
                document.getElementsByName("remark")[i].setAttribute("readonly","true")
                // document.getElementsByName("remark")[i].style.border="0px solid #ccc";
            }
            document.getElementsByName("remark")[index].removeAttribute("readonly");
            document.getElementsByName("remark")[index].style.border="1px solid #ccc";

        }else{
            var rel=document.getElementsByName("remark");
            console.log(rel.length)
            for(var i=0;i<rel.length;i++){
                document.getElementsByName("remark")[i].setAttribute("readonly","true")
                document.getElementsByName("remark")[i].style.border="0px solid #ccc";
            }
        }
    },
    saveTableOne(scope){
        this.$http.post('/foc/updateRemark', { id: scope.row.flightId,remark:scope.row.remark })
        .then(res => {
          if(res.status==0){
            this.$message('备注修改成功');
          }else{
            this.$message('备注修改失败');
          }
          
        })
    },

    editTableTwo(scope){
        var index=scope.$index;
        var rel=document.getElementsByName("remarkTwo");
        for(var i=0;i<rel.length;i++){
            document.getElementsByName("remarkTwo")[i].setAttribute("readonly","true")
            // document.getElementsByName("remark")[i].style.border="0px solid #ccc";
        }
        document.getElementsByName("remarkTwo")[index].removeAttribute("readonly");
        document.getElementsByName("remarkTwo")[index].style.border="1px solid #ccc";
    },
    getDate(){
      this.params.endTime=util.formatTime((new Date()).getTime(), 'yyyy-MM-dd');
      this.params.beginTime= util.formatTime((new Date()).getTime() - 3600 * 1000 * 24 *30, 'yyyy-MM-dd');
      // console.log(this.params.beginTime)
    },
    getFlightTrends() {
      this.$http.post('/index/getFlightTrends', { flightDate: this.timeFilter(new Date().getTime(), 'date') })
        .then(res => {
          this.flightTrends = res.data;
      })
    },
    getData() {
      this.topTitle="飞行计划任务书数据监控"+" "+this.params.beginTime+"到"+this.params.endTime;
      this.bottomTitle="飞行计划任务书数据异常报表"+" "+this.params.beginTime+"到"+this.params.endTime;
      var that = this;
      that.searchLoading = true;
      var params = Object.assign(this.params);
      console.log(params)
      this.$http.post("/foc/getQAR?pageNumber="+this.pageNumber+"&pageSize=10", params, { body: true }).then(res => {
        setTimeout(function() {
        that.searchLoading = false;

        }, 200)
        if (res.status == 0) {
           that.searchLoading = false;
          
       
          this.recordData = res.data.records;
          this.totalSize = res.data.total;
        //  this.graphdata.datasets[0].data.push(0.5);
          
        // console.log(this.recordData.length)
        } else {
          this.recordData = [];
          this.totalSize = 0;
        }
        }, res => {

        })

        this.$http.post("/foc/getUnusual?pageNumber="+this.pageNumberTwo+"&pageSize=20", params, { body: true }).then(res => {
        setTimeout(function() {
        that.searchLoading = false;

        }, 200)
        if (res.status == 0) {
           that.searchLoading = false;
          this.compareData = res.data.records;
          this.totalSizeTwo = res.data.total;
        //  this.graphdata.datasets[0].data.push(0.5);
          
        // console.log(this.recordData.length)
        } else {
          this.compareData = [];
          this.totalSizeTwo = 0;
        }
        }, res => {

        })

    },
    getProcess(id) {
      this.$store.dispatch('getTaskDetail', id);
    },
    formatter(row, column, cellValue) {
      switch (cellValue) {
        case "start":
          return "发起";
          break;
        case 'task':
          return "批核";
          break;
        case 'trans':
          return "转发";
          break;
        case 'end':
          return "归档";
          break;

        default:
          return cellValue;
      }
    },
    handleCurrentChange(page) {
      this.pageNumber = page;
      this.getData()
    },
    handleCurrentChangeTwo(page) {
      this.pageNumberTwo = page;
      this.getData()
    },
    setReport(options) {
      this.beginTime=options.beginTime;
      this.endTime=options.endTime;
      this.params = options;
      if(options.flightNo)
      this.params.flightNo="DZ"+options.flightNo;
      if(options.acReg)
      this.params.acReg="B"+options.acReg;
      console.log(this.params)
      this.getData();
      this.clickSearch=true,
      this.searchLoading = true;
       },
    setReportTwo(options) {
      console.log(options)
     }
  }
}

</script>

<style lang='scss'>
$purple: #0460AE;
#flightException {
  .pageBox {
    text-align: right;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  margin-bottom:30px;
  .el-input__inner {
    //   border:0px;
      background: transparent;
  }
//   .el-input__inner_two {
//       border:1px solid red;
//       background: transparent;
//   }

}

</style>
