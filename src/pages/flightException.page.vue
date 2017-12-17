<template>
  <div id="flightException" >
    <div >
    <search-exception title="飞行计划书数据异常报表" @search="setReport" @searchTwo="setReportTwo" hasOverTime></search-exception>
        <el-table :data="recordData" stripe style="width: 100%" :fit="true" v-loading.body="searchLoading" v-if="first">
        <el-table-column prop="flightNo" label="航班号" width="90">
        </el-table-column>

        <el-table-column prop="flightDate" label="航班日期" width="115">
            <template scope="scope">
                <span>{{ scope.row.flightDate | time('date')}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="out" label="A滑出时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.out | time('second')}}</span>
            </template>
        </el-table-column>

       

         <el-table-column prop="engonTime" label="Q开车时间" width="130">
             <template scope="scope">
                <span>{{ scope.row.engonTime | time('second')}}</span>
            </template>
        </el-table-column>

         <el-table-column prop="diffEngonTime" label="开车差值时间" width="130">
            <template scope="scope">
                <span v-if="scope.row.diffEngonTime_sts==1" style="color:red">{{ scope.row.diffEngonTime}}分钟</span>
                <span v-if="scope.row.diffEngonTime_sts==0">{{ scope.row.diffEngonTime}}分钟</span>
            </template>
        </el-table-column>

         <el-table-column prop="acarsAtd" label="A起飞时间" width="130">
             <template scope="scope">
                <span>{{ scope.row.acarsAtd | time('second')}}</span>
            </template>
        </el-table-column>

        

         <el-table-column prop="takeoffTime" label="Q起飞时间" width="130">
             <template scope="scope">
                <span>{{ scope.row.takeoffTime | time('second')}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="diffTakeoffTime" label="起飞差值时间" width="130">
            <template scope="scope">
                <span v-if="scope.row.diffTakeoffTime_sts==1" style="color:red">{{ scope.row.diffTakeoffTime}}分钟</span>
                <span v-if="scope.row.diffTakeoffTime_sts==0">{{ scope.row.diffTakeoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="acarsAta" label="A降落时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.acarsAta | time('second')}}</span>
            </template>
        </el-table-column>

       

        <el-table-column prop="landingTime" label="Q落地时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.landingTime | time('second')}}</span>
            </template>
        </el-table-column>

          <el-table-column prop="diffLandingTime" label="降落差值时间" width="130">
             <template scope="scope">
                <span v-if="scope.row.diffLandingTime_sts==1" style="color:red">{{ scope.row.diffLandingTime}}分钟</span>
                <span v-if="scope.row.diffLandingTime_sts==0">{{ scope.row.diffLandingTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="inn" label="A滑入时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.inn | time('second')}}</span>
            </template>
        </el-table-column>

    
        

        <el-table-column prop="engoffTime" label="Q关车时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.engoffTime | time('second')}}</span>
            </template>
        </el-table-column>

            <el-table-column prop="diffEngoffTime" label="关车差值时间" width="130" >
            <template scope="scope">
                <span v-if="scope.row.diffEngoffTime_sts==1" style="color:red">{{ scope.row.diffEngoffTime}}分钟</span>
                <span v-if="scope.row.diffEngoffTime_sts==0">{{ scope.row.diffEngoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="departureAirportName" label="起飞机场四字码" width="130">
        </el-table-column>

        <el-table-column prop="arrivalAirportName" label="到达机场四字码" width="130">
        </el-table-column>

        <el-table-column prop="leftPersonName" label="机组人员" width="200">
             <template scope="scope">
                <span>{{ scope.row.pilot}} {{ scope.row.copilot}}</span>
            </template>
        </el-table-column>

        </el-table>

        <el-table :data="recordData" stripe style="width: 100%" :fit="true" v-loading.body="searchLoading" v-if="!first">
        <el-table-column prop="flightNo" label="航班号" width="90">
        </el-table-column>

        <el-table-column prop="flightDate" label="航班日期" width="115">
            <template scope="scope">
                <span>{{ scope.row.flightDate | time('date')}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="out" label="A滑出时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.out | time('second')}}</span>
            </template>
        </el-table-column>

       

         <el-table-column prop="engonTime" label="Q开车时间" width="130">
             <template scope="scope">
                <span>{{ scope.row.engonTime | time('second')}}</span>
            </template>
        </el-table-column>

         <el-table-column prop="diffEngonTime" label="开车差值时间" width="130">
            <template scope="scope">
                <span v-if="scope.row.diffEngonTime_sts==1" style="color:red">{{ scope.row.diffEngonTime}}分钟</span>
                <span v-if="scope.row.diffEngonTime_sts==0">{{ scope.row.diffEngonTime}}分钟</span>
            </template>
        </el-table-column>

         <el-table-column prop="acarsAtd" label="A起飞时间" width="130">
             <template scope="scope">
                <span>{{ scope.row.acarsAtd | time('second')}}</span>
            </template>
        </el-table-column>

        

         <el-table-column prop="takeoffTime" label="Q起飞时间" width="130">
             <template scope="scope">
                <span>{{ scope.row.takeoffTime | time('second')}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="diffTakeoffTime" label="起飞差值时间" width="130">
            <template scope="scope">
                <span v-if="scope.row.diffTakeoffTime_sts==1" style="color:red">{{ scope.row.diffTakeoffTime}}分钟</span>
                <span v-if="scope.row.diffTakeoffTime_sts==0">{{ scope.row.diffTakeoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="acarsAta" label="A降落时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.acarsAta | time('second')}}</span>
            </template>
        </el-table-column>

       

        <el-table-column prop="landingTime" label="Q落地时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.landingTime | time('second')}}</span>
            </template>
        </el-table-column>

          <el-table-column prop="diffLandingTime" label="降落差值时间" width="130">
             <template scope="scope">
                <span v-if="scope.row.diffLandingTime_sts==1" style="color:red">{{ scope.row.diffLandingTime}}分钟</span>
                <span v-if="scope.row.diffLandingTime_sts==0">{{ scope.row.diffLandingTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="inn" label="A滑入时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.inn | time('second')}}</span>
            </template>
        </el-table-column>

    
        

        <el-table-column prop="engoffTime" label="Q关车时间" width="130">
            <template scope="scope">
                <span>{{ scope.row.engoffTime | time('second')}}</span>
            </template>
        </el-table-column>

            <el-table-column prop="diffEngoffTime" label="关车差值时间" width="130" >
            <template scope="scope">
                <span v-if="scope.row.diffEngoffTime_sts==1" style="color:red">{{ scope.row.diffEngoffTime}}分钟</span>
                <span v-if="scope.row.diffEngoffTime_sts==0">{{ scope.row.diffEngoffTime}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="departureAirportName" label="起飞机场四字码" width="130">
        </el-table-column>

        <el-table-column prop="arrivalAirportName" label="到达机场四字码" width="130">
        </el-table-column>

        <el-table-column prop="leftPersonName" label="机组人员" width="200">
             <template scope="scope">
                <span>{{ scope.row.pilot}} {{ scope.row.copilot}}</span>
            </template>
        </el-table-column>

        </el-table>
 
    
    <div class="pageBox" v-show="recordData.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
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
  name: 'highchartsContainer',
 
  data() {
    return {
      first:true,
      tableData:[],
      tip:"",
      contractView: false,
      pageNumber:1,
      sortoil:{},
      params: {
       "beginTime": "",
        "endTime": "",
        "departureAirport": "",
        "arrivalAirport": "",
        "leftPersonName": "",
        "rightPersonName": "",
        "controlPersonName": "",
      },
      beginTime:"",
      endTime:"",
      fiveBeginTime:"",
      fiveEndTime:"",
      recordData: [],
      clickSearch:false,
      totalSize: 0,
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
    this.getData();
    this.getFlightTrends();
  },
  methods: {

   
    getFlightTrends() {
      this.$http.post('/index/getFlightTrends', { flightDate: this.timeFilter(new Date().getTime(), 'date') })
        .then(res => {
          this.flightTrends = res.data;
        //   console.log(6666)
        //   console.log( this.flightTrends)

   })
    },
    getData() {
      var that = this;
     that.searchLoading = true;
      var params = Object.assign(this.params);
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
    setReport(options) {
      this.beginTime=options.beginTime;
      this.endTime=options.endTime;
      this.params = options;
      this.getData();
      this.clickSearch=true,
      this.searchLoading = true;
       },
    setReportTwo(options) {
      this.first=options.first;
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
  }
  margin-bottom:30px;

}

</style>
