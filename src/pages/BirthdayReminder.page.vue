<template>
  <div id="birthdayReminder">
    <el-row :gutter='12'>
      <el-col :span='17'>
        <el-row >
          <el-col :span="7" ><div class="grid-content bg-purple" style="margin-bottom:70px"><img src="../assets/images/birthday.png" width="100%" height="579"></div></el-col>
          <el-col :span="17"><div class="grid-content bg-purple-light">
            <div class="reminder_title"><span class="title_font">生日提醒</span> <span class="birthday_date">{{startDate | time('birthday')}}-{{endDate | time('birthday')}} 共{{total}}人过生日</span></div>


            <el-table
              :data="tableData"
              stripe
              style="width: 100%">
              <el-table-column
                prop="empName"
                label="员工姓名"
                width="90">
              </el-table-column>
              <el-table-column
                prop="deptName"
                label="部门"
                width="160">
              </el-table-column>
              <el-table-column
                prop="jobtitle"
                label="职位"
                width="120">
              </el-table-column>

              <el-table-column
                label="生日"
                width="100">
                <template scope="scope">
                  <span >{{ scope.row.birthday | time('birthday')}}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="mobileNumber"
                label="联系电话"
                width="130">
              </el-table-column>
            </el-table>
            <div class="pageBox" v-show="tableData.length>0" >
              <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>


          </div></el-col>
        </el-row>

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
  import SidePersonSearch from '../components/sidePersonSearch.component'

  import { mapGetters } from 'vuex'
  const tableTitle = ['员工姓名', '部门', '职位', '生日', '联系电话']
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
        pageNumber: 1,
        totalSize: 0,
        records: [],
        total:1,
        tableData:[],
        startDate:1,
        endDate:1,
      }
    },
    computed: {
      ...mapGetters([
        'airPortList'
      ])
  },
  created() {




    // this.getAirPortList();
    this.getBirthdayData();
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
          this.getBirthdayData();
        }
      } else {
        this.$message.warning('请选择航班日期!')
      }

    },
    getBirthdayData(){
      this.$http.post("/emp/birthdayDetail", {
        pageNumber: this.pageNumber,
        pageSize: "10"
      }).then(res => {
        setTimeout(function() {
          this.searchLoading = false;
        }, 200)
      if (res.status == 0) {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.startDate=this.tableData[0].startDate;
        this.endDate=this.tableData[0].endDate;
      } else {
        this.tableData = [];
        this.total = 0;
      }
    }, res => {

      })
    },
    handleCurrentChange(page) {
      this.pageNumber = page;
      this.getBirthdayData()
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
  #birthdayReminder {
  .el-row{
    .el-row{
      background-color:#fff;
      height: 580px;
      position:relative;
    }
  }
  .reminder_title{
    height:40px;
    line-height:40px;
    padding: 0 15px
  }
  .title_font{
    font-size:18px
  }
  .birthday_date{
    color:#1465C0;
    font-size:14px;
    float:right;
  }
  .el-table th{
    height:26px;
  }
  .el-table td{
    height:44px;
  }
  .pageBox {
    text-align: right;
    margin: 20px 0;
    position: absolute;right:0;bottom:0
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
