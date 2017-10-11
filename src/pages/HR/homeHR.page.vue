<template>
  <div id="homeHR">
    <el-row :gutter="12">
      <el-col :span="17">
        <router-view></router-view>
      </el-col>
      <el-col :span="7" class="sideBar">
        <el-card class="borderCard searchBox" v-show="$route.path=='/HR/clildHR'">
          <div slot="header">新闻查询</div>
          <el-input class="search">
            <el-button slot="append">搜索</el-button>
          </el-input>
        </el-card>
        <el-card class="borderCard searchBox" v-show="$route.name=='salary' || $route.name =='salaryHistory'">
          <div slot="header">工资单查询</div>
          <el-row>
            <el-col :span="18">
              <el-date-picker v-model="salaryDate" type="daterange" :editable="false" placeholder="起始及截止日期" format="yyyy-MM">
              </el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-button @click="searchSalary" class="searchSalary">搜索</el-button>
            </el-col>
          </el-row>

        </el-card>
        <!-- <el-card class="borderCard searchBox" v-show="$route.name== 'salary' || $route.name == 'salaryHistory'">
          <div slot="header">最新工资单</div>
          <el-row class="newSalary">
            <el-col :span="12" v-for="month in newSalaryList">
              <router-link :to="'/HR/salary/'+month.value">{{month.label}}</router-link>
            </el-col>
          </el-row>
        </el-card>
 -->        <el-card class="department borderCard">
          <div slot="header">人力资源</div>
          <el-menu class="el-menu-vertical-demo" :default-openeds="['个人中心','我要申请','薪资绩效','相关链接']">
            <el-submenu :index="menu.title" v-for="(menu,index) in menuList" :key="menu.title">
              <template slot="title">{{menu.title}}</template>
              <el-menu-item :index="child.path" v-for="child in menu.child" :key="menu.name">
                <a :href="child.path" :target="child.target">
                   {{child.name}}
                </a>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="Advanced search" v-model="dialogFormVisible" size="tiny">
      <el-form :model="form">
        <el-form-item label="Department :" :label-width="formLabelWidth">
          <el-input v-model="form.dep" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="File Name :" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="File Category :" :label-width="formLabelWidth" class="inputButton">
          <el-input v-model="form.Category" auto-complete="off">
            <el-button slot="append">...</el-button>
          </el-input>
          <span>Clear</span>
        </el-form-item>
        <el-form-item label="Release Date From :" :label-width="formLabelWidth">
          <el-date-picker type="date" v-model="form.date"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">Search</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import util from '../../common/util'
