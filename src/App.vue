<template>
  <div id="app">
    <div class="mobieMenu" @click="menuToggle">
      <i class="iconfont icon-iconfuzhi"></i>
    </div>
    <div class="topBar" :class="{'active':scrollBanner}">
      <div class="chiBox">
        <img src="./assets/images/chi.png" alt="">
      </div>
      <div class="topNavbar">
        <div class="container">
          <a><i class="iconfont icon-1"></i> 简体</a>
          <a><i class="iconfont icon-shezhi"></i> 设置</a>
          <a><i class="iconfont icon-user1"></i> 莫瑶瑶</a>
          <a><i class="iconfont icon-guanbi"></i> 登出</a>
        </div>
      </div>
      <nav class="navbar">
        <div class="container">
          <el-row>
            <el-col :span="8">
              <div class="sologo">
                <img src="./assets/images/logo2.png" alt="" v-if="scrollBanner">
                <img src="./assets/images/logo1.png" alt="" v-else>
              </div>
            </el-col>
            <el-col :span="16">
              <el-menu default-active="1" mode="horizontal" v-bind:class="{'open':mobieMenu}">
                <el-menu-item index="1">首页</el-menu-item>
                <el-menu-item index="5">个人中心</el-menu-item>
                <el-menu-item index="2">我的工作</el-menu-item>
                <el-menu-item index="3">业务系统</el-menu-item>
                <el-menu-item index="4">公司同仁</el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </div>
        <div class="sub-menu" v-bind:class="{'open':shouSubMenu}" v-on:mouseleave="dropdownHidden()">
          <div class="container clearfix">
            <ul>
              <li v-for="(sub,index) in subMenu" ref="subMenu" :key="sub.name">
                <span v-on:mouseenter="dropdown(sub.child,index)" v-goto="{path:sub.path}" @click="dropdownHidden">{{sub.name}}</span>
              </li>
            </ul>
          </div>
          <div class="childMenu" v-bind:style="childMenuStyle">
            <ul ref="childMenu" v-bind:style="childUlStyle">
              <li v-for="child in childMenu" :key="child.name">
                <router-link :to="child.path" @click="dropdownHidden">{{child.name}}</router-link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    <el-carousel height="429px" arrow="never">
      <el-carousel-item>
        <img src="./assets/images/bg4.jpg">
      </el-carousel-item>
      <el-carousel-item>
        <img src="./assets/images/bg2.jpg">
      </el-carousel-item>
      <el-carousel-item>
        <img src="./assets/images/bg5.jpg">
      </el-carousel-item>
    </el-carousel>
    <div class="container">
      <el-breadcrumb separator=" " v-show="breadcrumbShow">
        <el-breadcrumb-item :to="{ path: '/' }"> <i class="iconfont icon-home home"></i> Home</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: breadcrumb.path }" v-for="breadcrumb in breadcrumbs">{{breadcrumb.meta.breadcrumb}}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-view></router-view>
    </div>
    <footer>
      <img src="./assets/images/footBg.png" alt="">
    </footer>
  </div>
