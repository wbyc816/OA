<template>
  <div id="app" v-if="login">
    <div class="topBar">
      <div class="container clearfix">
        <router-link to="/home" class="sologo">
          <img src="./assets/images/logo2.png" alt="">
        </router-link>
        <div class="rightNav">
          <img src="./assets/images/chi.png" alt="" class="navImgBg">
          <div class="topNavbar clearfix">
            <div class="borderBg"></div>
            <a href="http://fwoa.donghaiair.cn" target="_blank" class="oldLink"><i class="iconfont icon-zhexian"></i>旧版系统</a>
            <div class="flRight">
              <span class="greetText">{{greetText}}好，欢迎您！</span>
              <router-link to="/HR/personalInfo"><i class="iconfont icon-user1"></i> {{userInfo.name}}</router-link>
              <a><i class="iconfont icon-1"></i> 简体</a>
              <a href="#/set"><i class="iconfont icon-shezhi"></i> 设置</a>
              <a @click="loginOut"><i class="iconfont icon-guanbi"></i> 登出</a>
            </div>
          </div>
          <div class="bottomNavbar">
            <el-menu default-active="1" mode="horizontal" :router="true">
              <el-menu-item :route="{path:'/home'}" index="1">首页</el-menu-item>
              <el-menu-item :route="{path:'/doc'}" index="2">我的工作</el-menu-item>
              <el-menu-item :route="{path:'/HR'}" index="5">个人中心</el-menu-item>
              <el-menu-item :route="{path:'/contactList'}" index="4">公司同仁</el-menu-item>
              <el-menu-item :route="{path:'/os'}" index="3">业务系统</el-menu-item>
              <!-- <el-menu-item :route="{path:''}" index="6"></el-menu-item> -->
            </el-menu>
          </div>
        </div>
      </div>
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
      <keep-alive >
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
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
              <!-- <i class="iconfont icon-fankui"></i> -->
              <span>APP下载</span>
            </div>
            <div class="rightBox flLeft">
              <div class="qrBox">
                <img src="http://efile.donghaiair.cn/install/QRcode_ewang.png" alt="">
                <i class="iconfont icon-anzhuo"></i>
                <i class="iconfont icon-ios"></i>
              </div>
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
    // window.addEventListener('scroll', this.handleScroll);
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
  padding-top: 96px;
  min-height: 100%;
  padding-bottom: 190px;
  position: relative;
}

.topBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 999;
  background-color: $main;
  background-image: url(assets/images/leftCorner.png);
  background-repeat: no-repeat;
  .rightNav {
    float: right;
    width: 750px;
    position: relative; // overflow-y:hidden;
    // overflow-x:visible;
    .navImgBg {
      position: absolute;
      box-sizing: border-box;
      top: 0;
      height: 98px;
      right: -10px;
      z-index: 1;
    }
  }

  .topNavbar {
    position: relative;
    .borderBg {
      position: absolute;
      border-bottom: 1px solid #fff;
      width: 9999px;
      left: 0;
      bottom: 0;
    }
    .oldLink {
      float: left;
      line-height: 29px;
      padding-left: 0;
      i {
        font-size: 13px;
        padding-right: 5px;
      }
    }
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
      position: relative;
      z-index: 2;
      &+a {
        border-left: 1px solid #fff;
      }
      &:last-child {
        padding-right: 0
      }
    }
  }
  .bottomNavbar {
    position: relative;
    z-index: 1;

    ul {
      // float: right;
      box-shadow: none;
      position: relative;
      z-index: 2;
      &.el-menu--horizontal .el-menu-item {
        height: 70px;
        line-height: 70px;
        padding: 0 22px 0 22px !important;
        color: #fff;
        &.is-active {
          color: #FFD702;
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
            color: #fff;
            font-size: 19px;
          }
          &:hover {
            background: none !important;
            border-bottom: 2px solid transparent;
          }
          &:first-child {
            padding-left: 0!important;
          }
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



.sologo {
  padding-top: 13px;
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
      padding: 5px 0;
      .appBox {
        color: $sub;
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
          .qrBox {
            width: 110px;
            padding: 0 0 0 20px;
            line-height: 1;
            position: relative;
            img {
              width: 100%;
              height: auto;
            }
            i {
              font-size: 20px;
              color: #555;
              position: absolute;
              left: -5px;
              top: 42px
            }
            .icon-anzhuo {
              top: 17px;
              font-size: 22px;
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
