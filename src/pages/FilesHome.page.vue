<template>
  <div id="filesHome">
    <el-row :gutter='12'>
      <el-col :span='17'>
        <el-row>
          <el-col :span='24'>
            <el-card class="filebox">
              <div slot="header" class="clearfix">
                <span class="title">{{title}}</span>
                <span class="three_btn">
                    <el-button type="primary"  @click="changeSort">
                      发布时间
                      <i class="iconfont icon-shangsanjiao"  v-if="params.sort==0"></i>
                      <i class="iconfont icon-xiasanjiao-copy"  v-if="params.sort==1"></i>
                    </el-button>
                    <el-dropdown menu-align="start" trigger="click" class="choose_dropdown" @command="handleCommand_dept" >
                      <el-button type="primary">
                        {{choose_dept}}<i class="iconfont icon-xiasanjiao-copy"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown" class="choose_menu">
                        <el-dropdown-item  :command="['','选择部门']">全部部门</el-dropdown-item>
                        <el-dropdown-item v-for="Dept in Depts" :command="[Dept.id,Dept.name]">{{Dept.name}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <el-dropdown menu-align="start" trigger="click" class="choose_dropdown"  @command="handleCommand">
                     <el-button type="primary">
                      {{choose_type}}<i class="iconfont icon-xiasanjiao-copy"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown"class="choose_menu">
                      <el-dropdown-item  :command="['','选择类型']">全部类型</el-dropdown-item>
                      <el-dropdown-item  v-for="leftFileType in leftFileTypes" :command="[leftFileType.dictCode,leftFileType.dictName]">{{leftFileType.dictName}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </span>
              </div>
              <div>
                <ul class="file_ul">
                  <div class="verticalLine"> </div>
                  <li v-for="fileData in fileDatas" @click="goTo(fileData)">
                    <div class="title_li">{{fileData.docTitle}}</div>
                    <div class="content_li">
                      <span>{{fileData.taskDeptMajorName }}</span>
                      <span class="content_right">
                          <span class="iconfontColor"><i class="iconfont icon-dianzan"></i></span><span>{{fileData.praise}}</span>
                      <span class="iconfontColor"><i class="iconfont icon-eye"></i></span><span>{{fileData.browse}}</span>
                      <span>{{fileData.createTime | time('nosecond')}}</span>
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-card>
            <div class="pageBox" v-if="fileDatas.length>0">
              <el-pagination @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-size="10" layout="total, prev, pager, next, jumper" :total="totalSize">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span='7' class="sideNav">
        <el-card class="filebox_second">
          <el-menu>
            <el-menu-item v-for="fileType in fileTypes" index="1" @click="search_type(fileType)">
             
              <span class="title">{{fileType[0]}}</span>
              <span class="num">{{fileType[2]}}</span>
            </el-menu-item>
          </el-menu>
        </el-card>
        <el-card class="highSearch">
          <span class="title_label">标题</span>
          <el-input class="" placeholder="" v-model.trim="params.docTitle" @keyup.enter.native="click_Search">
          </el-input>
          <div class="block">
            <span class="title_label">日历</span>
            <el-date-picker v-model="startTime" type="daterange" placeholder="选择日期范围" format="yyyy-MM-dd">
            </el-date-picker>
          </div>
          <el-button type="primary" class="click_Search" @click="click_Search">搜索</el-button>
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
      ishighSearch: 0,
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
      total: 1,
      tableData: [],
      startDate: 1,
      choose_type: "选择类型",
      fileDatas: [],
      fileTypes: "",
      fileCode: "",
      dictCode: "",
      file_title: "",
      choose_dept: "选择部门",
      Depts: [],
      title: "公司新闻",
      leftFileTypes: [],
      endDate: 1,
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
      endTime: '',
      params: {
        empId: '',
        classify1: '',
        pageNumber: 1,
        pageSize: 10,
        startTime: '',
        endTime: '',
        deptId: '',
        docTitle: '',
        sort: 0,
      }
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
    this.params.empId = this.userInfo.empId;
    this.params.classify1 = "ADM0401";
    this.getDept();
    this.getData();
  },
  methods: {
    click_highSearch() {
      this.ishighSearch = 1;
    },
    close_highSearch() {
      this.ishighSearch = 0;
    },
    getData() {
      this.$http.post("/doc/selectFileList", this.params).then(res => {
        setTimeout(function() {
          this.searchLoading = false;
        }, 200)
        if (res.status == 0 && res.data.selectDocInfoVolist) {
          this.fileDatas = res.data.selectDocInfoVolist;
          this.totalSize = res.data.totalSize;
        } else {
          this.fileDatas = [];
          this.totalSize = 0;
        }
      }, res => {

      })
    },
    search_type(fileType) {
      this.params.pageNumber = 1;
      this.params.classify1 = fileType[1];
      this.params.startTime = '';
      this.params.endTime = '';
      this.title = fileType[0];
      this.params.collect = "";
      this.params.isRead = "";
      if (fileType[0] == "未读文档") {
        this.params.isRead = 0;
        this.params.classify1 = "";
        this.getData();
      } else if (fileType[0] == "我的收藏") {
        this.params.collect = 1;
        this.params.classify1 = "";
        this.getData();
      } else {
        this.getData();
      }

    },
    click_Search() {
      if (this.startTime[0] && this.startTime[1]) {
        this.params.startTime = util.formatTime(this.startTime[0], 'yyyy-MM-dd');
        this.params.endTime = util.formatTime(this.startTime[1], 'yyyy-MM-dd');
      }
      this.params.deptId = ''
      this.params.deptId = ''
      this.getData();
    },

    getFileType() {
      this.$http.post("/doc/getCountFileByClassify", {
        empId: this.userInfo.empId,
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
    getleftFileType() {
      this.$http.post("/api/getDict", {
        dictCode: "ADM04",
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
    getDept() {
      this.$http.post("/index/selectDeptList", {}).then(res => {
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

    handleCommand(command) {
      this.params.pageNumber = 1;
      this.params.classify1 = command[0];
      this.choose_type = command[1];
      this.getData();
    },
    handleCommand_dept(command) {
      console.log(command);
      this.params.pageNumber = 1;
      this.params.deptId = command[0];
      this.choose_dept = command[1];
      this.getData();
    },
    changeSort() {
      if (this.params.sort == 0) {
        this.params.sort = 1;
        this.params.pageNumber = 1;
      } else {
        this.params.sort = 0;
        this.params.pageNumber = 1;
      }
      this.getData();
    },
    handleCurrentChange(page) {
      this.params.pageNumber = page;
      this.getData()
    },
    goTo(data) {
      console.log(data);
      this.$router.push('/newsDetail/' + data.id);
      this.$http.post("/doc/updateBrowse", {
        empId: this.userInfo.empId,
        fileId: data.fileId
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
    }
  }
}

</script>
<style lang='scss'>
$main: #0460AE;
.choose_menu {
  margin-top: 45px;
  height: 200px;
  overflow: auto;
}

#filesHome {

  .iconfontColor {
    color: #1465C0;
  }
  & .file_ul {
    overflow: hidden;
    color: #676767;
    position: relative;
    & .content_right {
      float: right;
    }
    & li {
      width: 390px;
      height: 84px;
      float: left;
      border-bottom: 1px solid #E9E9E9;
      cursor: pointer;
    }
    & li:nth-of-type(even) {
      margin-left: 45px;
    }
    & li:nth-of-type(odd) {
      margin-left: 10px;
    }
    & li .title_li {
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 20px;
    }
    & li div {
      margin-top: 15px
    }
  }

  & .filebox {
    & .title {
      line-height: 36px;
      width: 72px;
      display: inline-block;
    }
    & .three_btn {
      height: 40px;
      color: #1465C0;
      float: right;
    }
  }

  .el-dropdown {
    cursor: pointer;
  }
  .el-row {
    // background-color:#fff;
    position: relative;
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
      height: 50px;
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
  .filebox {
    padding: 0;
    @include linkList(#BE3B7F);
  }
  .el-menu-item span {
    margin-left: 80px
  }
  .contactList {
    .el-card__header {
      border-bottom: 1px solid #f2f2f2;
      padding: 18px 10px;
    }
    .el-card__body {
      height: 86px;
      padding-top: 14px;
    }
  }
  .search.el-input .el-input-group__append .el-button {
    height: 46px;
  }
  .highSearch {
    .el-card__header {
      color: #393939;
      padding: 8px 15px;
      height: 41px;
      border-bottom: 1px solid #f2f2f2;
    }
    .el-card__body {
      height: 190px;
      padding-top: 0px;
      color: #676767;
    }
    .title_label {
      font-size: 15px;
      margin-left: -5px;
      margin-right: 15px;
      color: #676767;
    }
    .el-input {
      width: 255px;
    }
  }



  .content_li {
    font-size: 12px;
  }
  .content_li span {
    margin-left: 10px
  }
  .content_li span:first-child {
    margin-left: 0px;
  }

  .verticalLine {

    border-left: 1px solid #E9E9E9;
    position: absolute;
    left: 425px;
    top: 15px;
    height: calc(100% - 25px);
  }
  .filebox_second {
    padding: 0px;
    @include linkList(#BE3B7F);
    & .title {
      margin-left: 0px
    }
    & .num {
       height: 40px;
       position: absolute;
       right:20px;
        
     
    }
  }

  .highSearch {
    & .el-input {
      margin: 12px 0;
    }
    & .click_Search {
      width: 101px;
      height: 46px;
      float: right;
    }
  }

  .pageBox {
    text-align: right;
  }
}

</style>
