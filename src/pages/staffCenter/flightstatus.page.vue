<template>
  <div id="paymentSearch">
    <el-card class="borderCard searchOptions">
      <div slot="header">
        <span>航班动态</span>
      </div>
      <el-row :gutter="12">
        <el-col :span="6">
          <el-date-picker v-model="searchDate" type="date" placeholder="选择呈报日期" format="yyyy-MM-dd" @change="changDate"></el-date-picker>
        </el-col>
        <el-col :span="7">
          <el-radio-group v-model="flightStatusType" class="myRadio">
            <el-radio-button label="flightNo">航班号<i></i></el-radio-button>
            <el-radio-button label="route">路线<i></i></el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8">
          <div class="flightNo" v-show="flightStatusType=='flightNo'">
            <el-select v-model="flightNoTitle">
              <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input v-model="flightNoValue"></el-input>
          </div>
          <div class="route" v-show="flightStatusType=='route'">
            <el-input v-model="tripFrom" placeholder="出发地">
            </el-input>
            <el-input v-model="tripTo" placeholder="目的地">
            </el-input>
          </div>
        </el-col>
        <el-col :span="3">
          <el-button @click="getData" class="searchButton">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="borderCard searchResult">
      <div slot="header">
        <span @click="show">总计{{totalSize}}个航班</span>
      </div>
      <table bgcolor="#fff" class="myTableList" width="100%" cellspacing="0" v-loading.body="searchLoading">
      <caption>
      </caption>
      <thead align="left">
        <tr>
          <th v-for="title in tableTitle">{{title}}</th>
        </tr>
      </thead>
      <tbody v-for="flight in flightList">
        <tr>
          <td>{{flight.flightNo}}</td>
          <td>{{flight.from}}</td>
          <td>{{flight.to}}</td>
          <td>{{flight.stdTime}}</td>
          <td>{{flight.atdTime}}</td>
          <td>{{flight.staTime}}</td>
          <td>{{flight.ataTime}}</td>
          <td>{{statusValue[flight.flightStatus-1]}}</td>
        </tr>
      </tbody>
    </table>
    </el-card>

    <div class="pageBox" v-show="flightList.length>0">
      <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  const tableTitle = ['航班号', '出发地', '目的地', '计划起飞时间', '实际起飞时间', '计划到达时间','实际到达时间','状态']
  const options= [{
    value: 'DZ',
    label: 'DZ'
  }]; 
  const statusValue=['计划','延误','起飞','取消','备降','到达'];
  export default{
    data(){
      return{
        handledBy:'',
        paymentView:false,
        tableTitle,
        searchDate:'',
        flightStatusType:'',
        options,
        flightNoTitle:'DZ',
        flightNoValue:"",
        tripFrom:'',
        tripTo:'',
        statusValue,
        searchLoading: false,
        flightList:[],
        pageNumber:1,
        totalSize:0

      }
    },
    created() {
      let temp=new Date();
      let month=temp.getMonth()+1;
      if(month<10){
        month='0'+month;
      }
      this.searchDate=temp.getFullYear()+'-'+month+'-'+temp.getDate();
      console.log(this.searchDate);
      this.getData();

    },
    methods:{
      showDialog(){
        this.paymentView=true;
      },
      show(){
        console.log(this.$parent);
      },
      changDate(){
        let temp=new Date(this.searchDate);
        let month=temp.getMonth()+1;
        if(month<10){
          month='0'+month;
        }
        this.searchDate=temp.getFullYear()+'-'+month+'-'+temp.getDate();
        console.log(this.searchDate);
      },
      getData() {
        if(this.flightStatusType==""){
          this.getToDate();
        }else if(this.flightStatusType=="flightNo"){
          this.getToFlightNo();
        }else{
          this.getToRound();
        }
      },
      getToDate(){
        var that=this;
        this.searchLoading = true;
        this.$http.post("/flight/getFlightByDate", {
          flightDate:this.searchDate,
          pageNumber:this.pageNumber,
          pageSize:"10"
        }).then(res => {
          setTimeout(function() {
            that.searchLoading = false;
          }, 200)
          if (res.data.status == 0) {
            this.flightList = res.data.flightList;
            this.totalSize = res.data.totalSize;
          } else {
            this.flightList = [];
            this.totalSize = 0;
          }
        }, res => {

        })
      },
      getToFlightNo(){
        var that=this;
        this.searchLoading = true;
        this.$http.post("/flight/getFlightByNo", {
          flightDate:this.searchDate,
          flightNo:this.flightNoTitle+this.flightNoValue,
          pageNumber:this.pageNumber,
          pageSize:"10"
        }).then(res => {
          setTimeout(function() {
            that.searchLoading = false;
          }, 200)
          if (res.data.status == 0) {
            this.flightList = res.data.flightList;
            this.totalSize = res.data.totalSize;
          } else {
            this.flightList = [];
            this.totalSize = 0;
          }
        }, res => {

        })
      },
      getToRound(){
        var that=this;
        this.searchLoading = true;
        this.$http.post("/flight/getFlightByFromTo", {
          flightDate:this.searchDate,
          det:that.tripFrom,
          arr:that.tripTo,
          pageNumber:this.pageNumber,
          pageSize:"10"
        }).then(res => {
          setTimeout(function() {
            that.searchLoading = false;
          }, 200)
          if (res.data.status == 0) {
            this.flightList = res.data.flightList;
            this.totalSize = res.data.totalSize;
          } else {
            this.flightList = [];
            this.totalSize = 0;
          }
        }, res => {

        })
      },
      handleCurrentChange(page) {
        this.pageNumber = page;
        this.getData()
      }
    }
  }
