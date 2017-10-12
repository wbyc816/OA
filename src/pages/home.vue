<template>
  <div id="home">
    <!-- <el-carousel height="347px" arrow="never">
      <el-carousel-item v-for="o in 4">
        <img src="../assets/images/Intersection16.png">
      </el-carousel-item>
    </el-carousel> -->
    <el-row :gutter="20" class="wrapRow">
      <el-col :span="16">
        <!-- <ul class="list-group" v-sortable="optionsDragLeft">
          <li class="list-group-item" :class="{'dragActive':showDrag[0]}">
            <p class="dragHead" v-on:mouseover="dragShow(0)" v-on:mouseleave="dragHide(0)">
              <span v-show="showInfo[0]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[0]=true" v-on:mouseleave="showInfo[0]=false" v-show="showDrag[0]"></i>
            </p> -->
            <el-card class="messageCenter">
              <p slot="header">消息中心</p>
              <el-row :gutter="10">
                <el-col :span="8" :xs='12' v-for="msg in msgs">
                  <message-center :data="msg">
                  </message-center>
                </el-col>
              </el-row>
            </el-card>
          <!-- </li>
          <li class="list-group-item" :class="{'dragActive':showDrag[9]}">
            <p class="dragHead" v-on:mouseover="dragShow(9)" v-on:mouseleave="dragHide(9)">
              <span v-show="showInfo[9]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[9]=true" v-on:mouseleave="showInfo[9]=false" v-show="showDrag[9]"></i>
            </p> -->
            <el-card class="bedoneList" v-if="doneLength!=0">
              <p slot="header">待办事项 <span>{{doneLength}}</span></p>
              <el-carousel height="150px" :autoplay="false" indicator-position="outside" arrow="never">
                <el-carousel-item v-for="(list,index) in doneList" :key="index">
                  <el-row :gutter="20">
                    <el-col :span="12" v-for="item in list">
                      <router-link :to="'/doc/docDetail/'+item.id">
                        <span class="index">{{item.index}}</span>
                        <p class="title">{{item.docTitle}}</p>
                        <div class="timeline">
                          <p>截止日</p>
                          <p>{{item.endTime.slice(0,10)}}</p>
                        </div>
                      </router-link>
                    </el-col>
                  </el-row>
                </el-carousel-item>
              </el-carousel>
            </el-card>
          <!-- </li>
          <li class="list-group-item" :class="{'dragActive':showDrag[1]}">
            <p class="dragHead" v-on:mouseover="dragShow(1)" v-on:mouseleave="dragHide(1)">
              <span v-show="showInfo[1]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[1]=true" v-on:mouseleave="showInfo[1]=false" v-show="showDrag[1]"></i>
            </p> -->
            <el-card class="news">
              <p slot="header"><span>新闻</span>
                <router-link to="#">更多</router-link>
              </p>
              <el-tabs v-model="activeName" class="myTab">
                <el-tab-pane :label="list.name" :name="list.name" v-for="(list,index) in newsList">
                  <router-link :to="'/newsDetail/'+news.id" class="newBox clearfix" v-for="news in list.child" v-if="index<8">
                    <p>{{news.docTitle}}</p>
                    <p><span><i class="iconfont icon-eye"></i><span>{{news.browse}}</span>{{news.createTime | time('xie')}}</span>
                    </p>
                  </router-link>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          <!-- </li>
          <li class="list-group-item" :class="{'dragActive':showDrag[2]}">
            <p class="dragHead" v-on:mouseover="dragShow(2)" v-on:mouseleave="dragHide(2)">
              <span v-show="showInfo[2]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[2]=true" v-on:mouseleave="showInfo[2]=false" v-show="showDrag[2]"></i>
            </p> -->
            <el-card class="shareBox">
              <el-row>
                <el-col :span="12" class="shareWith">
                  <p> <i class="iconfont icon-renmian"></i> 人事任免
                    <router-link to="#">更多</router-link>
                  </p>
                  <ul>
                    <li>
                      <p>关于行政部王莉的人事任命通告 <span class="new">NEW</span></p>
                      <p>人力资源部<span>2016-12-22</span></p>
                    </li>
                    <li>
                      <p>关于货运部物流线主任一职的招募公告</p>
                      <p>人力资源部<span>2016-12-22</span></p>
                    </li>
                    <li>
                      <p>关于运行部周鹤翔的人事任命通告</p>
                      <p>人力资源部<span>2016-12-22</span></p>
                    </li>
                  </ul>
                </el-col>
                <el-col :span="12" class="shareWith myShare">
                  <p> <i class="iconfont icon-hr"></i> HR政策
                    <router-link to="#">更多</router-link>
                  </p>
                  <ul>
                    <li>
                      <p>2017年绩效考核年中考核通知</p>
                      <p>人力资源部<span>2016-12-22</span></p>
                    </li>
                    <li>
                      <p>2017年飞跃新星奖评审开始公告</p>
                      <p>行政部<span>2016-12-22</span></p>
                    </li>
                    <li>
                      <p>年资考评新政策调研通知</p>
                      <p>人力资源部<span>2016-12-22</span></p>
                    </li>
                  </ul>
                </el-col>
              </el-row>
            </el-card>
          <!-- </li>
          <li class="list-group-item" :class="{'dragActive':showDrag[3]}">
            <p class="dragHead" v-on:mouseover="dragShow(3)" v-on:mouseleave="dragHide(3)">
              <span v-show="showInfo[3]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[3]=true" v-on:mouseleave="showInfo[3]=false" v-show="showDrag[3]"></i>
            </p> -->
            <el-card class="report">
              <el-row>
                <el-col :span="8" :xs="24" class="flightStatus">
                  <p class="head top-head">运行报告 2017/09/03</p>
                  <p class="head header">航班状态</p>
                  <div class="content">
                    <span>总航班数: 14</span>
                    <span>出发: 3</span>
                    <span>到达: 0</span>
                    <span>延误: 0</span>
                  </div>
                  <div class="bottom">
                    <div>
                      <i class="iconfont icon-plane"></i>
                      <p class="myLink">飞行报告</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="9" :xs="24" class="daily">
                  <p class="head header">每日报告</p>
                  <div class="content">
                    <span>航空管制延误: 0</span>
                    <span>机场繁忙延误: 0</span>
                    <span>安全原因强制性延误: 0</span>
                    <span>总延误航班: 0</span>
                  </div>
                  <div class="bottom">
                    <div>
                      <i class="iconfont icon-head"></i>
                      <p class="myLink">服务评价报告</p>
                    </div>
                  </div>
                </el-col>
                <el-col :span="7" :xs="24" class="crew">
                  <p class="head header">机组自评报告</p>
                  <div class="content clearfix">
                    <el-col>总航班数: 10</el-col>
                    <el-col>5:0%</el-col>
                    <el-col>4:0%</el-col>
                    <el-col>3:0%</el-col>
                    <el-col>2:0%</el-col>
                    <el-col>1:0%</el-col>
                  </div>
                  <my-polar-area :data="polarAreaData" :options="polarAreaOption"></my-polar-area>
                </el-col>
              </el-row>
            </el-card>
          <!-- </li> -->
          <!-- <li class="list-group-item" :class="{'dragActive':showDrag[4]}">
            <p class="dragHead"  v-on:mouseover="dragShow(4)" v-on:mouseleave="dragHide(4)">
              <span v-show="showInfo[4]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[4]=true" v-on:mouseleave="showInfo[4]=false" v-show="showDrag[4]"></i>
            </p>
            <el-card class="space">
              <span slot="header">My Space</span>
              <el-row  v-for="weibo in weibos">
                <weibo :weibo='weibo'></weibo>
              </el-row>
              <el-input placeholder="Share Something" class="space-bottom">
                <img slot="prepend" src="../assets/images/Image198.png">
                <div slot="append">
                  <i class="iconfont icon-smile"></i>
                  <i class="iconfont icon-pics"></i>
                  <el-button type="primary">Post</el-button>
                </div>
              </el-input>
            </el-card>
          </li> -->
        <!-- </ul> -->
      </el-col>
      <el-col :span="8" class="sideBox">
        <!-- <ul class="list-group" v-sortable="optionsDragRight">
          <li class="list-group-item" :class="{'dragActive':showDrag[5]}">
            <p class="dragHead" v-on:mouseover="dragShow(5)" v-on:mouseleave="dragHide(5)">
              <span v-show="showInfo[5]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[5]=true" v-on:mouseleave="showInfo[5]=false" v-show="showDrag[5]"></i>
            </p> -->
            <side-Person-Search></side-Person-Search>
            <!-- <el-card class="contactList">
              <span slot="header">公司同仁</span>
              <el-input class="search" placeholder="请输入员工姓名">
                <el-button slot="append">搜索</el-button>
              </el-input>
            </el-card> -->
          <!-- </li>
          <li class="list-group-item" :class="{'dragActive':showDrag[6]}">
            <p class="dragHead" v-on:mouseover="dragShow(6)" v-on:mouseleave="dragHide(6)">
              <span v-show="showInfo[6]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[6]=true" v-on:mouseleave="showInfo[6]=false" v-show="showDrag[6]"></i>
            </p> -->
            <duty></duty>
          <!-- </li> -->
          <!-- <li class="list-group-item" :class="{'dragActive':showDrag[10]}">
            <p class="dragHead" v-on:mouseover="dragShow(10)" v-on:mouseleave="dragHide(10)">
              <span v-show="showInfo[10]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[10]=true" v-on:mouseleave="showInfo[10]=false" v-show="showDrag[10]"></i>
            </p> -->
            <el-card class="flightStatus">
              <span slot="header">航班动态</span>
              <el-date-picker v-model="searchDate" type="date" placeholder="选择航班日期" format="yyyy-MM-dd" @change="changDate" class="searchDate" :editable="false" :clearable="false"></el-date-picker>
              <el-radio-group v-model="flightStatusType" class="myRadio">
                <el-radio-button label="flightNo">航班号<i></i></el-radio-button>
                <el-radio-button label="route">航段<i></i></el-radio-button>
              </el-radio-group>
              <div class="flightNo" v-show="flightStatusType=='flightNo'">
                <el-select v-model="flightNoTitle">
                  <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-input class="search">
                  <el-button slot="append" @click="searchFlight">搜索</el-button>
                </el-input>
              </div>
              <div class="route" v-show="flightStatusType=='route'">
                <el-autocomplete class="inline-input" v-model="tripFrom.cityName" :fetch-suggestions="querySearch" placeholder="出发地" @select="handleFrom"></el-autocomplete>
                <el-autocomplete class="inline-input" v-model="tripTo.cityName" :fetch-suggestions="querySearch" placeholder="目的地" @select="handleTo"></el-autocomplete>
                <el-button @click="searchFlight">搜索</el-button>
              </div>
            </el-card>
          <!-- </li>
          <li class="list-group-item" :class="{'dragActive':showDrag[7]}">
            <p class="dragHead" v-on:mouseover="dragShow(7)" v-on:mouseleave="dragHide(7)">
              <span v-show="showInfo[7]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[7]=true" v-on:mouseleave="showInfo[7]=false" v-show="showDrag[7]"></i>
            </p> -->
            <el-card class="Workbench">
              <span slot="header">日常事项</span>
              <el-menu>
                <el-menu-item index="1"><i class="iconfont icon-guizhang"></i>规章制度<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="2"><i class="iconfont icon-shouce"></i>使用手册<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="3"><i class="iconfont icon-mail"></i>总裁邮箱<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="4"><i class="iconfont icon-bianmingongjumeishicaipu"></i>食堂菜谱<i class="el-icon-arrow-right"></i></el-menu-item>
              </el-menu>
            </el-card>
            <el-card class="mailbox">
              <el-menu>
                <el-menu-item index="1"><i class="iconfont icon-changyong"></i>常用办公软件<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="2"><i class="iconfont icon-youhui"></i>优惠机票<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="3"><i class="iconfont icon-icon"></i>飞行准备网<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="5"><i class="iconfont icon-sms"></i>SMS管理系统<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="6"><i class="iconfont icon-rizhi"></i>航后日志系统<i class="el-icon-arrow-right"></i></el-menu-item>
                <el-menu-item index="7"><i class="iconfont icon-weixiu"></i>ME维修信息管理系统<i class="el-icon-arrow-right"></i></el-menu-item>
              </el-menu>
            </el-card>
          <!-- </li> -->
          <!-- <li class="list-group-item" :class="{'dragActive':showDrag[9]}">
            <p class="dragHead"  v-on:mouseover="dragShow(9)" v-on:mouseleave="dragHide(9)">
              <span v-show="showInfo[9]">按住拖拽来改变模块位置 <i class="iconfont icon-jiantouyou"></i></span>
              <i class="iconfont icon-drag handleDrag" v-on:mouseover="showInfo[9]=true" v-on:mouseleave="showInfo[9]=false" v-show="showDrag[9]"></i>
            </p>
            <el-card class="flightSearch">
              <span slot="header">Flight Search</span>
              <el-radio-group v-model="tripType">
                <el-radio label="date">One Way</el-radio>
                <el-radio label="daterange">Round Trip</el-radio>
              </el-radio-group>
              <el-input v-model="tripFrom" placeholder="From">
              </el-input>
              <el-input v-model="tripTo"  placeholder="To" class="pullRight">
              </el-input>
              <search-date :type="tripType"></search-date>
            </el-card>
          </li> -->
        <!-- </ul> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import MyPie from '../components/myPie'
