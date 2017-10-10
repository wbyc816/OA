<template>
  <div id="paymentSearch">
    <el-row :gutter='12'>
      <el-col :span='17'>
        <el-card class="borderCard searchOptions">
          <div slot="header">
            <span>航班动态</span>
          </div>
          <el-row :gutter="12">
            <el-col :span="6">
              <el-date-picker v-model="searchDate" type="date" placeholder="选择航班日期" format="yyyy-MM-dd" @change="changDate"  :editable="false" :clearable="false"></el-date-picker>
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
                <!-- <el-input v-model="tripFrom" placeholder="出发地"></el-input> -->
                <el-autocomplete class="inline-input" v-model="tripFrom.cityName" :fetch-suggestions="querySearch" placeholder="出发地" @select="handleFrom"></el-autocomplete>
                <el-autocomplete class="inline-input" v-model="tripTo.cityName" :fetch-suggestions="querySearch" placeholder="目的地" @select="handleTo"></el-autocomplete>
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
                <td>{{flight.stdTime=="null null"?'':flight.stdTime}}</td>
                <td>{{flight.atdTime=="null null"?'':flight.atdTime}}</td>
                <td>{{flight.staTime=="null null"?'':flight.staTime}}</td>
                <td>{{flight.ataTime=="null null"?'':flight.ataTime}}</td>
                <td>{{statusValue[flight.flightStatus-1]}}</td>
              </tr>
            </tbody>
          </table>
        </el-card>
        <div class="pageBox" v-show="flightList.length>0">
          <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span='7' class="sideNav">
        <side-Person-Search></side-Person-Search>
        <el-card class="duty">
          <div slot="header">今日值班
            <router-link to="#">更多</router-link>
          </div>
          <el-menu mode="vertical" default-active="1">
            <el-menu-item-group>
              <el-submenu index="1">
                <template slot="title">IT服务部</template>
                <el-menu-item index="2-1">莫文 : 138 4564 7841</el-menu-item>
                <!-- <el-menu-item index="1-1">Doc Searching</el-menu-item> -->
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">地面服务部</template>
                <el-menu-item index="2-1">莫文耀 : 138 4164 7841</el-menu-item>
                <el-menu-item index="2-2">刘莉: 133 6415 57871</el-menu-item>
                <el-menu-item index="2-3">王立伟 : 134 3641 8874</el-menu-item>
                <el-menu-item index="2-4">王天峰 : 133 1248 4774</el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">货运部</template>
                <el-menu-item index="3-1">宋丽萍：135 4887 2561</el-menu-item>
              </el-submenu>
            </el-menu-item-group>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import SidePersonSearch from '../../components/sidePersonSearch.component'

