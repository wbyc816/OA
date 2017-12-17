<template>
  <div id="home">
    <el-row :gutter="20" class="wrapRow">
      <el-col :span="16">
        <!-- 消息中心 -->
        <el-card class="messageCenter">
          <p slot="header">消息中心</p>
          <el-row :gutter="10">
            <el-col :span="8" v-for="msg in msgs">
              <message-center :data="msg">
              </message-center>
            </el-col>
          </el-row>
        </el-card>
        <!-- 待办事项 -->
        <el-card class="bedoneList" :class="{'noLine':doneLength<4}" v-if="doneLength!=0">
          <p slot="header">待办事项 <span>{{doneLength}}</span></p>
          <el-carousel :height="doneHeight+'px'" :autoplay="false" :indicator-position="doneLength>6?'outside':'none'" arrow="never">
            <el-carousel-item v-for="(list,index) in doneList" :key="index">
              <el-row :gutter="20">
                <el-col :span="doneLength>3?12:24" v-for="(item,itemIndex) in list" :class="{higher:itemIndex>1&&doneLength>3}">
                  <router-link :to="{path:'/doc/docDetail/'+item.id,query:{code:item.docTypeCode}}">
                    <span class="index">{{item.index}}</span>
                    <p class="title">{{item.docTitle}}</p>
                    <div class="timeline">
                      <p v-if="item.endTime">截止日</p>
                      <p>{{item.endTime.slice(0,10)}}</p>
                    </div>
                  </router-link>
                </el-col>
              </el-row>
            </el-carousel-item>
          </el-carousel>
        </el-card>
        <!-- 新闻 -->
        <el-card class="news">
          <p slot="header"><span @click="homeVisible=true">新闻</span>
            <router-link to="FilesHome">更多</router-link>
          </p>
          <el-tabs v-model="activeName" class="myTab" @tab-click="getNew">
            <el-tab-pane :label="list.name" :name="list.code" v-for="(list,index) in newsList" v-if="list.code!='ADM0405'&&list.code!='ADM0407'">
              <router-link :to="'/newsDetail/'+news.id" class="newBox clearfix" v-for="(news,newIndex) in list.child" v-if="newIndex<6">
                <p><span class="title">{{news.docTitle}}</span> <span class="newsnew" v-if="news.isRead==='0'">NEW</span></p>
                <p><span><i class="iconfont icon-eye"></i><span>{{news.browse}}</span>{{news.createTime | time('xie')}}</span>
                </p>
              </router-link>
            </el-tab-pane>
          </el-tabs>
        </el-card>
        <!-- 人事任免 -->
        <el-card class="shareBox">
          <el-row>
            <el-col :span="12" class="shareWith">
              <p> <i class="iconfont icon-renmian"></i> 人事任免
                <router-link :to="{ name: 'newsListHr', params: { classify: 'FIL0301' }}">更多</router-link>
              </p>
              <ul>
                <li v-for="(hr,index) in hr1" v-if="index<3" @click="goTo(hr)">
                  <p><span class="title">{{hr.fileNameOld}}</span> <span class="new" v-if="hr.isRead==='0'">NEW</span></p>
                  <p>{{hr.majorName}}<span>{{hr.createTime | time('date')}}</span></p>
                </li>
              </ul>
            </el-col>
            <el-col :span="12" class="shareWith myShare">
              <p> <i class="iconfont icon-guizhang"></i> 规章制度
                <router-link :to="{ name: 'newsListHr', params: { classify: 'FIL0303' }}">更多</router-link>
              </p>
              <ul>
                <li v-for="(hr,index) in hr2" v-if="index<3" @click="goTo(hr)">
                  <p><span class="title">{{hr.fileNameOld}}</span> <span class="new" v-if="hr.isRead==='0'">NEW</span></p>
                  <p>{{hr.majorName}}<span>{{hr.createTime | time('date')}}</span></p>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-card>
        <!-- 运行报告 -->
        <el-card class="report">
          <el-row>
            <el-col :span="7" class="flightStatus">
              <p class="head top-head">运行报告 {{new Date().getTime() | time('xie')}}</p>
              <p class="head header">航班状态</p>
              <div class="content">
                <span>总航班数: {{flightTrends.sumFlight}}</span>
                <span>出发: {{flightTrends.departure}}</span>
                <span>到达: {{flightTrends.arrival}}</span>
                <span>计划: {{flightTrends.sumFlight-flightTrends.departure-flightTrends.arrival}}</span>
              </div>
            </el-col>
            <el-col :span="8" class="daily">
              <p class="head header">每日报告</p>
              <div class="content">
                <span>航空管制延误: {{flightTrends.controlDelay}}</span>
                <span>机场繁忙延误: {{flightTrends.busyAirportDelay}}</span>
                <span>安全原因强制性延误: {{flightTrends.securityDelay}}</span>
                <span>总延误航班: {{flightTrends.sumDelay}}</span>
              </div>
            </el-col>
            <el-col :span="9" class="crew">
              <p class="head header">航班运行报告</p>
              <div class="content clearfix">
                <p>总航班数: {{flightTrends.sumFlight}}</p>
                <p><span :style="{'background':pieBg[0]}"></span>到达: {{flightTrends.arrival/flightTrends.sumFlight | percent}}</p>
                <!-- <p><span :style="{'background':pieBg[1]}"></span>延误: {{flightTrends.delay/flightTrends.sumFlight | percent}}</p> -->
                <p><span :style="{'background':pieBg[2]}"></span>出发: {{flightTrends.departure/flightTrends.sumFlight | percent}}</p>
                <p><span :style="{'background':pieBg[3]}"></span>计划: {{(flightTrends.sumFlight-flightTrends.departure-flightTrends.arrival)/flightTrends.sumFlight | percent}}</p>
              </div>
              <div ref="mypie"></div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8" class="sideBox">
        <side-Person-Search></side-Person-Search>
        <duty></duty>
        <!-- 航班动态 -->
        <el-card class="flightStatus">
          <span slot="header">航班动态</span>
          <el-date-picker v-model="searchDate" type="date" placeholder="选择航班日期" format="yyyy-MM-dd" @change="changDate" class="searchDate" :editable="false" :clearable="false" :picker-options="pickerOptions0"></el-date-picker>
          <el-radio-group v-model="flightStatusType" class="myRadio">
            <el-radio-button label="flightNo">航班号<i></i></el-radio-button>
            <el-radio-button label="route">航段<i></i></el-radio-button>
          </el-radio-group>
          <div class="flightNo" v-show="flightStatusType=='flightNo'">
            <el-select v-model="flightNoTitle">
              <el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input class="search">
              <el-button slot="append" @click="searchFlight" :maxlength="10">搜索</el-button>
            </el-input>
          </div>
          <div class="route" v-show="flightStatusType=='route'">
            <el-select v-model="tripFrom.airportName" filterable placeholder="出发地" @change="handleFrom">
              <el-option v-for="item in airPortList" :key="item.airportName" :label="item.cityName" :value="item.airportName">
              </el-option>
            </el-select>
            <el-select v-model="tripTo.airportName" filterable placeholder="目的地" @change="handleTo">
              <el-option v-for="item in airPortList" :key="item.airportName" :label="item.cityName" :value="item.airportName">
              </el-option>
            </el-select>
            <el-button @click="searchFlight">搜索</el-button>
          </div>
        </el-card>
        <!-- 日常事项 -->
        <el-card class="Workbench">
          <span slot="header">日常事项</span>
          <el-menu>
            <el-menu-item index="1" @click.native="goToOthers('/HR/newsListHr/FIL0302')"><i class="iconfont icon-hr"></i>HR政策<i class="el-icon-arrow-right"></i></el-menu-item>
            <el-menu-item index="2" @click.native="goToOthers('/HR/newsListHr/FIL0304')"><i class="iconfont icon-shouce"></i>使用手册<i class="el-icon-arrow-right"></i></el-menu-item>
            <el-menu-item index="3" @click.native="goToOthers('/PresidentMailbox')"><i class="iconfont icon-mail"></i>总裁邮箱<i class="el-icon-arrow-right"></i></el-menu-item>
            <el-menu-item index="4" @click.native="goToOthers('/diningMenu')"><i class="iconfont icon-bianmingongjumeishicaipu"></i>食堂菜谱<i class="el-icon-arrow-right"></i></el-menu-item>
            <el-menu-item index="5" @click.native="goToOthers('/meeting/meetingApp')" v-if="userInfo.isDocsec&&userInfo.isDocsec[0]==1"><i class="iconfont icon-Group22"></i>会议预订<i class="el-icon-arrow-right"></i></el-menu-item>
            <el-menu-item index="6" @click.native="goToOthers('/supplier')"><i class="iconfont icon-geren"></i>客户维护<i class="el-icon-arrow-right"></i></el-menu-item>
            <el-menu-item index="7" @click.native="goToOthers('/flightReport')" v-if="userInfo.isDocsec&&userInfo.isDocsec[2]==1"><i class="iconfont icon-99"></i>飞行报表<i class="el-icon-arrow-right"></i></el-menu-item>
            <el-menu-item index="8" @click.native="goToOthers('/flightException')" v-if="userInfo.isDocsec&&userInfo.isDocsec[2]==1"><i class="iconfont icon-plane1"></i>飞行任务书数据异常监控<i class="el-icon-arrow-right"></i></el-menu-item>
          </el-menu>
        </el-card>
        <el-card class="mailbox">
          <el-menu>
            <el-menu-item :index="link.text" v-for="link in otherLinks" @click.native="goToOthers(link.link)"><i class="iconfont" :class="'icon-'+link.icon"></i>{{link.text}}<i class="el-icon-arrow-right"></i></el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="homeVisible" size="large" custom-class="homeDialog">
      <!-- <img src="../assets/images/homeImg.jpg" alt=""> -->
      <el-carousel height="432px" arrow="hover">
        <el-carousel-item>
          <img src="../assets/images/homeImg1.jpg">
        </el-carousel-item>
        <el-carousel-item>
          <img src="../assets/images/homeImg2.jpg">
        </el-carousel-item>
        <el-carousel-item>
          <img src="../assets/images/homeImg3.jpg">
        </el-carousel-item>
        <el-carousel-item>
          <img src="../assets/images/homeImg4.jpg">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SearchDate from '../components/searchDate'