import MyPolarArea from '../components/myPolarArea'
import SearchDate from '../components/searchDate'
import MessageCenter from '../components/message'
import Weibo from '../components/weibo'
import SidePersonSearch from '../components/sidePersonSearch.component'
import DocList from '../components/doc'
import Duty from '../components/duty.component'
var msgs = [
  { "icon": "gou", "color": "#07A9E9", "text": "待批公文:", "value": "0", "link": "/doc/docPending" },
  { "icon": "sousuo", "color": "#7562DE", "text": "公文追踪:", "value": "0", "link": "/doc/docTracking" },
  { "icon": "gongwen", "color": "#BE3B7F", "text": "待阅公文:", "value": "0", "link": "/doc/docToRead" },
  { "icon": "shizhong1", "color": "#FF9300", "text": "超时公文:", "value": "0", "link": "#" },
  { "icon": "icon04", "color": "#1465C0", "text": "生日提醒:", "value": "0", "link": "/BirthdayReminder" },
  { "icon": "dianshi", "color": "#BE3B3B", "text": "会议通知:", "value": "0", "link": "" },
];
const piedata = {
  labels: ['Airport Services', 'Cockpit', 'Cabin', 'HQ Staff', 'Outport Others', 'Outport China', 'MRO'],
  datasets: [{
    backgroundColor: [
      '#97BBCD',
      '#7ED0CF',
      '#DCDCDC',
      '#F7464A',
      '#FDB45C',
      '#DCDCDC',
      '#FAD2A2'
    ],
    data: [2, 688, 1732, 996, 110, 163, 231]
  }]
}
const pieoption = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  }
};
const polarAreaData = {
  labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding'],
  datasets: [{
    label: 'My Second dataset',
    backgroundColor: [
      "#FF6384",
      "#4BC0C0",
      "#FFCE56",
      "#E7E9ED",
      "#36A2EB"
    ],
    pointBackgroundColor: 'rgba(255,99,132,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(255,99,132,1)',
    data: [300, 500, 100, 50, 100]
  }]
};
const polarAreaOption = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  title: {
    display: false,
    text: ''
  },
  scale: {
    ticks: {
      min: 0,
      max: 500,
      stepSize: 100,
      backdropPaddingY: 0
    }
  }
};
const options = [{
  value: '选项1',
  label: 'DZ'
}, ];
export default {
  components: { MyPie, MyPolarArea, SearchDate, MessageCenter, DocList, Weibo, SidePersonSearch, Duty },

  data() {
    return {
      msgs,
      activeName: '',
      piedata,
      pieoption,
      polarAreaData,
      polarAreaOption,
      tripType: 'date',
      tripFrom: { cityName: '' },
      tripTo: { cityName: '' },
      flightStatusType: 'flightNo',
      options,
      flightNoTitle: '选项1',
      showDrag: [false, false, false, false, false, false, false, false, false, false, false],
      showInfo: [false, false, false, false, false, false, false, false, false, false, false],
      optionsDragLeft: {
        group: 'left',
        handle: '.handleDrag',
        animation: 300,
        scrollSensitivity: 100
      },
      optionsDragRight: {
        group: 'right',
        handle: '.handleDrag',
        animation: 300,
        scrollSensitivity: 100
      },
      searchDate: '',
      doneList: [],
      doneLength: 0,
      newsList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'searchLoading',
      'searchRes',
      'depPageNumber',
      'airPortList'
    ])
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getTips();
    })
  },
  created() {
    this.$store.dispatch('getAirPortList');
    let temp = new Date();
    let month = temp.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    this.searchDate = temp.getFullYear() + '-' + month + '-' + temp.getDate();
    this.getDoneList();
    this.getNews();
  },
  methods: {
    dragShow(index) {
      this.showDrag.splice(index, 1, true);
    },
    dragHide(index) {
      this.showDrag.splice(index, 1, false);
    },
    getTips() {
      this.$http.post('/doc/docTips', { empId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            console.log(res.data);
            msgs[1].value = res.data.trackingNum;
            msgs[2].value = res.data.toReadNum; //待阅
            msgs[3].value = res.data.overTimeNum; //超时
            msgs[0].value = res.data.pendingNum; //待批
          }
        }, res => {

        })
    },
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
    changDate() {
      let temp = new Date(this.searchDate);
      let month = temp.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      this.searchDate = temp.getFullYear() + '-' + month + '-' + temp.getDate();
    },
    searchFlight() {
      if (this.searchDate != 'NaN-NaN-NaN') {
        console.log(1110)
        if (this.flightStatusType == "route") {
          if (this.tripFrom.city3cody && this.tripTo.city3cody) {
            if (this.tripFrom.city3cody == this.tripTo.city3cody) {
              this.$message.warning('出发地与目的地相同，请重新选择路线！')
            } else {
              // this.getToRound();

              this.$router.push({ name: 'flightStatus', params: { 'type': 'route', 'date': this.searchDate, 'tripFrom': this.tripFrom, 'tripTo': this.tripTo } })
              this.tripFrom = { 'cityName': '' };
              this.tripTo = { 'cityName': '' };
              this.searchDate = '';
            }
          } else {
            // this.getToDate();
            this.$router.push({ name: 'flightStatus', params: { 'type': 'date', 'date': this.searchDate } })
            this.searchDate = '';
          }
        } else if (this.flightStatusType == "flightNo") {
          console.log(1111)

          if (this.flightNoValue) {
            // this.getToFlightNo();
            this.$router.push({ name: 'flightStatus', params: { 'type': 'route', 'date': this.searchDate, 'flightNoValue': this.flightNoValue, 'flightNoValue': this.flightNoValue } })
            this.searchDate = '';
          } else {
            console.log(1112)
            // this.getToDate();
            this.$router.push({ name: 'flightStatus', params: { 'type': 'date', 'date': this.searchDate } })
            this.searchDate = '';
          }
        } else {
          // this.getTorDate();
          this.$router.push({ name: 'flightStatus', params: { 'type': 'date', 'date': this.searchDate } })
          this.searchDate = '';
        }
      } else {
        this.$message.warning('请选择航班日期!')
      }
    },
    getDoneList() {
      this.$http.post('/doc/backlogList', { userId: this.userInfo.empId })
        .then(res => {
          if (res.status == 0) {
            if (Array.isArray(res.data)) {
              this.doneLength = res.data.length;

              res.data.forEach((r, index) => r.index = index + 1);
              for (var i = 0; i < res.data.length; i += 6) {
                if (res.data.slice(i, i + 6)) {
                  this.doneList.push(res.data.slice(i, i + 6))
                }
              }
            } else {
              this.doneLength = 0;
            }
          }
        }, res => {

        })
    },
    getNews() {
      this.$http.post('/api/getDict', { dictCode: 'ADM04' })
        .then(res => {
          if (res.status == 0) {
            res.data.forEach(r => this.newsList.push({ name: r.dictName, code: r.dictCode, child: [] }));
            this.activeName = this.newsList[0].name;
            this.$http.post('/doc/selectFileList', { empId: this.userInfo.empId })
              .then(res1 => {
                if (res1.status == 0) {
                  if (Array.isArray(res1.data.selectDocInfoVolist)) {
                    res1.data.selectDocInfoVolist.forEach(news => {
                      this.newsList.forEach(data => {
                        if (data.code == news.classify1) {
                          data.child.push(news)
                        }
                      });
                    })
                  }
                }
              })
          } else {
            console.log('获取发文类型失败')
          }
        }, res => {

        })
    },
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;
$lan:#0460AE;
$sub:#1465C0;