import { mapGetters } from 'vuex'
const tableTitle = ['航班号', '出发地', '目的地', '计划起飞时间', '实际起飞时间', '计划到达时间', '实际到达时间', '状态']
const options = [{
  value: 'DZ',
  label: 'DZ'
}];
const statusValue = ['计划', '延误', '起飞', '取消', '备降', '到达'];
export default {
  components: { SidePersonSearch },
  data() {
    return {
      handledBy: '',
      paymentView: false,
      tableTitle,
      searchDate: '',
      flightStatusType: '',
      options,
      flightNoTitle: 'DZ',
      flightNoValue: "",
      tripFrom: { cityName: '' },
      tripTo: { cityName: '' },
      statusValue,
      searchLoading: false,
      flightList: [],
      pageNumber: 1,
      totalSize: 0,
    }
  },
  computed: {
    ...mapGetters([
      'airPortList'
    ])
  },
  created() {
    // this.getAirPortList();
    var routeParam = this.$route.params;
    console.log(this.$route)
    if (routeParam.type == 'route') {
      this.flightStatusType='route';
      this.searchDate=routeParam.date;
      this.tripFrom=routeParam.tripFrom;
      this.tripTo=routeParam.tripTo;
      this.getToRound();
    }
    else if(routeParam.type == 'flightNo'){
      this.flightStatusType='flightNo';
      this.searchDate=routeParam.date;
      this.flightNoTitle=routeParam.flightNoTitle;
      this.flightNoValue=routeParam.flightNoValue;
      this.getToFlightNo();
    }
    else if(routeParam.type == 'date'){
      this.searchDate=routeParam.date;
      this.getData();
    }
     else {
      let temp = new Date();
      let month = temp.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      this.searchDate = temp.getFullYear() + '-' + month + '-' + temp.getDate();
      console.log(this.searchDate);
      this.getData();
    }

    this.$store.dispatch('getAirPortList');
  },
  methods: {
    querySearch(queryString, cb) {
      var airPortList = JSON.parse(JSON.stringify(this.airPortList));
      var results = queryString ? airPortList.filter(this.createFilter(queryString)) : airPortList;
      // 调用 callback 返回建议列表的数据
      results.forEach(e => e.value = e.cityName);
      console.log(results)
      cb(results);
    },
    createFilter(queryString) {
      return (airPort) => {
        return (airPort.cityName.indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleFrom(item) {
      this.tripFrom = JSON.parse(JSON.stringify(item));
    },
    handleTo(item) {
      this.tripTo = JSON.parse(JSON.stringify(item));
    },
    showDialog() {
      this.paymentView = true;
    },
    show() {
      console.log(this.$parent);
    },
    changDate() {
      let temp = new Date(this.searchDate);
      let month = temp.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      this.searchDate = temp.getFullYear() + '-' + month + '-' + temp.getDate();
      console.log(this.searchDate);
    },
    getData() {
      if (this.searchDate != 'NaN-NaN-NaN') {
        if (this.flightStatusType == "route") {
          if (this.tripFrom.city3cody && this.tripTo.city3cody) {
            if (this.tripFrom.city3cody == this.tripTo.city3cody) {
              this.$message.warning('出发地与目的地相同，请重新选择路线！')
            } else {
              this.getToRound();
            }
          } else {
            this.getToDate();
          }
        } else if (this.flightStatusType == "flightNo") {
          if (this.flightNoValue) {
            this.getToFlightNo();
          } else {
            this.getToDate();
          }
        } else {
          this.getToDate();
        }
      } else {
        this.$message.warning('请选择航班日期!')
      }

    },
    getToDate() {
      var that = this;
      this.searchLoading = true;
      this.$http.post("/flight/getFlightByDate", {
        flightDate: this.searchDate,
        pageNumber: this.pageNumber,
        pageSize: "10"
      }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.flightList = res.flightList;
          this.totalSize = res.totalSize;
        } else {
          this.flightList = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
    getToFlightNo() {
      var that = this;
      this.searchLoading = true;
      this.$http.post("/flight/getFlightByNo", {
        flightDate: this.searchDate,
        flightNo: this.flightNoTitle + this.flightNoValue,
        pageNumber: this.pageNumber,
        pageSize: "10"
      }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;
        }, 200)
        if (res.status == 0) {
          this.flightList = res.data.flightList;
          this.totalSize = res.data.totalSize;
        } else {
          this.flightList = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
    getToRound() {
      var that = this;
      this.searchLoading = true;
      this.$http.post("/flight/getFlightByFromTo", {
        flightDate: this.searchDate,
        dep: that.tripFrom.city3cody,
        arr: that.tripTo.city3cody,
        pageNumber: this.pageNumber,
        pageSize: "10"
      }).then(res => {
        setTimeout(function() {
          that.searchLoading = false;
        }, 200)
        if (res.status == 0) {
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
    },
    // getAirPortList() {
    //   this.$http.get('/api/getAirPortList')
    //     .then(res => {
    //       if (res.status == 0) {
    //         this.airPortList = res.data;
    //       }
    //       console.log(this.airPortList)
    //     })
    // }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
#paymentSearch {
  .pageBox {
    text-align: right;
    margin: 20px 0;
  }
  .purpleColor {
    color: $main;
  }
  .greenColor {
    color: #0F6E0B;
  }
  .headRight {
    i:first-child {
      font-size: 24px;
      position: relative;
      top: 3px;
    }
  }
  .searchOptions {
    padding-bottom: 10px;
    .el-card__body {
      .el-col {
        margin-top: 13px;
      }
      .showDate {
        border-right: 1px solid #b7b7b7;
      }
      .myRadio {
        width: 100%;
        .el-radio-button {
          width: 45%;
          margin-right: 0;
          .el-radio-button__inner {
            width: 100%;
            padding: 15px;
          }
          &:first-child {
            margin-right: 15px;
          }
        }
      }
      .flightNo {
        float: right;
        height: 46px;
        .el-input {
          width: 60%;
          float: right;
        }
        .el-select {
          width: 30%;
          margin-right: 15px;
          .el-input {
            width: 100%
          }
        }
      }
      .route {
        float: right;
        .el-autocomplete {
          width: 50%;
          float: left;
          &:first-child {
            padding-right: 5px;
          }
          &:last-child {
            padding-left: 5px;
          }
        } // .el-input {
        //   // width: 45%;
        //   display: inline-block; // &:first-child {
        //   //   margin-right: 15px;
        //   // }
        // }
        button {
          float: right;
          font-size: 18px;
          width: 103px;
          height: 46px;
          color: #fff;
          background: $main;
          border-color: $main;
        }
      }
    }
  }

  .searchResult {
    padding-bottom: 0;
    .el-card__body {
      &>table {
        thead {
          background: $main;
          color: #fff;
          font-size: 13px;
          th {
            padding: 6px 13px;
          }
          $widths: (1: 10%, 2: 10%, 3: 10%, 4: 15%, 5: 15%, 6: 15%, 7:15%, 8:10%);
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
              color: $main;
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
      .tableHearder {
        background: $main;
        display: table;
        width: 100%;
        li {
          display: table-cell;
          padding-left: 15px;
          box-sizing: border-box;
          color: #fff;
          font-size: 13px;
          height: 44px;
          vertical-align: middle;
        }
      }
      .el-table {
        .cell {
          padding-left: 15px;
        }
        td {
          height: 70px;
        }
        td.clickItem {
          color: $main;
          cursor: pointer;
        }
        td.timeItem {
          padding-right: 25px;
        }
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
  .duty {
    margin-bottom: 20px;
    .el-card__header {
      a {
        float: right;
        color: #676767;
        font-size: 14px;
        line-height: 24px;
      }
    }
    .el-menu-item-group__title {
      display: none;
    }
    .el-card__body {
      padding: 0;
      .el-submenu__title {
        border-bottom: 1px solid #F2F2F2;
      }
    }
    .el-submenu.is-opened {
      .el-submenu__title {
        color: $main;
      }
      .el-menu {
        border-bottom: 1px solid #F2F2F2;
        li:hover {
          cursor: auto;
        }
        .is-active {
          color: #676767;
        }
      }
    }
    .el-submenu .el-menu-item {
      padding-left: 18px !important;
      font-size: 15px;
    }
  }
}

</style>