const nowDate = new Date();
const nowMonth = nowDate.getMonth() + 1;
const defaultSalaryHistory = ''+'@'+ util.formatTime(nowDate, 'yyyyMM')   // 默认获取历史返回数据有待商榷
const menuList = [{
  title: '个人中心',
  child: [{ name: '个人信息', path: '#/HR/personalInfo' }, { name: '个人简历', path: '#/HR/resume' }, { name: '简历完善', path: '#/HR/editResume' }]
}, {
  title: '我要申请',
  child: [{ name: '请假申请', path: '#' }, { name: '转正申请', path: '#' }, { name: '离职申请', path: '#' }, { name: '工伤事故申请', path: '#' }, { name: '培训申请', path: '#' }, { name: '人事变动', path: '#' }]
},
{
  title: '薪资绩效',
  child: [{ name: '最新工资单', path: '#/HR/salary/1' }, { name: '历史工资单', path: `#/HR/salaryHistory/${defaultSalaryHistory}` }]
}, {
  title: '相关链接',
  child: [{ name: '社会保障系统', path: 'http://www.szsi.gov.cn/', target: '_blank' }, { name: '公积金系统', path: 'http://www.szzfgjj.com/', target: '_blank'}]
}
]
export default {
  components: {},
  data() {
    return {
      menuList,
      dialogFormVisible: false,
      salaryDate: "",
      newSalaryList: [],
      form: {
        name: '',
        dep: '',
        Category: '',
        date: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '210px',
    }
  },
  created() {
    this.getNewSalaryList();
  },
  methods: {
    searchSalary() {
      let startDate = util.formatTime(this.salaryDate[0], 'yyyyMM')
      let endDate = util.formatTime(this.salaryDate[1], 'yyyyMM')
      let param = startDate + '@' + endDate
      this.$router.push({ name: 'salaryHistory', params: { param: param } })
    },
    getNewSalaryList() {
      let temp = new Date();
      let month = temp.getMonth();
      if (temp.getDate() > 8) {
        month = temp.getMonth() + 1;
      }
      let nowYear = temp.getFullYear();
      for (let i = 0; i < 6; i++) {
        if (month == 0) {
          nowYear -= 1;

          month = 12;
        }
        if (month < 10) {
          month = '0' + month;
        } else {
          month = '' + month;
        }
        this.newSalaryList.push({
          label: nowYear + '年' + month + '月',
          value: nowYear + month
        });
        month -= 1;
      }
    }
  }
}

</script>
<style lang="scss">
$main:#0460AE;
$sub:#1465C0;

#homeHR {
  padding-top: 10px;
  .searchSalary {
    background: #0460AE;
    color: #fff;
    height: 46px;
  }
  .newSalary {
    text-align: center;
    a {
      color: #0460AE;
      margin-bottom: 5px;
      display: block;
    }
  }
  .sideBar {
    .searchBox {
      .el-card__header {
        font-size: 18px;
        color: #151515;
        border-bottom: none;
      }
      .el-card__body {
        padding-bottom: 15px;
      }
    }
  }
  .department {
    .el-card__body {
      padding: 0;
    }

    .el-menu-vertical-demo {
      box-shadow: none;
      .el-submenu {
        // padding: 10px 0;
      }
      .el-submenu__title {
        color: #676767;
        font-size: 16px;
        border-bottom: none;
        height: 55px;
        line-height: 50px;
        padding-left: 14px!important;
        border-bottom: 1px solid #E9E9E9; // i {
        //   position: relative;
        //   top: 0;
        //   left: 4px;
        //   padding: 0 4px;
        // }
      }
      .el-menu {
        border-bottom: 1px solid #E9E9E9;
        padding: 10px 0;
      }
      .el-menu-item{
        padding-left: 14px!important;
        font-size: 15px;
        height: 35px;
        line-height: 35px;
        a{
          display:block;
          color: $main;
          white-space: normal;
        }
        
      }
    }
  }
  .Favorite {
    padding: 0;
    .el-card__body>p {
      line-height: 45px;
      font-size: 18px;
      padding: 0 13px;
      border-bottom: 1px solid #E9E9E9;
      span {
        float: right;
        font-size: 14px;
        cursor: pointer;
        color: #676767;
      }
    }
    ul {
      border-bottom: 1px solid #E9E9E9;
      padding: 0 13px 15px;
      li {
        padding: 15px 0 0;
        p {
          font-size: 16px;
          color: #676767;
        }
      }
    }
  }
  .el-dialog {
    width: 702px;
    border-radius: 8px;
    .el-dialog__header {
      text-align: center;
      span {
        font-size: 26px;
        color: #5B3179;
        line-height: 45px;
        font-weight: normal;
      }
    }
    .el-dialog__body {
      padding: 30px 55px 20px 55px;
      .el-form-item__label {
        color: #393939;
        font-size: 20px;
      }
      .el-date-editor {
        width: 100%;
      }
      .inputButton {
        .el-input-group__append {
          border-radius: 0;
          background: #5B3179;
          color: #fff;
          border-color: #5B3179;
        }
        .el-input-group {
          width: 85%;
          button {
            font-size: 20px;
          }
        }
        .el-form-item__content {
          &>span {
            font-size: 20px;
            position: absolute;
            top: 50%;
            margin-top: -22px;
            right: 0;
          }
        }
      }
    }
    .el-dialog__footer {
      text-align: center;
      padding-bottom: 30px;
      padding-top: 0;
      button {
        width: 335px;
        font-size: 20px;
        height: 50px;
        border-radius: 4px;
        background-color: #5B3179;
      }
    }
  }
}
</style>