#home {

  .list-group {
    .list-group-item {
      position: relative;
      .el-card,
      .el-menu {
        // border: 1px solid transparent;
        &.personnel {
          border-bottom-width: 0;
        }
      }
      .dragHead {
        position: absolute;
        width: 100%;
        line-height: 46px;
        height: 46px;
        padding: 0 12px;
        text-align: right;
        top: 0;
        box-sizing: border-box;
        color: #95989A;
        cursor: pointer;
        z-index: 9;
        i {
          vertical-align: middle;
        }
        .handleDrag {
          padding: 10px 0 10px 5px;
          color: $main;
          font-size: 20px;
          cursor: move;
        }
      }
    } // .dragActive {
    //   position: relative;
    //   &:before {
    //     content: '';
    //     position: absolute;
    //     width: 100%;
    //     height: 100%;
    //     top: 0;
    //     left: 0;
    //     border: 1px solid $main;
    //   }
    //   .el-card,
    //   >.el-menu {
    //     &.personnel {
    //       border-bottom-width: 1px;
    //       margin-bottom: 19px;
    //     }
    //   }
    // }
  }
  .el-carousel {
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.16);
    margin-bottom: 20px;
    .el-carousel__indicators {
      right: 10px;
      top: 23px;
      left: inherit;
      transform: inherit;
      .el-carousel__indicator {
        padding: 0 2px;
        button {
          width: 13px;
          height: 13px;
          border-radius: 100%;
          opacity: 1;
        }
        &.is-active {
          button {
            background: $main;
          }
        }
      }
    }
    @media (max-width: 768px) {
      & {
        margin-bottom: 1px;
      }
    }
  }
  .wrapRow {
    @media (max-width: 1200px) {
      margin:0!important;
      .el-col:first-child {
        padding: 0!important
      }
    }
  }
  .news {
    padding: 0;
    .el-card__header {

      border-bottom: none;


      color: #151515;
      overflow: hidden;
      padding: 0 15px 0 0;
      p {
        line-height: 35px;
        span {
          display: inline-block;
          background-color: #F7F7F7;
          font-size: 18px;
          width: 236px;
          padding-left: 15px;
        }
        a {
          float: right;
          font-size: 14px;
          color: #676767;
        }
      }
    }
    .el-card__body {
      padding: 0;
    }
    .myTab .el-tabs__header .el-tabs__item {
      line-height: 92px;
      height: 92px;
    }
    .el-tab-pane {
      .newBox {
        border-top: 1px solid #F2F2F2;
        padding-left: 15px;
        line-height: 50px;
        overflow: hidden;
        display: block;
        p:first-child {
          font-size: 15px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          padding-right: 20px;
          width: 400px;
          color: #393939;
          float: left;
        }
        p.new {
          &:after {
            content: 'new';
            position: absolute;
            top: 1px;
            right: 0;
            font-size: 12px;
            background: $main;
            color: #fff;
            border-radius: 3px;
            padding: 0 2px;
          }
        }
        p:last-child {
          font-size: 12px;
          float: right;
          &>span {
            float: right;
            height: 50px;
            i {
              color: $main;
            }
            span {
              padding: 0 7px 0 5px;
              margin-right: 7px;
              border-right: 1px solid #BFBFBF;
            }
          }
        }
      }
    }
  }
  .personnel {
    padding: 0;
    border: none;
    .el-card__body {
      &>.el-row {
        .el-col:first-child {
          font-size: 0; // padding-right:15px;
          img {
            max-width: 100%;
          }
          .el-row {
            padding-top: 10px;
            .el-col:first-child {
              height: 158px;
              position: relative;
              ul {
                position: absolute;
                list-style: none;
                padding: 0;
                margin: 0;
                bottom: 0;
                li {
                  font-size: 13px;
                  position: relative;
                  padding-left: 15px;
                  margin-bottom: 2px;
                  span {
                    position: absolute;
                    left: 0;
                    bottom: 3px;
                    width: 10px;
                    height: 10px;
                    border-radius: 2px;
                  }
                }
              }
            }
            .el-col:last-child {
              &>div {
                height: 120px;
                width: 120px;
                float: right;
                margin-bottom: 10px;
              }
              p {
                margin: 0;
                font-size: 12px;
                text-align: right;
                clear: both;
                color: #676767;
              }
            }
          }
        }
        &>.el-col:nth-child(2),
        &>.el-col:nth-child(3) {
          padding: 35px 15px 0;
          height: 158px;
          ul {
            position: absolute;
            bottom: 0;
            padding-bottom: 13px;
            li {
              margin: 4px 0 0;
            }
          }
        }
        &>.el-col:nth-child(2) {
          // border-left:1px solid #EEEEEE;
          border-right: 1px solid #EEEEEE;
          p,
          li {
            color: #BE3B7F;
          }
        }
        &>.el-col:nth-child(3) {
          p,
          li {
            color: $main;
          }
        }
      }
    }
  }
  .report {
    .el-col {
      position: relative;
      min-height: 220px;
      .top-head {
        margin-bottom: 30px;
      }
      .header {
        color: $main;
        font-size: 16px;
        margin-bottom: 15px;
      }
      .content {
        span {
          display: inline-block;
          width: 49%;
          margin-bottom: 5px;
        }
      }
      .bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        div {
          display: flex;
          position: relative;
          padding: 10px 0 0 50px;
          margin: 0 10px;
          height: 40px;
          flex-direction: column;
          justify-content: space-between;
          border-top: 1px solid #F2F2F2;
          i:first-child {
            color: $main;
            font-size: 40px;
            position: absolute;
            left: 0;
            bottom: -10px;
            &.icon-plane {
              background: #0460ae;
              color: #fff;
              width: 40px;
              font-size: 22px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              border-radius: 50%;
            }
            &.icon-plane+p {
              margin-top: 10px;
            }
          }
          span,
          p {
            color: $main;
            font-size: 15px;
          }
        }
      }
    }
    .flightStatus {
      padding-right: 15px;
      .bottom {
        div {
          margin-left: 0;
        }
      }
    }
    .daily {
      padding: 20px 15px 0;
      border-right: 1px solid #EEEEEE;
      border-left: 1px solid #EEEEEE;
      .content span {
        width: 100%;
      }
      .bottom {
        div {
          justify-content: center;
          p {
            font-size: 16px;
          }
        }
      }
    }
    .crew {
      padding: 20px 15px 0;
      .content .el-col {
        font-size: 13px;
        height: auto;
        margin-bottom: 1px;
        min-height: 0;
      }
      &>div:last-child {
        width: 140px;
        height: 150px;
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
    @media (max-width: 768px) {
      .el-col {
        min-height: 0;
        .bottom {
          position: relative;
        }
      }
      .daily {
        padding: 10px 0 0;
        .bottom div {
          margin-left: 0;
        }
      }
      .crew {
        min-height: 200px;
        padding: 20px 0 0;
        &>div:last-child {
          right: 30px;
        }
      }
    }
  }
  .shareBox {
    .el-card__body {
      padding: 0 12px;
    }
    .shareWith {
      border-right: 1px solid #E9E9E9;
      padding-right: 14px;
      &>p {
        font-size: 18px;
        color: $main;
        line-height: 45px;
        border-bottom: 1px solid #E9E9E9;
        padding: 0 15px 0 3px;
        i {
          font-size: 20px;
          vertical-align: middle;
          margin-right: 10px;
        }
        a:last-child {
          float: right;
          font-size: 14px;
          color: #676767;
          cursor: pointer;
        }
      }
      ul {
        li {
          padding: 18px 7px 18px;
          border-top: 1px solid #E9E9E9;
          color: #676767;
          cursor: pointer;
          p:first-child {
            font-size: 16px;
            line-height: 30px;
            img {
              vertical-align: sub;
              padding-right: 5px;
            }
            .new {
              font-size: 12px;
              font-weight: normal;
              background: #FF9300;
              color: #fff;
              border-radius: 2px;
              padding: 0 2px;
              vertical-align: top;
            }
          }
          p:last-child {
            margin-top: 10px;
            font-size: 12px;
            span {
              float: right;
            }
          }
        }
        li:first-child {
          border-top: none;
        }
      }
    }
    .myShare {
      border: none;
      padding-right: 0;
      padding-left: 14px;
      .purpleTip {
        background: $main;
        color: #fff;
        padding: 5px 10px;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
      }
      .greyTip {
        background: #AAAAAA;
      }
    }
  }
  .bedoneList {
    position: relative;
    &:before {
      content: '';
      height: 80%;
      border-left: 1px solid #EEEEEE;
      position: absolute;
      top: 50%;
      left: 48%;
      transform: translate(-50%, -50%);
    }
    .el-card__header {
      border-bottom: none;
      padding-bottom: 10px;
      span {
        color: $main;
        margin-left: 10px;
      }
    }
    .el-card__body {
      padding-top: 0;
      padding-bottom: 10px;
    }
    .el-carousel {
      box-shadow: none;
      position: static!important;
      .el-carousel__indicators {
        top: 23px;
        right: 19px;
        position: absolute;
        z-index: 10;
        .el-carousel__indicator button {
          width: 8px;
          height: 8px;
        }
      }
    }
    .el-carousel__item {
      background: transparent;
    }
    .el-col {
      line-height: 50px;
      font-size: 15px;
      cursor: pointer;
      position: relative;
      a {
        color: #676767;
      }
      &:nth-child(odd) {
        .title {
          width: 255px;
        }
        .timeline {
          right: 30px;
        }
      }
      .index {
        color: $sub;
        display: inline-block;
        margin-right: 3px;
        vertical-align: middle;
        &.beRead {
          color: #BE3B7F;
        }
      }
      .title {
        display: inline-block;
        vertical-align: middle;
        width: 270px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .timeline {
        line-height: 16px;
        position: absolute;
        text-align: right;
        font-size: 12px;
        right: 10px;
        top: 5px;
      }
    }
  }
  .space {
    padding-bottom: 5px;
    .el-card__body {
      &>.el-row {
        border-bottom: 1px solid #f2f2f2;
      }
      .space-bottom {
        padding-top: 10px;
        .el-input-group__prepend {
          border: none;
          padding-right: 20px;
          img {
            width: 47px;
            height: 55px;
          }
        }
        input {
          margin-top: 6px;
          border: none;
          background: #F2F2F2;
          border-radius: 4px;
        }
        .el-input-group__append {
          border: none;
          div {
            display: inline-table;
            button {
              display: inline-block;
              font-size: 16px;
              margin: 0 0 0 10px;
              height: 38px;
              background: $main;
              color: #fff;
              padding: 10px 25px;
            }
            i {
              font-size: 30px;
              color: $main;
              padding: 0 3px;
              vertical-align: middle;
              display: table-cell;
            }
          }
          @media (max-width:768px) {
            & {
              display: block;
            }
          }
        }
      }
    }
  }
  .contactList {
    .el-card__header {
      border-bottom: 1px solid #f2f2f2;
    }
    .el-card__body {
      padding-top: 10px;
    }
  }
  @mixin linkList($color) {
    .el-card__header {
      padding-left: 14px;
      border-bottom: 1px solid #f2f2f2;
    }
    .el-card__body {
      padding: 0;
    }
    .el-menu-item {
      border-bottom: 1px solid #f2f2f2;
      font-size: 16px;
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
        line-height: 56px;
        position: absolute;
        right: 20px;
        top: 0;
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
  .Workbench {
    padding: 0;
    @include linkList($main);
  }
  .mailbox {
    padding: 0;
    @include linkList(#BE3B7F);
  }
  .flightSearch {
    padding: 13px 0 20px;
    .el-card__header {
      padding-left: 12px;
      border-bottom: 1px solid #F2F2F2;
    }
    .el-card__body {
      padding: 0 12px;
      .el-radio-group {
        display: block;
        margin: 20px 0;
      }
      &>.el-input {
        display: inline-block;
        width: 49%;
        margin-bottom: 10px;
      }
      .pullRight {
        float: right;
      }
    }
  }
  .flightStatus {
    padding: 0 0 20px;
    .el-card__header {
      padding-left: 12px;
      border-bottom: 1px solid #F2F2F2;
    }
    .el-card__body {
      padding: 20px 12px 0 12px;
      .searchDate {
        display: inline-flex;
        width: 40%;
        .showDate {
          border-right: 1px solid #b7b7b7;
        }
      }
      .el-radio-group {
        display: inline-flex;
        float: right;
        .el-radio-button {
          margin: 0 0 0 6px;
          .el-radio-button__inner {
            padding: 0 30px;
            line-height: 45px;
            height: 45px;
          }
        }
        @media (max-width:1200px) {
          & {
            float: initial;
            margin-top: 10px;
            .el-radio-button:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }
    .flightNo {
      margin-top: 10px;
      .el-select {
        width: 20%;
      }
      .search {
        width: 78%;
        float: right;
      }
    }
    .route {
      margin-top: 10px;
      .el-autocomplete {
        width: 35%;
        float: left;
        &:first-child {
          padding-right: 5px;
        }
        &:nth-child(2) {
          padding-right: 5px;
        }
      }
      button {
        float: right;
        font-size: 18px;
        width: 30%;
        height: 46px;
        color: #fff;
        background: $main;
        border-color: $main;
      }
    }
  }
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

</style>
