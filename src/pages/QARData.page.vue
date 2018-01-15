<template>
  <div id="flightException" >
    <div >
    <search-data :title="topTitle" @search="setReport" @searchTwo="setReportTwo" hasOverTime></search-data>
        <el-table :data="recordData" stripe style="width: 100%" :fit="true" v-loading.body="searchLoading" >
        <el-table-column prop="flightNo" label="航班号" width="90">
        </el-table-column>

        <el-table-column prop="flightDateStr" label="航班日期" width="115">
            <template scope="scope">
                <span>{{ scope.row.flightDateStr}}</span>
            </template>
        </el-table-column>

       
       

         <el-table-column prop="engon" label="开车时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.engon}}</span>
            </template>
        </el-table-column>

         <el-table-column prop="takeoffTime" label="起飞时间" width="100">
             <template scope="scope">
                <span>{{ scope.row.takeoffTime}}</span>
            </template>
        </el-table-column>

        


        <el-table-column prop="landingTime" label="落地时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.landingTime}}</span>
            </template>
        </el-table-column>

       

        <el-table-column prop="engoff" label="关车时间" width="100">
            <template scope="scope">
                <span>{{ scope.row.engoff}}</span>
            </template>
        </el-table-column>

          <el-table-column prop="engTime" label="开关车时间差" width="120">
             <template scope="scope">
                <span>{{ scope.row.engTime}}</span>
            </template>
        </el-table-column>

      

        <el-table-column prop="fromAptCh" label="出发地" width="130">
        </el-table-column>





        <el-table-column prop="toAptCh" label="目的地" width="130">
        </el-table-column>

         <el-table-column prop="aircraftregn" label="飞机号" >
        </el-table-column>


        </el-table>
        <div class="pageBox" >
            <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
            </el-pagination>
        </div>
    
    
  </div>
  </div>
</template>
<script>
import searchData  from '../components/searchQAR.component'
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
        "fromApt": "",
        "toApt": "",
        "flightNo":"",
       
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
    searchData,
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
      this.topTitle="QAR数据展示"+" "+this.params.beginTime+"到"+this.params.endTime;
      var that = this;
      that.searchLoading = true;
      var params = Object.assign(this.params);
      console.log(params)
      this.$http.post("/foc/getQBR?pageNumber="+this.pageNumber+"&pageSize=10", params, { body: true }).then(res => {
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
