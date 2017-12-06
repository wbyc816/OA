<template>
  <div id="flightReport" >
    <search-report title="飞行报表" @search="setReport" hasOverTime></search-report>
        <el-table :data="recordData" stripe style="width: 100%" :fit="true" v-loading.body="searchLoading">
        <el-table-column prop="controlPersonName" label="姓名" width="90">
        </el-table-column>
        <el-table-column prop="flightDate" label="日期" width="115">
            <template scope="scope">
                <span>{{ scope.row.flightDate | time('date')}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="flightNo" label="航班号" width="90">
        </el-table-column>
        <el-table-column prop="departureAirportName" label="起飞四码" width="130">
        </el-table-column>

        <el-table-column prop="arrivalAirportName" label="到达四码" width="130">
        </el-table-column>
        <el-table-column prop="acReg" label="机号" >
        </el-table-column>
        <el-table-column prop="atd" label="起飞时间" width="115">
            <template scope="scope">
                <span>{{ scope.row.atd | time('date')}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="ata" label="到达时间" width="115">
            <template scope="scope">
                <span>{{ scope.row.ata | time('date')}}</span>
            </template>
        </el-table-column>
        
        <!-- <el-table-column prop="empName" label="岗位" >
        </el-table-column> -->
        <el-table-column prop="flyHours" label="飞行时间" width="115">
            <template scope="scope">
                <span>{{ scope.row.flyHours?scope.row.flyHours:0}}分钟</span>
            </template>
        </el-table-column>
        <el-table-column prop="landHours" label="地面时间" width="115">
            <template scope="scope">
                <span>{{ scope.row.landHours?scope.row.landHours:0}}分钟</span>
            </template>
        </el-table-column>
        <el-table-column prop="airHours" label="空中时间" width="115">
            <template scope="scope">
                <span>{{scope.row.airHours?scope.row.airHours:0}}分钟</span>
            </template>
        </el-table-column>

        <el-table-column prop="nightHours" label="夜航时间" width="115">
            <template scope="scope">
                <span>{{ scope.row.nightHours?scope.row.nightHours:0}}分钟</span>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="deptName" label="左座时间">
        </el-table-column>
        <el-table-column prop="jobtitle" label="右座时间">
        </el-table-column> -->
        <!-- <el-table-column prop="mobileNumber" label="承包时间">
        </el-table-column> -->

        <el-table-column prop="updown" label="操纵次数" width="90">
        </el-table-column>
        <el-table-column prop="chargeHour" label="计费时间" width="120">
           <template scope="scope">
                <span>{{ scope.row.chargeHour?scope.row.chargeHour:0}}分钟</span>
            </template>
        </el-table-column>
        <el-table-column  label="耗油量" >
            <template scope="scope">
                <span>{{scope.row.oil}}L</span>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="distance" label="距离" >
        </el-table-column> -->
        <el-table-column prop="takeoffWeight" label="飞行高度" width="90">
        </el-table-column>

        </el-table>
 
    
    <div class="pageBox" v-show="recordData.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
    <div ref="highchartsContainerOne" id="highchartsContainerOne" v-show="clickSearch" v-loading.body="searchLoading"></div>
    <div ref="highchartsContainerTwo" id="highchartsContainerTwo" v-show="clickSearch" v-loading.body="searchLoading"></div>
    <div ref="highchartsContainerThree" id="highchartsContainerThree" v-show="clickSearch" v-loading.body="searchLoading"></div>
    <div ref="highchartsContainerFour" id="highchartsContainerFour" v-show="clickSearch" v-loading.body="searchLoading"></div>
    <div ref="highchartsContainerFive" id="highchartsContainerFive"  v-show="clickSearch" v-loading.body="searchLoading"></div>
    <div  id="getTip" @click="getTip" style="display:none" ></div>
    <div  id="getTipTwo" @click="getTipTwo" style="display:none" ></div>
    <div  id="getTipThree" @click="getTipThree" style="display:none" ></div>
  </div>
  
</template>
<script>
import searchReport from '../components/searchReport.component'
import { docConfig } from '../common/docConfig'
import { mapGetters } from 'vuex'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';

HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);
import HighchartsComponent from '../components/HighchartsComponent.vue';
import util from '../common/util'
export default {
  name: 'highchartsContainer',
 
  data() {
    return {
            stockChart: null,
            chart: {
              type: 'spline'
            },
            optionOne: {
              credits: {  
                enabled:false  
              }, 
              plotOptions: { 
                series: { 
                    cursor: 'pointer', 
                    events: { 
                        click: function(e) { 
                          document.getElementById("getTip").innerHTML=e.point.category;
                          document.getElementById("getTip").click();
                          
                        } 
                    } 
                } 
              }, 
              title: {
                  text:'空中时间'
              },
              xAxis: {
                  categories: []
              },
              yAxis: {
                  title: {
                      text: '单位/min'
                  },
                  lineWidth: 2,
                  lineColor: 'black',
                  id: 'sky'
              },
              series: [
                {
                  name: '空中时间',
                  data: [],
                  color: '#9c9'
                },
                {
                  name: '平均空中时间',
                  data: [],
                  color: 'black'
                },
                  {
                  name: 'Acars空中时间',
                  data: [],
                  color: '#369'
                },
                {
                  name: '平均Acars空中时间',
                  data: [],
                  color: 'red'
                },
                
              ]
            },
            optionTwo: {
              credits: {  
                enabled:false  
              }, 
              plotOptions: { 
                series: { 
                    cursor: 'pointer', 
                    events: { 
                        click: function(e) { 
                          document.getElementById("getTip").innerHTML=e.point.category;
                          document.getElementById("getTip").click();
                          
                        } 
                    } 
                } 
              }, 
              title: {
                  text:'飞行时间'
              },
              xAxis: {
                  categories: []
              },
              yAxis: {
                  title: {
                      text: '单位/min'
                  },
                  lineWidth: 2,
                  lineColor: 'black',
                  id: 'fly'
              },
              series: [
                {
                    name: '飞行时间',
                    data: [],
                    color: '#9c9'
                },
                  {
                    name: '平均飞行时间',
                    data: [],
                    color: 'black'
                },
                  {
                    name: 'Acars飞行时间',
                    data: [],
                    color: '#369'
                },
                  {
                    name: '平均Acars飞行时间',
                    data: [],
                    color: 'red'
                },
                  {
                    name: '承包时间',
                    data: [],
                    color: '#630'
                }
              ]
            },
            optionThree: {
              credits: {  
                enabled:false  
              }, 
              plotOptions: { 
                series: { 
                    cursor: 'pointer', 
                    events: { 
                        click: function(e) { 
                          document.getElementById("getTip").innerHTML=e.point.category;
                          document.getElementById("getTip").click();
                          
                        } 
                    } 
                } 
              }, 
              title: {
                  text:'地面时间'
              },
              xAxis: {
                  categories: []
              },
              yAxis: {
                  title: {
                      text: '单位/min'
                  },
                  lineWidth: 2,
                  lineColor: 'black',
                  id: 'land'
              },
              series: [
                  {
                  name: '地面时间',
                  data: [],
                  color: '#9c9'
                },
                {
                  name: '平均地面时间',
                  data: [],
                  color: 'black'
                },
                {
                  name: 'Acars地面时间',
                  data: [],
                  color: '#369'
                },
                {
                  name: '平均Acars地面时间',
                  data: [],
                  color: 'red'
                }
              ]
            },
            optionFour: {
              credits: {  
                enabled:false  
              }, 
                plotOptions: { 
                series: { 
                    cursor: 'pointer', 
                    events: { 
                        click: function(e) { 
                          document.getElementById("getTipThree").innerHTML=e.point.category+","+e.point.y;
                          document.getElementById("getTipThree").click();
                          
                        } 
                    } 
                } 
              }, 
              title: {
                  text:'耗油量'
              },
              xAxis: {
                  categories: []
              },
              yAxis: {
                  title: {
                      text: '单位/L'
                  },
                  lineWidth: 2,
                  lineColor: 'black',
                  id: 'oil'
              },
              series: [
                {
                    name: '耗油量',
                    data: [],
                    color: '#9c9'
                },
                {
                    name: '平均耗油量',
                    data: [],
                    color: '#369'
                }
              ]
            },
            optionFive: {
              credits: {  
                enabled:false  
              }, 
              plotOptions: { 
                series: { 
                    cursor: 'pointer', 
                    events: { 
                        click: function(e) { 
                          document.getElementById("getTipTwo").innerHTML=e.point.category+","+e.point.y;
                          document.getElementById("getTipTwo").click();

                        } 
                    } 
                } 
              }, 
              title: {
                  text:'耗油量升高排序'
              },
              xAxis: {
                  categories: [],
                  categoriesTwo: []
              },
              yAxis: {
                  title: {
                      text: '单位/L'
                  },
                  lineWidth: 2,
                  lineColor: 'black',
                  id: 'oilsort'
              },
              series: [
                {   type: 'spline',
                    name: '耗油量',
                    data: [],
                    color: '#9c9'
                },
                {   type: 'spline',
                    name: '平均耗油量',
                    data: [],
                    color: '#369'
                }
              ]
            },
            styles: {
              width: 600,
              height: 400
            },
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
    this.initChart();
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'confidentiality',
      'urgency',
    ])
  },
  components: {
    searchReport,HighchartsComponent
  },
  created() {
    this.getData();
    this.getFlightTrends();
  },
  methods: {
    getTip() {
      this.searchLoading = true;
      let params = Object.assign(this.params);
      params.beginTime=document.getElementById("getTip").innerHTML;
      params.endTime=document.getElementById("getTip").innerHTML;
      this.$http.post("/foc/getFocs?pageNumber="+this.pageNumber+"&pageSize=10", params, { body: true }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;

        }, 200)
        if (res.status == 0) {
         ;
         var infor= res.data.records;
         this.tip="操作者:"+infor[0].controlPersonName+" 左座:"+infor[0].leftPersonName+" 右座:"+infor[0].rightPersonName+" 航班号:"+infor[0].flightNo+" 日期："+this.timeFilter(infor[0].flightDate, 'date');
           this.$notify({
            title: '机组详细信息',
            message: this.tip,
            duration: 5000
          })
          // this.totalSize = res.data.total;
        //  this.graphdata.datasets[0].data.push(0.5);
          
        // console.log(this.recordData.length)
        } else {
          // this.recordData = [];
          // this.totalSize = 0;
        }
        }, res => {

        })
    },
    getTipTwo(){
      this.searchLoading = true;
      let params = Object.assign(this.params);
      params.beginTime=this.beginTime;
      params.endTime=this.endTime;
      params.leftPersonName="";
      params.rightPersonName="";
      this.$http.post("/foc/getFocOil?pageNumber="+this.pageNumber+"&pageSize=10", params, { body: true }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;

        }, 200)
        if (res.status == 0) {
         var infor= res.focVos;
         var avroil=infor[0].avrOil;

              this.searchLoading = true;
              let paramPeoples = Object.assign(this.params);
              paramPeoples.leftPersonName=document.getElementById("getTipTwo").innerHTML.split(",")[0];
              paramPeoples.rightPersonName=document.getElementById("getTipTwo").innerHTML.split(",")[1];
              
              this.$http.post("/foc/getFocOil?pageNumber="+this.pageNumber+"&pageSize=10", paramPeoples, { body: true }).then(res => {
                setTimeout(function() {
                  this.searchLoading = false;

                }, 200)
                if (res.status == 0) {
                var infora= res.focVos;
                console.log(infora)
                this.tip=" 左座:"+document.getElementById("getTipTwo").innerHTML.split(",")[0]+" 右座:"+document.getElementById("getTipTwo").innerHTML.split(",")[1]+" 航班号:"+infora[0].flightNo+" 日期："+infora[0].flyDate+" 油耗"+document.getElementById("getTipTwo").innerHTML.split(",")[2]+" 平均油耗"+avroil;
                  this.$notify({
                    title: '机组详细信息',
                    message: this.tip,
                    duration: 5000
                  })
                  // this.totalSize = res.data.total;
                //  this.graphdata.datasets[0].data.push(0.5);
                  
                // console.log(this.recordData.length)
                } else {
                  // this.recordData = [];
                  // this.totalSize = 0;
                }
                }, res => {

                })

        //  this.tip=" 左座:"+document.getElementById("getTipTwo").innerHTML.split(",")[0]+" 右座:"+document.getElementById("getTipTwo").innerHTML.split(",")[1]+" 航班号:"+infor[0].flightNo+" 日期："+infor[0].flyDate+" 油耗"+document.getElementById("getTipTwo").innerHTML.split(",")[2]+" 平均油耗"+infor[0].avrOil;
        //    this.$notify({
        //     title: '机组详细信息',
        //     message: this.tip,
        //     duration: 10000
        //   })
          // this.totalSize = res.data.total;
        //  this.graphdata.datasets[0].data.push(0.5);
          
        // console.log(this.recordData.length)
        } else {
          // this.recordData = [];
          // this.totalSize = 0;
        }
        }, res => {

        })
    },
    getTipThree(){
      this.searchLoading = true;
      let params = Object.assign(this.params);
      params.beginTime=this.beginTime;
      params.endTime=this.endTime;
      params.leftPersonName= "";
      params.rightPersonName="";
      this.$http.post("/foc/getFocOil?pageNumber="+this.pageNumber+"&pageSize=10", params, { body: true }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;

        }, 200)
        if (res.status == 0) {
         var infor= res.focVos;
         var tips=" 日期："+document.getElementById("getTipThree").innerHTML.split(",")[0]+" 油耗"+ document.getElementById("getTipThree").innerHTML.split(",")[1]+" 平均油耗"+infor[0].avrOil;
           
              let paramPersons = Object.assign(this.params);
              paramPersons.beginTime= document.getElementById("getTipThree").innerHTML.split(",")[0];
              paramPersons.endTime=document.getElementById("getTipThree").innerHTML.split(",")[0];
              paramPersons.leftPersonName= "";
              paramPersons.rightPersonName="";
              this.$http.post("/foc/getFocOil?pageNumber="+this.pageNumber+"&pageSize=10", paramPersons, { body: true }).then(res => {
              setTimeout(function() {
                this.searchLoading = false;

              }, 200)
              if (res.status == 0) {
              var infor= res.focVos;
              this.tip="操作者:"+infor[0].controlPersonName+" 左座:"+infor[0].leftPersonName+" 右座:"+infor[0].rightPersonName+" 航班号:"+infor[0].flightNo+tips;
                this.$notify({
                  title: '机组详细信息',
                  message: this.tip,
                  duration: 10000
                })
                // this.totalSize = res.data.total;
              //  this.graphdata.datasets[0].data.push(0.5);
                
              // console.log(this.recordData.length)
              } else {
                // this.recordData = [];
                // this.totalSize = 0;
              }
              }, res => {

              })

        // console.log(this.recordData.length)
        } else {
          // this.recordData = [];
          // this.totalSize = 0;
        }
        }, res => {

        })

        
    },
    initChart() {
      // console.log(this.$el);
      // this.$el.style.width = (this.styles.width || 800) + 'px';
      // this.$el.style.height = (this.styles.height || 400) + 'px';
      this.chart = new Highcharts.Chart(this.$refs.highchartsContainerOne, this.optionOne);
      this.chart = new Highcharts.Chart(this.$refs.highchartsContainerTwo, this.optionTwo);
      this.chart = new Highcharts.Chart(this.$refs.highchartsContainerThree, this.optionThree);
      this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFour, this.optionFour);
      this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFive, this.optionFive);
      // this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFive, this.options);
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
      var that = this;
     that.searchLoading = true;
      var params = Object.assign(this.params);
      this.$http.post("/foc/getFocs?pageNumber="+this.pageNumber+"&pageSize=10", params, { body: true }).then(res => {
        setTimeout(function() {
        that.searchLoading = false;

        }, 200)
        if (res.status == 0) {
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
      //某航段某日期区间内空中时间chart统计
        this.$http.post("/foc/getFocAirTime", this.params, { body: true }).then(res => {
        setTimeout(function() {
         this.searchLoading = false;

        }, 200)
        if (res.status == 0) {
          var flightData = res.focVos;
          this.optionOne.series[0].data=[];
          this.optionOne.series[1].data=[];
          this.optionOne.series[2].data=[];
          this.optionOne.series[3].data=[];
          this.optionOne.xAxis.categories=[];
          for(var i=flightData.length-1;i>=0;i--){
              this.optionOne.series[0].data.push(parseFloat(flightData[i].airHour));
              this.optionOne.series[1].data.push(parseFloat(flightData[i].avrAirHour));
              this.optionOne.series[2].data.push(parseFloat(flightData[i].acarsAirHour));
              this.optionOne.series[3].data.push(parseFloat(flightData[i].avrAcarsAirHour));
              this.optionOne.xAxis.categories.push(flightData[i].flyDate)
          } 
 
          if(this.params.departureAirport){
            this.optionOne.title.text=flightData[flightData.length-1].flyDate+"到"+flightData[0].flyDate+" "+this.params.departureAirport+"-"+this.params.arrivalAirport+" "+"空中时间折线图";
          }else{
            this.optionOne.title.text=flightData[flightData.length-1].flyDate+"到"+flightData[0].flyDate+" "+"空中时间折线图";
          }
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerOne, this.optionOne);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerTwo, this.optionTwo);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerThree, this.optionThree);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFour, this.optionFour);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFive, this.optionFive);
            
        } else {
          this.optionOne.series[0].data=[];
          this.optionOne.series[1].data=[];
          this.optionOne.series[2].data=[];
          this.optionOne.series[3].data=[];
          this.optionOne.xAxis.categories=[];
        }
        }, res => {

        })
        // 查询某段时间某航段飞行时间chart统计
        this.$http.post("/foc/getFocFlyTime", this.params, { body: true }).then(res => {//22
        setTimeout(function() {
          this.searchLoading = false;

        }, 200)
        if (res.status == 0) {
          var flyData = res.focVos;
          this.optionTwo.series[0].data=[]
          this.optionTwo.series[1].data=[];
          this.optionTwo.series[2].data=[];
          this.optionTwo.series[3].data=[];
          this.optionTwo.series[4].data=[];
          this.optionTwo.xAxis.categories=[];
          for(var i=flyData.length-1;i>=0;i--){
             this.optionTwo.series[0].data.push(parseFloat(flyData[i].flyHours));
             this.optionTwo.series[1].data.push(parseFloat(flyData[i].avrFlyHours));
             this.optionTwo.series[2].data.push(parseFloat(flyData[i].acarsHours));
             this.optionTwo.series[3].data.push(parseFloat(flyData[i].avrAcarsHours));
             this.optionTwo.series[4].data.push(parseFloat(flyData[i].contractHours));
             this.optionTwo.xAxis.categories.push(flyData[i].flyDate)
          }    
          if(this.params.departureAirport){
            this.optionTwo.title.text=flyData[flyData.length-1].flyDate+"到"+flyData[0].flyDate+" "+this.params.departureAirport+"-"+this.params.arrivalAirport+" "+"飞行时间折线图";
          } else{
            this.optionTwo.title.text=flyData[flyData.length-1].flyDate+"到"+flyData[0].flyDate+" "+"飞行时间折线图";
            
          }    
          
          this.fiveBeginTime=flyData[flyData.length-1].flyDate;
          this.fiveEndTime=flyData[0].flyDate;
          var sortoil = new Object(); 
        sortoil.beginTime=this.params.beginTime;
        sortoil.isSort="1";
        sortoil.arrivalAirport=this.params.arrivalAirport;
        sortoil.endTime=this.params.endTime;
        sortoil.departureAirport=this.params.departureAirport;
        sortoil.leftPersonName=this.params.leftPersonName;
        sortoil.rightPersonName=this.params.rightPersonName;
        sortoil.controlPersonName=this.params.controlPersonName;
        console.log
        this.$http.post("/foc/getFocOil",sortoil , { body: true }).then(res => {//
        setTimeout(function() {
          this.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.optionFive.series[0].data=[];
          this.optionFive.series[1].data=[];
          this.optionFive.xAxis.categories=[];
          var oilData = res.focVos;
          for(var i=oilData.length-1;i>0;i--){
              this.optionFive.series[1].data.push(parseFloat(oilData[i].avrOil));
              this.optionFive.series[0].data.push(parseFloat(oilData[i].oil));
              this.optionFive.xAxis.categories.push(oilData[i].leftPersonName+","+oilData[i].rightPersonName)
          }
          if(this.params.departureAirport&&this.params.arrivalAirport){
            this.optionFive.title.text=this.fiveBeginTime+"到"+this.fiveEndTime+" "+this.params.departureAirport+"-"+this.params.arrivalAirport+" "+"耗油升序曲线图";
          }else{
            this.optionFive.title.text=this.fiveBeginTime+"到"+this.fiveEndTime+" "+"耗油量升序曲线图";
          }
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerOne, this.optionOne);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerTwo, this.optionTwo);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerThree, this.optionThree);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFour, this.optionFour);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFive, this.optionFive);
        } else {
            this.optionFive.xAxis.categories=[];
            this.optionFive.series[0].data=[];
            this.optionFive.series[1].data=[];
        }
        }, res => {

        })
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerOne, this.optionOne);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerTwo, this.optionTwo);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerThree, this.optionThree);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFour, this.optionFour);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFive, this.optionFive);
          
        } else {
          this.optionTwo.series[0].data=[]
          this.optionTwo.series[1].data=[];
          this.optionTwo.series[2].data=[];
          this.optionTwo.series[3].data=[];
          this.optionTwo.series[4].data=[];
          this.optionTwo.xAxis.categories=[];
        }
        }, res => {

        })
        // //某航段某日期区间内地面时间chart统计
        this.$http.post("/foc/getFocLand", this.params, { body: true }).then(res => {//3
        setTimeout(function() {
          this.searchLoading = false;

        }, 200)
        if (res.status == 0) {
        // console.log(this.recordData)
            var landData = res.focVos;
            this.optionThree.series[0].data=[];
            this.optionThree.series[1].data=[]
            this.optionThree.series[2].data=[];
            this.optionThree.series[3].data=[];
            this.optionThree.xAxis.categories=[];
            for(var i=landData.length-1;i>=0;i--){
                  this.optionThree.series[0].data.push(parseFloat(landData[i].landHour));
                  this.optionThree.series[1].data.push(parseFloat(landData[i].avrLandHour));
                  this.optionThree.series[2].data.push(parseFloat(landData[i].acarsLand));
                  this.optionThree.series[3].data.push(parseFloat(landData[i].avrAcarsLand));
                  this.optionThree.xAxis.categories.push(landData[i].flyDate)
            } 
            if(this.params.departureAirport){
              this.optionThree.title.text=landData[landData.length-1].flyDate+"到"+landData[0].flyDate+" "+this.params.departureAirport+"-"+this.params.arrivalAirport+" "+"地面时间折线图";
            }else{
              this.optionThree.title.text=landData[landData.length-1].flyDate+"到"+landData[0].flyDate+" "+"地面时间折线图";
            }
            this.chart = new Highcharts.Chart(this.$refs.highchartsContainerOne, this.optionOne);
            this.chart = new Highcharts.Chart(this.$refs.highchartsContainerTwo, this.optionTwo);
            this.chart = new Highcharts.Chart(this.$refs.highchartsContainerThree, this.optionThree);
            this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFour, this.optionFour);
            this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFive, this.optionFive);
        } else {
            this.optionThree.xAxis.categories=[];
            this.optionThree.series[0].data=[];
            this.optionThree.series[1].data=[]
            this.optionThree.series[2].data=[];
            this.optionThree.series[3].data=[];
        }
        }, res => {

        })
        //某航段某日期区间内日油耗chart统计
        this.$http.post("/foc/getFocOil", this.params, { body: true }).then(res => {//
        setTimeout(function() {
          this.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.optionFour.series[0].data=[];
          this.optionFour.series[1].data=[];
          this.optionFour.xAxis.categories=[];
          var oilData = res.focVos;
          for(var i=oilData.length-1;i>=0;i--){
              this.optionFour.series[1].data.push(parseFloat(oilData[i].avrOil));
              this.optionFour.series[0].data.push(parseFloat(oilData[i].oil));
              this.optionFour.xAxis.categories.push(oilData[i].flyDate)
          }
          console.log(this.params)
          if(this.params.departureAirport){
            this.optionFour.title.text=oilData[oilData.length-1].flyDate+"到"+oilData[0].flyDate+" "+this.params.departureAirport+"-"+this.params.arrivalAirport+" "+"耗油量折线图";
          }else{
            this.optionFour.title.text=oilData[oilData.length-1].flyDate+"到"+oilData[0].flyDate+" "+"耗油量折线图";

          }
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerOne, this.optionOne);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerTwo, this.optionTwo);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerThree, this.optionThree);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFour, this.optionFour);
          this.chart = new Highcharts.Chart(this.$refs.highchartsContainerFive, this.optionFive);
        } else {
            this.optionFour.xAxis.categories=[];
            this.optionFour.series[0].data=[];
            this.optionFour.series[1].data=[];
        }
        }, res => {

        })

        // "beginTime": "",
        // "endTime": "",
        // "departureAirport": "",
        // "arrivalAirport": "",
        // "leftPersonName": "",
        // "rightPersonName": "",
        // "controlPersonName": "",

        

        //某人某日期区间内多航段chart统计
        // this.$http.post("/foc/getFocPart", this.params, { body: true }).then(res => {
        // setTimeout(function() {
        //   this.searchLoading = false;

        // }, 200)
        // if (res.status == 0) {
        //     var perpleData = res.focVos;
        //    this.graphdata.datasets[4].data=[];
        //     for(var i=0;i<perpleData.length;i++){
        //         this.graphdata.datasets[4].data.push(perpleData[i].avrOil);
        //     }  
        //     console.log(this.graphdata.datasets[4].data)
        // } else {
        // }
        // }, res => {

        // })
    },
    // handDocType(val) {
    //   return docConfig.find(d => d.code == val.docTypeCode)||{color: '',shortName: '',}
    // },
    // calWidth(doc) {
    //   var width = 1;
    //   if (doc.isOvertime) {
    //     width -= 0.16
    //   }
    //   if (doc.docImprotType != '普通' && doc.docImprotType != '') {
    //     width -= 0.13
    //   }
    //   if (doc.docDenseType != '平件' && doc.docDenseType != '') {
    //     width -= 0.13
    //   }
    //   return parseInt(width * 100) + '%'
    // }
  }
}

</script>

<style lang='scss'>
$purple: #0460AE;
#flightReport {
  .pageBox {
    text-align: right;
    margin-top: 20px;
  }
  margin-bottom:30px;
  #highchartsContainerOne,#highchartsContainerTwo,#highchartsContainerThree,#highchartsContainerFour,#highchartsContainerFive{
    margin:20px 0;
  }
}

</style>
