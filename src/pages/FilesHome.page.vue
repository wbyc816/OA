<template>
  <div id="paymentSearch">
    <el-row :gutter='12'>
      <el-col :span='17'>
        <el-row >
          <el-col :span='24'>
            <el-card class="mailbox">
              <div slot="header" class="clearfix">
                <span style="line-height: 36px;">{{title}}</span>
                <span style="margin-left:423px;font-size:15px;color:#1465C0;cursor:pointer">发布时间
                </span> 

                <div style="height:40px;position:absolute;right:60px;top:20px;width:200px;font-size:3px;color:#1465C0">
                   <i class="iconfont icon-shangsanjiao" style="font-size:12px;position:absolute;left:0;top:0px;cursor:pointer"></i>
                   <i class="iconfont icon-xiasanjiao-copy" style="font-size:12px;position:absolute;left:0;top:8px;cursor:pointer"></i>
                   <el-dropdown style="margin-left:20px;margin-top:5px;color:#1465C0" @command="handleCommand_dept">
                    <span class="el-dropdown-link">
                      所有部门<i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" style="margin-top:50px">
                      <el-dropdown-item v-for="Dept in Depts" :command="Dept.id">{{Dept.name}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  
                   <el-dropdown style="margin-left:20px;margin-top:5px;color:#1465C0" @command="handleCommand">
                    <span class="el-dropdown-link">
                      文件类型<i class="el-icon-caret-bottom el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown" style="margin-top:50px">
                      <el-dropdown-item  v-for="leftFileType in leftFileTypes" :command="leftFileType.dictCode">{{leftFileType.dictName}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                

                 
              </div>
              <div style="position:relative;">
                 <ul style="color:#676767;height:742px" class="file_ul">
                   <li  v-for="fileData in fileDatas" @click="goTo(fileData)">
                     <div class="title_li" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;height:20px;width:300px">{{fileData.docTitle}}</div>
                        <div class="content_li">
                          <span style="width:180px;display:inline-block;margin-left:-2px">{{fileData.taskDeptMajorName }}</span>
                          <span class="iconfont_color"><i class="iconfont icon-dianzan"></i></span><span>{{fileData.praise}}</span>
                          <span class="iconfont_color"><i class="iconfont icon-eye"></i></span><span>{{fileData.isRead}}</span>
                          {{fileData.createTime | time('all')}}
                       </div>
                   </li>

                 

                 </ul>
                  <div class="vertical_line"> </div>
                  
                  <div class="pageBox" v-show="true" >
                    <el-pagination @current-change="handleCurrentChange" :current-page="pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
                    </el-pagination>
                  </div>
                  <hr style="position:absolute;top:664px;left:10px;width:790px;border:1px solid #E9E9E9">
              </div>
        </el-card>
        </el-col>
        </el-row>

      </el-col>
      <el-col :span='7' class="sideNav">
        <el-card class="mailbox">
          <el-menu>
            <el-menu-item v-for="fileType in fileTypes" index="1" @click="search_type(fileType)">
            <span style="margin-left:0;width:200px;display:inline-block">{{fileType[0]}}</span>
            <span>{{fileType[1]}}</span>
            </el-menu-item>
          </el-menu>
        </el-card>

         <el-card class="highSearch" >
           
                <span class="title_label">标题</span>
                <el-input class="" placeholder=""  v-model="file_title" style="margin:12px 0; ">
                </el-input>
                <div class="block">
                 <span class="title_label">日历</span>
                  <el-date-picker
                    v-model="startTime"
                    type="daterange"
                    placeholder="选择日期范围"
                    format="yyyy-MM-dd">
                  </el-date-picker>
                </div>
                <el-button type="primary" style="width:101px;height:46px;margin:9px 0px  0px 193px"  @click="click_Search">搜索</el-button>
            </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import SidePersonSearch from '../components/sidePersonSearch.component'
  import util from '../common/util'
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
        ishighSearch:0,
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
        fileDatas:[],
        fileTypes:"",
        fileCode:"",
        dictCode:"",
        file_title:"",
        Depts:[],
        title:"公司发文",
        leftFileTypes:[],
        endDate:1,
           pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        startTime: '',
        endTime: ''
      }
    },
    computed: {
      ...mapGetters([
        'airPortList',
        "userInfo"
      ])
  },
  created() {
      this.getFileType();
      this.getleftFileType();
      this.getDept();
      this.left_search_type("ADM0401");
  },
  methods: {
     click_highSearch() {
      this.ishighSearch=1;
     },
     close_highSearch() {
      this.ishighSearch=0;
     },
     search_type(fileType){
        this.title=fileType[0];
        this.fileCode=fileType[3];
        console.log(fileType[3]);
        this.$http.post("/doc/selectFileList", {
            pageNumber: this.pageNumber,
            pageSize: "10",
            classify1:this.fileCode,
            empId:this.userInfo.empId,
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.fileDatas = res.data.selectDocInfoVolist;
            this.totalSize = res.data.totalSize;
          } else {
            this.tableData = [];
            this.totalSize = 0;
          }
        }, res => {

        })
     },
      left_search_type(fileType){
        this.fileCode=fileType;
        this.$http.post("/doc/selectFileList", {
            pageNumber: this.pageNumber,
            pageSize: "10",
            classify1:this.fileCode,
            empId:this.userInfo.empId,
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.fileDatas = res.data.selectDocInfoVolist;
            this.totalSize = res.data.totalSize;
          } else {
            this.tableData = [];
            this.totalSize = 0;
          }
        }, res => {

        })
     },
     click_Search() {
        let startTime = util.formatTime(this.startTime[0], 'yyyy-MM-dd')
        let endTime = util.formatTime(this.startTime[1], 'yyyy-MM-dd')
         this.$http.post("/doc/selectFileList", {
              pageNumber: this.pageNumber,
              docTitle:this.file_title,
              pageSize: "10",
              empId:this.userInfo.empId,
              startTime:startTime,
              endTime:endTime,
            }).then(res => {
              setTimeout(function() {
                this.searchLoading = false;
              }, 200)
            if (res.status == 0) {
              this.fileDatas = res.data.selectDocInfoVolist;
              this.totalSize = res.data.totalSize;
            } else {
              this.tableData = [];
              this.totalSize = 0;
            }
          }, res => {

          })
     },

       getFileType(){
          this.$http.post("/doc/getCountFileByClassify", {
             empId:this.userInfo.empId,
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.fileTypes = res.data;
            
          } else {
            this.fileTypes = [];
            this.totalSize = 0;
          }
        }, res => {

        })
      },
      getleftFileType(){
          this.$http.post("/api/getDict", {
             dictCode:"ADM04",
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.leftFileTypes = res.data;
            
          } else {
            this.leftFileTypes = [];
          }
        }, res => {

        })
      },
      getDept(){
          this.$http.post("/index/selectDeptList", {
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.Depts = res.data;
            
          } else {
            this.Depts = [];
          }
        }, res => {

        })
      },

      handleCommand(command){
         this.left_search_type(command);

       },
    handleCommand_dept(command){
        this.$http.post("/doc/selectFileList", {
            pageNumber: this.pageNumber,
            pageSize: "10",
            empId:this.userInfo.empId,
            deptId:command,
            levelNum:30,
          }).then(res => {
            setTimeout(function() {
              this.searchLoading = false;
            }, 200)
          if (res.status == 0) {
            this.fileDatas = res.data.selectDocInfoVolist;
            this.totalSize = res.data.totalSize;
          } else {
            this.tableData = [];
            this.totalSize = 0;
          }
        }, res => {

        })
    },
   
    handleCurrentChange(page) {
      this.pageNumber = page;
      this.click_Search()
    },
    goTo(data){
      console.log(data);
      this.$router.push('/newsDetail/'+data.id)
    }
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

  .el-row{
  .el-row{
    background-color:#fff;
    height: 580px;
    position:relative;
  }
  }
  @mixin linkList($color) {
    .el-card__header {
      padding-left: 17px;
      border-bottom: 1px solid #f2f2f2;
    }
    .el-card__body {
      padding: 0;
    }
    .el-menu-item {
      border-bottom: 1px solid #f2f2f2;
      font-size: 16px;
      height:50px;
    i:first-child {
      font-size: 23px;
      margin-right: 15px;
      color: $color;
      vertical-align: middle;
  &.icon-youhui {
     font-size: 18px;
   }
  &.icon-mail {
     vertical-align: top;
   }
  }
  .el-icon-arrow-right {
    float: right;
    line-height: 50px;
  }
  }
  .el-menu-item:hover {
  i {
    color: $color;
  }
  color:$color;
  }
  .el-menu-item.is-active {
  i:last-child {
    color: #676767;
  }
  color:#676767;
  }
  }
  .mailbox {
      padding: 0;
    @include linkList(#BE3B7F);
  }
  .el-menu-item span{
    margin-left:80px
  }
  .contactList {
    .el-card__header {
      border-bottom: 1px solid #f2f2f2;
      padding:18px 10px;
    }
    .el-card__body {
      height:86px;
      padding-top: 14px;
    }
  }
 .search.el-input .el-input-group__append .el-button{
    height:46px;
  }
  .highSearch {
    .el-card__header {
      color:#393939;
      padding:8px 15px;
      height:41px;
      border-bottom: 1px solid #f2f2f2;
    }
    .el-card__body {
      height:280px;
      padding-top: 0px;
      color:#676767;
    }
    .title_label{
      font-size:15px;
      margin-left:-5px;
      margin-right:15px;
      color:#676767;
    }
    .el-input{
        width:255px;
     }
  }
  .file_ul li{
      width:391px;
      height:84px;
      float:left;
      padding-left:15px;
      border-bottom:1px solid #E9E9E9;
      margin-left:10px;
   }
  .file_ul li div{
      margin-top:15px
  }
  .file_ul li title_li{
    font-size:16px;
  }
  .iconfont_color{
     color:#1465C0;
  }
  .iconfont_color:first-child{
    margin-left:120px;
  }
  .content_li{
      font-size:12px;
  }
  .content_li span{
    margin-left:5px;
  }
  .vertical_line{
     width: 1px;
     height: 640px;
     background: #E9E9E9;
     position:absolute;
     top:5px;
     left:406px;
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
    position: absolute;
    right:30px;
    bottom:20px;
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