import MessageCenter from '../components/message'
import SidePersonSearch from '../components/sidePersonSearch.component'
import DocList from '../components/doc'
import Duty from '../components/duty.component'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);
var msgs = [
  { "icon": "gou", "color": "#07A9E9", "text": "待批公文:", "value": "0", "link": "/doc/docPending" },
  { "icon": "gongwen", "color": "#BE3B7F", "text": "待阅公文:", "value": "0", "link": "/doc/docToRead" },
  { "icon": "sousuo", "color": "#7562DE", "text": "公文追踪:", "value": "0", "link": "/doc/docTracking" },
  { "icon": "shizhong1", "color": "#FF9300", "text": "超时公文:", "value": "0", "link": { name: 'docPending', params: { isOverTime: '1' } } },
  { "icon": "icon04", "color": "#1465C0", "text": "生日提醒:", "value": "0", "link": "/BirthdayReminder" },
  { "icon": "dianshi", "color": "#BE3B3B", "text": "会议通知:", "value": "0", "link": "/meeting/meetingSearch/1" },
];

const otherLinks = [
  { "icon": "xiazai1", "text": "各类模板下载", "link": "/templateDownload" },
  { "icon": "changyong", "text": "常用办公软件", "link": "/softDownload" },
  // {"icon":"youhui","text":"优惠机票","link":"#"},
  { "icon": "icon", "text": "飞行准备网", "link": "http://foc.donghaiair.cn:8011/SignIn.aspx" },
  { "icon": "sms", "text": "SMS管理系统", "link": "http://sms.donghaiair.cn:8080/login.jsp" },
  { "icon": "rizhi", "text": "航后日志系统", "link": "http://192.168.8.79:8016/Login.aspx" },
  { "icon": "weixiu", "text": "ME维修信息管理系统", "link": "http://192.168.8.154/mis2" },
  { "icon": "houtaiguanli", "text": "E网后台管理系统", "link": "http://eback.donghaiair.cn" },
  { "icon": "money", "text": "财务预算系统", "link": "http://efin.donghaiair.cn/" },
]