</template>
<script>
import Vue from 'vue'
import Sortable from 'sortablejs'
import router from './router'
Vue.directive('goto', {
  bind: function(el, binding) {
    el.addEventListener("click", function() {
      console.log('111');
      if (binding.value.path) {

        if (new RegExp("^http").test(binding.value.path)) {
          window.open(binding.value.path);
        } else {
          router.push({ path: binding.value.path });
        }
      } else if (binding.value.name) {
        router.push({ name: binding.value.name });
      }
    });
  }
});
Vue.directive('sortable', {
  inserted: function(el, binding) {
    new Sortable(el, binding.value || {})
  }
})
export default {
  name: 'app',
  data: function() {
    return {
      subMenu: {},
      shouSubMenu: false,
      mobieMenu: false,
      childMenuStyle: {
        height: 0
      },
      childUlStyle: {
        left: 0
      },
      childMenu: [],
      menu: [{
          "menus": [{
              "name": "Organization Structure",
              "path": "/organizationStructure",
              "child": []
            },
            {
              "name": "E-personnel",
              "path": "/E-personnel",
              "child": [
                { "name": "Personal Info", "path": "#" },
                { "name": "Reimbursement", "path": "/E-personnel/reimbursement" },
                { "name": "Benefits", "path": "#" },
                { "name": "Nomination List", "path": "#" },
                { "name": "Travel Record", "path": "#" },
                { "name": "Leave Record", "path": "#" },
                { "name": "Personal", "path": "#" },
                { "name": "Tax Return", "path": "#" }
              ]
            },
            {
              "name": "General Info",
              "path": "/generalInfo",
              "child": [
                { "name": "Forms", "path": "/generalInfo/forms" },
                { "name": "Policies", "path": "#" },
                { "name": "Training", "path": "#" },
                { "name": "Contact List", "path": "/generalInfo/contactList" },
                { "name": "Company News", "path": "/generalInfo/news" },
                { "name": "E-School", "path": "#" },
                { "name": "Daily News & Ads Update", "path": "#" },
                { "name": "Department News", "path": "#" },
                { "name": "Notice", "path": "#" },
                { "name": "Meeting Reservation", "path": "/generalInfo/MeetingReservation" },
                { "name": "Crew Evaluation", "path": "#" },
                { "name": "Task Assignment", "path": "/generalInfo/taskAssignment" },
                { "name": "Duty List", "path": "#" },
                { "name": "Leave & Duty Trip", "path": "/generalInfo/leaveDutyTrip" },
                { "name": "Staff Movement", "path": "#" },
                { "name": "MyBenefit", "path": "/generalInfo/myBenefit" }
              ]
            },
            {
              "name": "Doc Approval Sys",
              "path": "/doc",
              "child": [
                { "name": "Doc Submission", "path": "/doc/docSub" },
                { "name": "Doc Tracking", "path": "/doc/docTracking" },
                { "name": "Batch Approval ", "path": "#" },
                { "name": "Action List", "path": "#" },
                { "name": "Follow Up List", "path": "#" },
                { "name": "Doc Searching", "path": "#" },
                { "name": "Payment Searching", "path": "/doc/paymentSearch" },
                { "name": "Doc Report", "path": "#" },
                { "name": "System Managment", "path": "#" },
                { "name": "Doc Archive", "path": "#" },
                { "name": "Reimbursement Summary", "path": "#" },
                { "name": "Outstanding Payment", "path": "#" }
              ]
            },
            {
              "name": "Staff Center",
              "path": "/staffCenter",
              "child": [
                { "name": "My Account", "path": "#" },
                { "name": "Public Mailbox", "path": "#" },
                { "name": "IT Service", "path": "/staffCenter/jobRequest" },
                { "name": "Flight Information", "path": "/staffCenter/flightSearch" },
                { "name": "Booking Hotel", "path": "#" },
                { "name": "Sign Dest", "path": "#" },
                { "name": "My Attendance", "path": "#" },
                { "name": "Attendance Monitor", "path": "#" },
                { "name": "Appeal Searching", "path": "#" },
                { "name": "Appeal Handling", "path": "#" },
                { "name": "Contract Budget Info", "path": "#" },
                { "name": "Budget Monitor", "path": "#" },
                { "name": "Egress Apply", "path": "#" },
                { "name": "Egress Apply Handle", "path": "#" },
                { "name": "Attendance List", "path": "#" }
              ]
            },
            {
              "name": "Cabin Crew Center",
              "path": "#",
              "child": [
                { "name": "Taxi Claim Request", "path": "#" },
                { "name": "Taxi Claim Management", "path": "#" },
              ]
            }
          ]
        },
        {
          "menus": [{
              "name": "CMS",
              "path": "http://ui.loogk.com/hkairlines/CMS",
              "child": []
            },
            {
              "name": "SOMS",
              "path": "http://ui.loogk.com/hkairlines/SOBack",
              "child": []
            },
            {
              "name": "E-LIBRARY",
              "path": "http://ui.loogk.com/hkairlines/ELibrary",
              "child": []
            },
            {
              "name": "PNS",
              "path": "http://ui.loogk.com/hkairlines/PNS",
              "child": []
            },
            {
              "name": "E-LIBMS",
              "path": "http://ui.loogk.com/hkairlines/ELibraryBack",
              "child": []
            },
            {
              "name": "PMS",
              "path": "#",
              "child": []
            },
            {
              "name": "PMP",
              "path": "#",
              "child": []
            },
            {
              "name": "SNS",
              "path": "#",
              "child": []
            },
            {
              "name": "FCS",
              "path": "#",
              "child": []
            },
            {
              "name": "SSO",
              "path": "#",
              "child": []
            },
            {
              "name": "FOP",
              "path": "#",
              "child": []
            },
            {
              "name": "PSMS",
              "path": "#",
              "child": []
            },
            {
              "name": "HNA Mail System",
              "path": "#",
              "child": []
            },
            {
              "name": "PDSS",
              "path": "#",
              "child": []
            },
            {
              "name": "IFNS",
              "path": "#",
              "child": []
            },
            {
              "name": "AMS",
              "path": "#",
              "child": []
            }
          ]
        }
      ],
      breadcrumbs: [],
      routers: [],
      breadcrumbShow: false,
      scrollBanner: false
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.menuToggle();
      if (key > 2) {
        this.subMenu = this.menu[key - 3].menus;
        if (this.subMenu.length > 0) {
          this.shouSubMenu = true;
        }
      } else {
        this.shouSubMenu = false;
      }
    },
    dropdown(child, key) {
      this.childMenu = child;
      var self = this;
      setTimeout(function() {
        self.childUlStyle.left = self.$refs.subMenu[key].getBoundingClientRect().left + "px";
        if (child.length > 0) {
          self.childMenuStyle.height = self.$refs.childMenu.getBoundingClientRect().height + "px";
          self.childMenuStyle['border-top'] = '1px solid #fff';
        } else {
          self.childMenuStyle.height = "0px";
          self.childMenuStyle['border-top'] = 'none';
          setTimeout(function() {
            self.childMenuStyle['border-top'] = 'none';
          }, 450)
        }
      }, 10);
    },
    dropdownHidden() {
      var self = this;
      this.childMenuStyle.height = "0px";
      self.childMenuStyle['border-top'] = 'none';
      setTimeout(function() {
        self.childMenuStyle['border-top'] = 'none';
      }, 450)
    },
    outBreadcrumbs() {
      this.breadcrumbs = [];
      var tempRoute = this.$route.fullPath.split('/');
      if (tempRoute[1] == 'home' || tempRoute[1] == 'home#') {
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
    menuToggle() {
      this.mobieMenu = !this.mobieMenu;
    },
    handleScroll() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      console.log(scrollTop)
      if (scrollTop > 360) {
        this.scrollBanner = true;
      } else {
        this.scrollBanner = false;
      }
    }
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
                for (c = 0; c < rootChildren.length; c++) {
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
  watch: {
    '$route' (to, from) {
      this.outBreadcrumbs();
      window.scrollTo(0, 0);
    }
  }
}

</script>
<style lang="scss">
$purple: #1465C0;
$brown: #985D55;
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
}

.topBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  .chiBox {
    width: 1200px;
    margin: 0 auto;
    position: absolute;
    opacity: 0.14;
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 265px;
    z-index: 2;
  }
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
    vertical-align: middle;
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
  ul {
    float: right;
    box-shadow: none;
    &.el-menu--horizontal .el-menu-item {
      height: 70px;
      line-height: 70px;
      padding: 0 0 0 45px !important;
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
        } // &.hasSubMenu a.active:after{
        //   font-family:"iconfont" !important;
        //   content:"\e67d";
        //   position: absolute;
        //   color:rgba(129,85,160,.85);
        //   width:100%;
        //   bottom:-7px;
        //   left:0px;
        //   line-height: initial;
        //   text-align:center;
        // }
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

.el-dropdown-menu {
  top: 138px !important;
}

footer {
  line-height: 190px;
  text-align: center;
  font-size: 0;

  background: #fff;
  img {
    vertical-align: middle;
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
