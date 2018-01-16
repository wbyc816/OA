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

       

         

         <el-table-column prop="diffEngonTime" label="滑出时间" width="120">
            <template scope="scope">
                <span v-if="scope.row.diffEngonTime_sts==1" style="color:red">{{ scope.row.diffEngonTime}}分钟</span>
                <span v-if="scope.row.diffEngonTime_sts==0">{{ scope.row.diffEngonTime}}分钟</span>
            </template>
        </el-table-column>

         <el-table-column prop="acarsAtd" label="A起飞时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.acarsAtd | time('hours')}}</span>
            </template>
        </el-table-column>

        

         <el-table-column prop="takeoffTime" label="Q起飞时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.takeoffTime | time('hours')}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="diffTakeoffTime" label="起飞差值时间" width="120">
            <template scope="scope">
                <span v-if="scope.row.diffTakeoffTime_sts==1" style="color:red">{{ scope.row.diffTakeoffTime}}分钟</span>
                <span v-if="scope.row.diffTakeoffTime_sts==0">{{ scope.row.diffTakeoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="acarsAta" label="A降落时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.acarsAta | time('hours')}}</span>
            </template>
        </el-table-column>

       

        <el-table-column prop="landingTime" label="Q降落时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.landingTime | time('hours')}}</span>
            </template>
        </el-table-column>

          <el-table-column prop="diffLandingTime" label="降落差值时间" width="120">
             <template scope="scope">
                <span v-if="scope.row.diffLandingTime_sts==1" style="color:red">{{ scope.row.diffLandingTime}}分钟</span>
                <span v-if="scope.row.diffLandingTime_sts==0">{{ scope.row.diffLandingTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="aEngoffTime" label="A关车时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.aEngoffTime }}</span>
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

         

         <el-table-column prop="diffEngonTime" label="滑出时间" width="130">
            <template scope="scope">
                <span v-if="scope.row.diffEngonTime_sts==1" style="color:red">{{ scope.row.diffEngonTime}}分钟</span>
                <span v-if="scope.row.diffEngonTime_sts==0">{{ scope.row.diffEngonTime}}分钟</span>
            </template>
        </el-table-column>

         <el-table-column prop="acarsAtd" label="A起飞时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.acarsAtd | time('hours')}}</span>
            </template>
        </el-table-column>

        

         <el-table-column prop="takeoffTime" label="Q起飞时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.takeoffTime | time('hours')}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="diffTakeoffTime" label="起飞差值时间" width="130">
            <template scope="scope">
                <span v-if="scope.row.diffTakeoffTime_sts==1" style="color:red">{{ scope.row.diffTakeoffTime}}分钟</span>
                <span v-if="scope.row.diffTakeoffTime_sts==0">{{ scope.row.diffTakeoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="acarsAta" label="A降落时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.acarsAta | time('hours')}}</span>
            </template>
        </el-table-column>

       

        <el-table-column prop="landingTime" label="Q降落时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.landingTime | time('hours')}}</span>
            </template>
        </el-table-column>

          <el-table-column prop="diffLandingTime" label="降落差值时间" width="130">
             <template scope="scope">
                <span v-if="scope.row.diffLandingTime_sts==1" style="color:red">{{ scope.row.diffLandingTime}}分钟</span>
                <span v-if="scope.row.diffLandingTime_sts==0">{{ scope.row.diffLandingTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="aEngoffTime" label="A关车时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.aEngoffTime }}</span>
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

    getDate(){
      this.params.endTime=util.formatTime((new Date()).getTime(), 'yyyy-MM-dd');
      this.params.beginTime= util.formatTime((new Date()).getTime() - 3600 * 1000 * 24 *30, 'yyyy-MM-dd');
      // console.log(this.params.beginTime)
    },
    getFlightTrends() {
      this.$http.post('/index/getFlightTrends', { flightDate: this.timeFilter(new Date().getTime(), 'date') })
        .then(res => {
          this.flightTrends = res.data;
        //   console.log(6666)
        //   console.log( this.flightTrends)

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

}

</style>