const pieoption = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false
  }
};
const options = [{
  value: '选项1',
  label: 'DZ'
}, ];
const pieBg = ['#97BBCD', '#F7464A', '#DCDCDC', '#7ED0CF']
export default {
  components: { SearchDate, MessageCenter, DocList, SidePersonSearch, Duty },

  data() {
    return {
      chart: {
        // plotBorderWidth: 500,        //绘图区边框宽度
      },
      optionOne: {

        credits: {
          enabled: false
        },
        title: {
          text: ''
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
        tooltip: {
          headerFormat: '{series.name}<br>',
          pointFormat: '  {point.name}' +
            ': <b>{point.y}</b><br/>'

        },
        colors: [
          '#97BBCD', '#DCDCDC', '#7ED0CF'
        ],
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            }
          }
        },
        //  series: [{
        //     type: 'pie',
        //     name: '航班占比',
        //     data: [
        //         ['到达'],
        //         ['延误'],
        //         ['出发'],
        //         ['计划'],
        //     ]
        // }]
        series: [{
          size: "120px",
          type: 'pie',
          name: '航班数量',
        }]

      },
      msgs,
      activeName: '',
      pieBg,

      pieoption,
      otherLinks,
      tripType: 'date',
      tripFrom: { airportName: '' },
      tripTo: { airportName: '' },
      flightStatusType: 'flightNo',
      options,
      hr1: [],
      hr2: [],
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
      doneHeight: 150,
      newsList: [],
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
      pickerOptions0: {
        disabledDate(time) {
          var td = new Date();
          var d = new Date(td.getFullYear() + '-' + (td.getMonth() + 1) + '-' + td.getDate() + ' 00:00:00').getTime();
          return time.getTime() < (d - 24 * 60 * 60 * 1000) || time.getTime() > (d + 24 * 60 * 60 * 1000);
        }
      },
      homeVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'searchLoading',
      'searchRes',
      'depPageNumber',
      'airPortList',
      'docTips',
      'newsType',
      'homeHasShow'
    ])
  },
  mounted() {
    this.initChart();
    if (!this.homeHasShow) {
      this.$store.commit('setHomeHasShow', true);
      this.setCookie('homeAd', '1')
      setTimeout(() => {
        this.homeVisible = true;
      }, 500)
      // setTimeout(() => {
      //   this.homeVisible = false;
      // }, 5000)
    }
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
    this.getFlightTrends();
    this.getOtherNews('FIL0301');
    this.getOtherNews('FIL0303');
  },
  watch: {
    docTips(newVal) {
      msgs[2].value = newVal.trackingNum; //追踪
      msgs[1].value = newVal.toReadNum; //待阅
      msgs[3].value = newVal.overTimeNum; //超时
      msgs[0].value = newVal.pendingNum; //待批
      msgs[4].value = newVal.birthdayNum; //生日
      msgs[5].value = newVal.conferenceNum; //会议
    }
  },
  methods: {
    getFlightTrends() {
      this.$http.post('/index/getFlightTrends', { flightDate: this.timeFilter(new Date().getTime(), 'date') })
        .then(res => {
          this.flightTrends = res.data;
          this.optionOne.series[0].data = [
            [],
            [],
            []
          ];
          this.optionOne.series[0].data[0].push("到达");
          this.optionOne.series[0].data[1].push("出发");
          this.optionOne.series[0].data[2].push("计划");
          this.optionOne.series[0].data[0].push(parseFloat(this.flightTrends.arrival));
          this.optionOne.series[0].data[1].push(parseFloat(this.flightTrends.departure));
          this.optionOne.series[0].data[2].push(parseFloat((this.flightTrends.sumFlight - this.flightTrends.departure - this.flightTrends.delay - this.flightTrends.arrival)));
          this.chart = new Highcharts.Chart(this.$refs.mypie, this.optionOne);
        })
    },
    initChart() {
      // console.log(this.$el);
      // this.$el.style.width = 100 + 'px';
      // this.$el.style.height =  100+'px';
      this.chart = new Highcharts.Chart(this.$refs.mypie, this.optionOne);
    },
    goToOthers(link) {
      if (/^http/.test(link)) {
        window.open(link);
      } else {
        this.$router.push(link);
      }
    },
    dragShow(index) {
      this.showDrag.splice(index, 1, true);
    },
    dragHide(index) {
      this.showDrag.splice(index, 1, false);
    },
    getTips() {
      this.$store.dispatch('getDocTips');
    },
    handleFrom(val) {
      this.tripFrom = this.clone(this.airPortList.find(i => i.airportName == val));
    },
    handleTo(val) {
      this.tripTo = this.clone(this.airPortList.find(i => i.airportName == val));
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
        if (this.flightStatusType == "route") {
          if (this.tripFrom.city3cody && this.tripTo.city3cody) {
            if (this.tripFrom.city3cody == this.tripTo.city3cody) {
              this.$message.warning('出发地与目的地相同，请重新选择路线！')
            } else {
              // this.getToRound();

              this.$router.push({ name: 'flightStatus', params: { 'type': 'route', 'date': this.searchDate, 'tripFrom': this.tripFrom, 'tripTo': this.tripTo } })
              this.tripFrom = { 'airportName': '' };
              this.tripTo = { 'airportName': '' };
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
              switch (this.doneLength) {
                case 1:
                  this.doneHeight = 50;
                  break;
                case 2:
                case 4:
                  this.doneHeight = 100;
                  break;
                case 3:
                  this.doneHeight = 150;
                  break;
                default:
                  this.doneHeight = 150;
              }
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
            this.activeName = this.newsList[0].code;
            this.getNew();
          } else {

          }
        }, res => {

        })
    },
    getNew(tab) {
      this.$http.post('/doc/selectFileList', { empId: this.userInfo.empId, classify1: this.activeName, sort: 0 })
        .then(res => {
          if (res.status == 0) {
            var temp = this.newsList.find(t => t.code == this.activeName);
            temp.child = res.data.selectDocInfoVolist;
          }
        })
    },
    getOtherNews(classify) {
      this.$http.post('/index/selectFileList', { classify2: classify, empId: this.userInfo.empId })
        .then(res1 => {
          if (res1.status == 0) {
            if (classify == 'FIL0301') {
              this.hr1 = res1.data;
            } else {
              this.hr2 = res1.data;
            }
          }
        })
    },
    goTo(data) {
      this.$router.push('/HR/newsDetailHr/' + data.fileId);
    }
  }
}