</script>
<style lang='scss'>
  $purple: #0460AE;
  #paymentSearch{
    .pageBox {
      text-align: right;
      margin: 20px 0;
    }
    .purpleColor{
      color:$purple;
    }
    .greenColor{
      color:#0F6E0B;
    }
    .headRight{
      i:first-child{
        font-size:24px;
        position:relative;
        top:3px;
      }
    }
    .searchOptions{
      padding-bottom: 10px;
      .el-card__body{
        .el-col{
          margin-top:13px;
        }
        .showDate{
          border-right: 1px solid #b7b7b7;
        }
        .myRadio{
          width: 100%;
          .el-radio-button{
            width: 45%;
            margin-right:0;
            .el-radio-button__inner{
              width: 100%;
              padding:15px;
            }
            &:first-child{
              margin-right: 15px;
            }
          }
        }
        .flightNo{
          float: right;
          .el-input{
            width: 60%;
            float: right;
          }
          .el-select{
            width:30%;
            margin-right:15px;
            .el-input{
              width: 100%
            }
          }
        }
        .route{
          float: right;
          .el-input{
            width:45%;
            display:inline-block;
            &:first-child{
              margin-right:15px;
            }
          }
            
          
          button{         
            float: right;
            font-size: 18px;
            width: 103px;
            height: 46px;
            color: #fff;
            background: $purple;
            border-color:$purple;
          }
        }
      }
    }
    
    .searchResult{
      padding-bottom: 0;
      .el-card__body{
        &>table {
          thead {
            background: $purple;
            color: #fff;
            font-size: 13px;
            th {
              padding: 6px 13px;
            }
            $widths: (1: 10%, 2: 10%, 3: 10%, 4: 15%, 5: 15%, 6: 15%, 7:15%,8:10%);
            @each $num,
            $width in $widths {
              th:nth-child(#{$num}) {
                width: $width;
              }
            }
          }
          td {
            padding: 4px 13px;
            font-size: 14px;
          }
          tbody {
            tr:first-child {
              td {
                border-bottom: 1px dashed #D5DADF;
              }
            }
            tr:last-child {
              td {
                border-bottom: 1px solid #D5DADF;
                vertical-align: middle;
              }
              height: 76px;
              td {
                font-size: 15px;
              }
              td:nth-child(3),
              td:nth-child(2) {
                color: $purple;
                span {

                  cursor: pointer;
                }
              }
              td:last-child {
                cursor: pointer;
              }
            }
          }
          tbody:nth-child(even) {
            background: #F7F7F7;
          }
          tfoot {
            td {
              color: #95989A;
            }
          }
        }
        padding: 0;
        .tableHearder{
          background: $purple;
          display: table;
          width: 100%;
          li{
            display: table-cell;
            padding-left: 15px;
            box-sizing: border-box;
            color:#fff;
            font-size: 13px;
            height: 44px;
            vertical-align: middle;
          }
        }
        .el-table{
          .cell{
            padding-left: 15px;
          }
          td{
            height: 70px;
          }
          td.clickItem{
            color:$purple;
            cursor: pointer;
          }
          td.timeItem{
            padding-right: 25px;
          }
        }
      }
      .total{
        height: 33px;
        line-height: 33px;
        padding-left: 15px;
        font-size: 14px;
        color: #95989A;
      }    
    }    

  }


</style>
