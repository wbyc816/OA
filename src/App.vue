<template>
  <div id="app" :style="{'padding-top':$route.path=='/home'?'26px':'96px'}" v-if="login">
    <div class="topBar" :class="{'active':scrollBanner}">
      <div class="topNavbar">
        <div class="container">
          <span class="greetText">{{greetText}}好，欢迎您！</span>
          <router-link to="/HR/personalInfo"><i class="iconfont icon-user1"></i> {{userInfo.name}}</router-link>
          <a><i class="iconfont icon-1"></i> 简体</a>
          <a href="#/set"><i class="iconfont icon-shezhi"></i> 设置</a>
          <a @click="loginOut"><i class="iconfont icon-guanbi"></i> 登出</a>
        </div>
      </div>
      <nav class="navbar">
        <div class="container">
          <img src="./assets/images/chi.png" alt="" class="navImgBg">
          <el-row>
            <el-col :span="8">
              <router-link to="/home" class="sologo">
                <img src="./assets/images/logo2.png" alt="" v-if="scrollBanner">
                <img src="./assets/images/logo1.png" alt="" v-else>
              </router-link>
            </el-col>
            <el-col :span="16">
              <el-menu default-active="1" mode="horizontal" :router="true">
                <el-menu-item :route="{path:'/home'}" index="1">首页</el-menu-item>
                <el-menu-item :route="{path:'/doc'}" index="2">我的工作</el-menu-item>
                <el-menu-item :route="{path:'/HR'}" index="5">个人中心</el-menu-item>
                <el-menu-item :route="{path:'/contactList'}" index="4">公司同仁</el-menu-item>
                <el-menu-item :route="{path:'/os'}" index="3">业务系统</el-menu-item>
                <el-menu-item :route="{path:''}" index="6"><a href="http://fwoa.donghaiair.cn" target="_blank">旧版系统入口</a></el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </div>
      </nav>
    </div>
    <el-carousel height="382px" arrow="never" v-if="$route.path=='/home'">
      <el-carousel-item v-for="pic in homePics">
        <img :src="pic">
      </el-carousel-item>
    </el-carousel>
    <div class="container" :class="{'childCon':!$route.path=='/home'}">
      <el-breadcrumb separator=" " v-show="breadcrumbShow">
        <el-breadcrumb-item :to="{ path: '/' }"> <i class="iconfont icon-home home"></i> 首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: breadcrumb.path }" v-for="breadcrumb in breadcrumbs">{{breadcrumb.meta.breadcrumb}}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <keep-alive :include="/filesHome/"> -->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </div>
    <footer>
      <div class="container">
        <div class="links clearfix">
          <a href="http://www.donghaiair.com" target="_blank"><img src="./assets/images/foot1.png" alt=""></a>
          <!-- <div class="flRight"> -->
          <a href="http://www.eastpacific.com.cn" target="_blank"><img src="./assets/images/foot2.png" alt=""></a>
          <a href="http://www.donghaijet.com/" target="_blank"><img src="./assets/images/foot3.png" alt=""></a>
          <a href="http://www.langhamhotels.com/sc/the-langham/shenzhen/" target="_blank"><img src="./assets/images/foot4.png" alt=""></a>
          <a href="http://www.szanbao.com.cn/Cn/" target="_blank"><img src="./assets/images/foot5.png" alt=""></a>
          <!-- </div> -->
        </div>
        <div class="copyRight clearfix">
          <div class="appBox flLeft clearfix">
            <div class="leftBox flLeft">
              <i class="iconfont icon-fankui"></i>
              <span>APP下载</span>
            </div>
            <div class="rightBox flLeft" @mouseenter="qrShow=true" @mouseleave="qrShow=false">
              <img src="./assets/images/logo3.png" alt="">
              <span>东海E网APP</span>
              <transition name="el-zoom-in-bottom">
                <div class="qrBox" v-show="qrShow">
                  <span>东海E网APP</span>
                  <img src="http://efile.donghaiair.cn/install/QRcode_ewang.png" alt="">
                  <p class="phoneIcon">
                    <i class="iconfont icon-anzhuo"></i>
                    <i class="iconfont icon-ios"></i>
                  </p>
                </div>
              </transition>
            </div>
          </div>
          <span class="flRight">COPYRIGHT @2017 东海航空有限公司 ALLRIGHTS RESERVED</span>
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import '../static/urlConfig'
import Vue from 'vue'
import router from './router'
import jquery from 'jquery'
export default {
  name: 'app',
  data: function() {
    return {
      homePics: [],
      breadcrumbs: [],
      routers: [],
      breadcrumbShow: false,
      scrollBanner: false,
      baseUrl: '',
      login: false,
      pdR: '',
      qrShow: false
    }
  },
  computed: {
    greetText: function() {
      var now = new Date()
      return now.getHours() < 12 ? '上午' : '下午'
    },
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    if (process.env.NODE_ENV == 'development') { //开发环境
      this.baseUrl = urlConfig.devUrl
    } else {
      this.baseUrl = urlConfig.loginUrl
    }
    if (this.getCookie('homeAd')) {
      this.$store.commit('setHomeHasShow', true);
    }
    if (this.getCookie('userId')) {
      this.$store.commit('setEmpId', this.getCookie('userId'));
      this.$store.dispatch('getUserInfo');
      this.login = true;
    } else {
      var a = document.createElement('a');
      a.setAttribute('href', this.baseUrl + "/login.html");
      // a.setAttribute('target', '_self');
      a.setAttribute('id', 'payUrl');
      // 防止反复添加
      if (!document.getElementById('payUrl')) document.body.appendChild(a);
      a.click();
    }
    this.getHomePics();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    var routes = this.$router.options.routes;
    for (var a = 0; a < routes.length; a++) {
      if (!routes[a].redirect) {
        this.routers.push(routes[a])
        if (routes[a].children) {
          var subChildren = routes[a].children;
          for (var b = 0; b < subChildren.length; b++) {
            if (!subChildren[b].redirect) {
              this.routers.push(subChildren[b]);
              if (subChildren[b].children) {
                var rootChildren = subChildren[b].children;
                for (var c = 0; c < rootChildren.length; c++) {
                  if (!rootChildren[c].redirect) {
                    this.routers.push(rootChildren[c]);
                  }
                }
              }
            }
          }
        }
      }
    }
    this.outBreadcrumbs();
  },
  methods: {
    loginOut() {
      this.delCookie('userId');
      location.href = this.baseUrl + "/login.html"
    },
    outBreadcrumbs() {
      this.breadcrumbs = [];
      var tempRoute = this.$route.fullPath.split('/');
      // console.log(tempRoute)
      if (tempRoute[1] == 'home' || tempRoute[1] == 'home#' || tempRoute[1] == 'HR') {
        this.breadcrumbShow = false;
      } else {
        this.breadcrumbShow = true;
        tempRoute.shift();
        for (var i = 0; i < tempRoute.length; i++) {
          tempRoute[i] = '/' + tempRoute[i];
        }
        var tempRoutes = [];
        for (var i = 0; i < tempRoute.length; i++) {
          if (i != 0) {
            tempRoutes.push(tempRoutes[i - 1] + tempRoute[i]);
          } else {
            tempRoutes.push(tempRoute[i])
          }
        }
        for (var i = 0; i < tempRoutes.length; i++) {
          for (var j = 0; j < this.routers.length; j++) {
            if (this.routers[j].meta && this.routers[j].meta.breadcrumb && tempRoutes[i] == this.routers[j].path) {
              this.breadcrumbs.push(this.routers[j]);
            }
          }
        }
      }
    },
    handleScroll() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      // console.log(this.$route);
      if (scrollTop > 360) {
        this.scrollBanner = true;
      } else {
        this.scrollBanner = false;
      }
    },
    getHomePics() {
      if (this.$route.path == '/home') {
        if (this.homePics.length == 0) {
          this.$http.post('/index/getBasicImage', { imageType: 'ADM0601' })
            .then(res => {
              if (res.status == 0) {
                this.homePics = res.data;
              }
            })
        }
      }
    }
  },
  watch: {
    '$route' (to, from) {
      this.getHomePics();
      this.outBreadcrumbs();
      // window.scrollTo(0, 0);
      // if(window.scroll){
      //   window.scroll({ "behavior": "smooth", "top": 0 })
      // }
      // jquery('body,html').animate({ scrollTop: 0 }, 10);
    },
  }
}