</script>
<style lang="scss">
$main: #0460AE;
$brown: #985D55;
$lan:#0460AE;
$sub:#1465C0;

#home {
  .homeDialog {
    width: 1080px;
    .el-dialog__header {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      z-index: 3;
      .el-dialog__headerbtn .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      padding: 0;
      .el-carousel {
        margin-bottom: 0;
      }
    }
  }
  .messageCenter {
    .el-card__header {
      border-bottom: none;
      padding: 10px 20px 0;
    }
  }
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
    }
  } // .wrapRow {
  //   @media (max-width: 1200px) {
  //     margin:0!important;
  //     .el-col:first-child {
  //       padding: 0!important
  //     }
  //   }
  // }
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
      line-height: 70px;
      height: 70px;
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
          overflow: hidden; // padding-right: 50px;
          width: 370px;
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
            color: #676767;
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
    .newsnew {
      font-size: 12px;
      background: #FF9300;
      color: #fff;
      border-radius: 3px;
      padding: 0 2px;
      vertical-align: top;
      margin-left: 2px;
    }
    .title {
      display: inline-block;
      max-width: 330px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      float: left;
      padding-right: 0px;
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
      min-height: 190px;
      .top-head {
        margin-bottom: 45px;
      }
      .header {
        color: $main;
        font-size: 16px;
        margin-bottom: 15px;
      }
      .content {
        font-size: 16px;
        span {
          display: inline-block;
          width: 49%;
          margin-bottom: 5px;
        }
      }
    }
    .flightStatus {
      padding-right: 15px;
      .header {
        margin-bottom: 20px;
      }
      .content {
        overflow: hidden;
        span {
          float: left;
          width: 65%;
          margin-bottom: 5px;
          &:nth-child(even) {
            width: 35%;
          }
        }
      }
    }
    .daily {
      padding: 3px 15px 0;
      border-right: 1px solid #EEEEEE;
      border-left: 1px solid #EEEEEE;
      .header {
        margin-bottom: 38px;
      }
      .content span {
        width: 100%;
        font-size: 16px;
      }
    }
    .crew {
      padding: 3px 0 0 30px;
      .content {
        position: absolute;
        right: -10px;
        bottom: 0;
        width: inherit;
        p {
          font-size: 13px;
          position: relative;
          padding-left: 15px;
          &:first-child {
            padding-left: 0;
          }
          span {
            position: absolute;
            left: 0;
            bottom: 3px;
            width: 10px;
            height: 10px;
            border-radius: 2px;
            margin-bottom: 0;
          }
        }
      }
      &>div:last-child {
        width: 140px;
        height: 150px;
        position: absolute;
        bottom: 0;
        left: 30px;
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
            line-height: 23px;
            img {
              vertical-align: sub;
              padding-right: 5px;
            }
            .title {
              display: inline-block;
              max-width: 90%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
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
      margin-bottom: 20px;
      box-shadow: none;
      position: static!important;
      .el-carousel__indicators {
        top: 23px;
        right: 19px;
        position: absolute;
        left: inherit;
        transform: inherit;
        z-index: 1;
        .el-carousel__indicator {
          padding: 0 2px;
          button {
            width: 8px;
            height: 8px;
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
    }
    .el-carousel__item {
      background: transparent;
    }
    .el-col {
      line-height: 60px;
      font-size: 15px;
      cursor: pointer;
      position: relative;
      &.higher {
        line-height: 50px;
        .timeline {
          p:first-child {
            visibility: hidden;
            padding-top: 0;
            height: 14px;
          }
        }
      }
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
        p:first-child {
          padding-top: 10px;
        }
      }
    }
    &.noLine {
      &:before {
        display: none;
      }
      .el-col {
        line-height: 50px;
        .title {
          width: 600px;
        }
        .timeline {
          right: 30px;
        }
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
          } // @media (max-width:768px) {
          //   & {
          //     display: block;
          //   }
          // }
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
        } // @media (max-width:1200px) {
        //   & {
        //     float: initial;
        //     margin-top: 10px;
        //     .el-radio-button:first-child {
        //       margin-left: 0;
        //     }
        //   }
        // }
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
      .el-select {
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