</script>
<style lang="scss">
$purple: #1465C0;
$brown: #985D55;
@import '../theme/index.css';
@import './assets/styles/variables.scss';
.el-breadcrumb__separator {
  width: 16px;
  display: inline-block;
  height: 10px;
  font-family: 'element-icons' !important;
  speak: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  font-size: 12px;
  &:before {
    content: "\E602";
  }
}

.home {
  position: relative;
}

#app {
  padding-top: 26px;
  min-height: 100%;
  padding-bottom: 170px;
  position: relative;
}

.topBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 999;

  &.active {
    .topNavbar {
      background-color: #07A9E9;
    }
    .navbar {
      background-color: #0460AE;
      z-index: 1;
      ul.el-menu li {
        color: #fff;
        &.is-active {
          color: #FFD702;
        }
      }
    }
  }
}

.clearfix:after {
  content: "";
  display: block;
  clear: both;
}

.el-carousel {
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.16);
  margin-bottom: 20px;
  .el-carousel__item img {
    height: 100%;
  }
  .el-carousel__indicators {
    left: 50%;
    transform: translateX(-50%);
    bottom: 23px;
    .el-carousel__indicator {
      padding: 0 2px; // display:none;
      button {
        width: 12px;
        height: 12px;
        border-radius: 12px;
        opacity: 1;
        transition: all 0.4s;
        margin-left: 6px;
      }
      &.is-active {
        button {
          width: 40px;
          background: #5e98d8;
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

.topNavbar {
  background: #1465C0;
  text-align: right;
  .greetText {
    color: #fff;
  }
  a {
    color: #fff;
    line-height: 25px;
    padding: 0 15px;
    text-decoration: none;
    cursor: pointer;
    display: initial;
    &+a {
      border-left: 1px solid #7B7B7B;
    }
    &:last-child {
      padding-right: 0
    }
  }
}

.sologo {
  line-height: 70px;
  font-size: 0;
  float: left;
  cursor: pointer;
  img {
    vertical-align: top;
  }
  .icon {
    height: 47px;
    &.hka {
      width: 90px;
      border-right: 1px solid #A2A2A2;
      padding-right: 10px;
      margin-right: 10px;
    }
    &.so {
      width: 110px;
    }
  }
}

.navbar {
  position: relative;
  z-index: 3;
  background-color: rgba(255, 255, 255, 0.8);
  -webkit-transition-duration: .45s;
  -webkit-transition-property: height;
  -webkit-transition-delay: 0s;
  -webkit-transition-timing-function: 'ease-in-out';
  transition-duration: .45s;
  transition-property: height;
  transition-delay: 0s;
  transition-timing-function: 'ease-in-out'; // margin-bottom: 15px;
  .container {
    position: relative;
    .navImgBg {
      position: absolute;
      opacity: 0.14;
      box-sizing: border-box;
      top: -25px;
      left: 265px;
      z-index: 2;
    }
  }
  ul {
    float: right;
    box-shadow: none;
    &.el-menu--horizontal .el-menu-item {
      height: 70px;
      line-height: 70px;
      padding: 0 22px 0 22px !important;
      &.is-active {
        color: #1465C0;
      }
    }
    &.el-menu {
      background-color: inherit;
      li {
        line-height: 79px;
        font-size: 19px;
        text-decoration: none;
        display: block;
        position: relative;
        overflow: hidden;
        border-bottom: 2px solid transparent;
        .el-submenu__title {
          color: #777777;
          font-size: 19px;
        }
        &:hover {
          background: none !important;
          border-bottom: 2px solid transparent;
        }
        &:last-child {
          padding-left: 0!important;
          padding-right: 0!important;
          a {
            display: inline-block;
            padding-left: 22px;
            float: left;
          }
        }
      }
    }
  }
  .sub-menu {
    background: rgba(129, 85, 160, .85);
    width: 100%;
    height: 0;
    overflow: hidden;
    transition-property: height;
    transition-duration: 1s;
    -moz-transition-property: height;
    /* Firefox 4 */
    -moz-transition-duration: 1s;
    /* Firefox 4 */
    -webkit-transition-property: height;
    /* Safari and Chrome */
    -webkit-transition-duration: 1s;
    /* Safari and Chrome */
    -o-transition-property: height;
    /* Opera */
    -o-transition-duration: 1s;
    /* Opera */
    &.open {
      height: 50px;
    }
    div.container>ul {
      &>li {
        float: left;
        list-style: none;
        position: relative;
        flex: 1;
        a,
        span {
          line-height: 50px;
          color: #fff;
          font-size: 18px;
          text-decoration: none;
          cursor: pointer
        }
      }
      li+li {
        margin-left: 20px;
      }
    }
  }
  .childMenu {
    position: absolute;
    top: 143px;
    left: 0;
    background: rgba(59, 49, 65, .91);
    width: 100%;
    z-index: 200;
    -webkit-transition-duration: .45s;
    -webkit-transition-property: all;
    -webkit-transition-delay: 0s;
    -webkit-transition-timing-function: 'ease-in-out';
    transition-duration: .45s;
    transition-property: all;
    transition-delay: 0s;
    transition-timing-function: 'ease-in-out';
    overflow: hidden;
    ul {
      padding: 10px 0;
      position: absolute;
      -webkit-transition-duration: .45s;
      -webkit-transition-property: left;
      -webkit-transition-delay: 0s;
      -webkit-transition-timing-function: 'ease-in-out';
      transition-duration: .45s;
      transition-property: left;
      transition-delay: 0s;
      transition-timing-function: 'ease-in-out';
      li {
        margin: 10px 0;
        a {
          color: #fff;
          cursor: pointer
        }
      }
    }
  }
}



footer {
  position: absolute;
  bottom: 0;
  left: 0;
  background: #fff;
  width: 100%;
  .container {
    .links {
      font-size: 0;
      border-bottom: 1px solid #D5D5D5; // display:table;
      a {
        // display:table-cell;
        text-align: center;
        float: left;
        line-height: 90px; // float: right;
        img {
          vertical-align: middle;
        }
        &:first-child {
          text-align: left;
        }
        &:last-child {
          text-align: right;
        }
      }
      $widths: (1: 15%, 2: 18%, 3: 18%, 4: 22%, 5: 27%);
      @each $num,
      $width in $widths {
        a:nth-child(#{$num}) {
          width: $width;
        }
      }
    }
    .copyRight {
      text-align: right;
      font-size: 14px;
      line-height: 80px;
      .appBox {
        color: $main;
        .leftBox {
          padding-right: 20px;
          margin: 10px 20px 10px 0;
          line-height: 60px;
          border-right: 1px solid rgb(129, 132, 136);
          i {
            font-size: 40px;
            vertical-align: middle;
            position: relative;
            top: -4px;
            padding-right: 5px;
          }
          span {
            vertical-align: middle;
            width: 30px;
            display: inline-block;
            line-height: 19px;
            text-align: center;
          }
        }
        .rightBox {
          font-size: 0;
          cursor: pointer;
          position: relative;
          >img {
            vertical-align: middle;
            padding: 5px 7px;
            box-shadow: 1px 3px 10px #cecece;
            border-radius: 4px;
            margin-right: 15px;
          }
          >span {
            font-size: 15px;
            vertical-align: middle;
            display: inline-block;
            width: 56px;
            line-height: 19px;
            text-align: left;
          }
          .el-zoom-in-bottom-enter-active,
          .el-zoom-in-bottom-leave-active {
            opacity: 1;
            transform: scaleY(1);
            transition: transform 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms, opacity 300ms cubic-bezier(0.23, 1, 0.32, 1) 100ms;
            transform-origin: center bottom
          }
          .el-zoom-in-bottom-enter,
          .el-zoom-in-bottom-leave-active {
            opacity: 0;
            transform: scaleY(0)
          }
          .qrBox {
            // display: none;
            position: absolute;
            bottom: 75px;
            left: -45px;
            width: 140px;
            padding: 0 7px 5px;
            line-height: 1;
            background: rgba(255, 255, 255, 0.95);
            text-align: left;
            box-shadow: 0 0 8px #dedede;
            span {
              font-size: 15px;
              padding: 12px 0 6px;
              display: inline-block;
            }
            img {
              width: 100%;
              height: auto;
            }
            .phoneIcon {
              text-align: right;
              padding: 5px 0;
              i {
                font-size: 20px;
                color: #555;
                padding-left: 7px; // vertical-align:top;
              }
              .icon-anzhuo {
                font-size: 22px;
                position: relative;
                top: 2px;
              }
            }
          }
          &:hover {
            .qrBox {
              display: block;
            }
          }
        }
      }
    }
  }
}

.el-carousel__item {
  img {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}

</style>
