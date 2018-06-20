import Vue from 'vue'
import Router from 'vue-router'
import home from 'pages/home'
import util from '../common/util'
import jquery from 'jquery'
import store from '../store/'
//公文
const doc = () =>
  import ('pages/docApproval.page')
const docSub = () =>
  import ('pages/docSub/docSub.page')
const docTracking = () =>
  import ('pages/docSub/docTracking.page')
const docDetail = () =>
  import ('pages/docSub/docDetail.page')
const docInfo = () =>
  import ('pages/docSub/docInfo.page')
const docSearch = () =>
  import ('pages/docSub/docSearch.page')
const docPending = () =>
  import ('pages/docSub/docPending.page')
const docOverTime = () =>
  import ('pages/docSub/docOverTime.page')
const docToRead = () =>
  import ('pages/docSub/docToRead.page')
const docDraft = () =>
  import ('pages/docSub/docDraft.page')
const docCommonApp = () =>
  import ('pages/docSub/docCommonApp.page')
//公文统计
const macroStatistics = () =>
  import ('pages/docSub/statistical/macroStatistics.page')
const normalStatistics = () =>
  import ('pages/docSub/statistical/normalStatistics.page')
const approveStatistics = () =>
  import ('pages/docSub/statistical/approveStatistics.page')

//会议
const meetingHome = () =>
  import ('pages/meeting/meetingHome.page')
const ReservationAllRoom = () =>
  import ('pages/meeting/reservationAllRoom.page')
const bookingDetail = () =>
  import ('pages/meeting/bookingDetail.page')
const MyBooking = () =>
  import ('pages/meeting/myBooking.page')
const meetingSearch = () =>
  import ('pages/meeting/meetingSearch.page')
const meetingApp = () =>
  import ('pages/meeting/meetingApp.page')

//客户
const supplierHome = () =>
  import ('pages/supplier/supplierHome.page')
const mySupplier = () =>
  import ('pages/supplier/mySupplier.page')
const supplierSearch = () =>
  import ('pages/supplier/supplierSearch.page')
const supplierCreate = () =>
  import ('pages/supplier/supplierCreate.page')

//短信
const SMSHome = () =>
  import ('pages/SMS/SMSHome.page')
const mySMS = () =>
  import ('pages/SMS/mySMS.page')
const SMSDetail = () =>
  import ('pages/SMS/SMSDetail.page')

const SMSSearch = () =>
  import ('pages/SMS/SMSSearch.page')
const SMSApp = () =>
  import ('pages/SMS/SMSApp.page')

//接线
const breakDownHome = () =>
  import ('pages/breakDown/breakDownHome.page')
const myBreakDown = () =>
import ('pages/breakDown/myBreakDown.page')
  const breakDownDetail = () =>
import ('pages/breakDown/breakDownDetail.page')

const breakDownSearch = () =>
  import ('pages/breakDown/breakDownSearch.page')
const breakDownApp = () =>
  import ('pages/breakDown/breakDownApp.page')

//接障
const faultDealHome = () =>
  import ('pages/faultDeal/faultDealHome.page')
const myFaultDeal = () =>
import ('pages/faultDeal/myFaultDeal.page')

  const faultDealDetail = () =>
import ('pages/faultDeal/faultDealDetail.page')

const faultDealSearch = () =>
  import ('pages/faultDeal/faultDealSearch.page')
const faultDealApp = () =>
  import ('pages/faultDeal/faultDealApp.page')

//航班动态
const flightStatus = () =>
  import ('pages/flightStatus.page')


//公司同仁
const contactList = () =>
  import ('pages/ContactList.page')




//东海社区
const dhCommunity = () =>
  import ('pages/dhCommunity.page')

//人力资源
const HR = () =>
  import ('../pages/HR/homeHR.page')
const clildHR = () =>
  import ('../pages/HR/clildHR.page')
const personalInfo = () =>
  import ('../pages/HR/personalInfo.page')
const resume = () =>
  import ('../pages/HR/resume.page')
const editResume = () =>
  import ('../pages/HR/editResume.page')
const salary = () =>
  import ('../pages/HR/salary.page')
const salaryHistory = () =>
  import ('../pages/HR/salaryHistory.page')
const newsDetail = () =>
  import ('../pages/HR/newsDetail.page')
const selfDetail = () =>
  import ('../pages/HR/selfDetail.page')
const newsDetailHr = () =>
  import ('../pages/HR/newsDetailHr.page')
const newsListHr = () =>
  import ('../pages/HR/newsListHr.page')



//菜谱
const diningMenu = () =>
  import ('../pages/diningMenu.page')


//生日提醒
const BirthdayReminder = () =>
  import ('pages/BirthdayReminder.page')

//文件首页
const FilesHome = () =>
  import ('pages/FilesHome.page')


//总裁邮箱
const PresidentMailbox = () =>
  import ('pages/PresidentMailbox.page')
const softDownload = () =>
  import ('../pages/softDownload.page')
//测试
  const test = () =>
  import ('../pages/test.page')
//模板下载
const templateDownload = () =>
  import ('../pages/templateDownload.page')

//飞行报表
const flightReport = () =>
  import ('pages/flightReport.page')

const flightException = () =>
  import ('pages/flightException.page')


const QARData = () =>
  import ('pages/QARData.page')

//版本更新
const updateRecord = () =>
  import ('pages/updateRecord.page')

//论坛发帖
const forumHome = () =>
  import ('pages/forum/forumHome.page')
const forumSearch = () =>
  import ('pages/forum/forumSearch.page')
const forumApp = () =>
  import ('pages/forum/forumApp.page')
const myForum = () =>
  import ('pages/forum/myForum.page')
const contributeManagement = () =>
  import ('pages/forum/contributeManagement.page')

const rewardDetail = () =>
  import ('pages/forum/rewardDetail.page')
const adoptDetail = () =>
  import ('pages/forum/adoptDetail.page')
const praiseDetail = () =>
  import ('pages/forum/praiseDetail.page')
const contributeDetail = () =>
  import ('pages/forum/contributeDetail.page')


const forumDetail = () =>
  import ('../pages/forum/forumDetail.page')
const forumManagementDetail = () =>
  import ('../pages/forum/forumManagementDetail.page')
 

Vue.use(Router)

import operationSystem from './operationSystem'
import duty from './duty'
import set from './set'
const router = new Router({

  // mode: 'history',
  // history: false,
  // hashbang: true,
  routes: [{
      path: '/home',
      name: 'home',
      component: home,
      meta:{
        keepAlive: true // 需要被缓存
      }
    }, {
      path: '/contactList',
      name: 'contactList',
      component: contactList,
      meta: {
        breadcrumb: "公司同仁",
      }
    }, {
      path: '/dhCommunity',
      name: 'dhCommunity',
      component: dhCommunity,
      meta: {
        breadcrumb: "东海社区",
      }
    }, 
    {
      path: '/rewardDetail/:id/:money',
      name: 'rewardDetail',
      component: rewardDetail,
      meta: {
        breadcrumb: "个人奖金详情",
      }
    }, 
    {
      path: '/adoptDetail/:id',
      name: 'adoptDetail',
      component: adoptDetail,
      meta: {
        breadcrumb: "个人采纳详情",
      }
    },
    {
      path: '/praiseDetail/:id/:praise',
      name: 'praiseDetail',
      component: praiseDetail,
      meta: {
        breadcrumb: "个人点赞详情",
      }
    }, 
    {
      path: '/contributeDetail/:id/:money/:adopt/:praise',
      name: 'contributeDetail',
      component: contributeDetail,
      meta: {
        breadcrumb: "个人贡献详情",
      }
    }, {
      path: '/newsDetail/:id',
      name: 'newsDetail',
      component: newsDetail,
      meta: {
        breadcrumb: "新闻详情",
      }
    },{
      path: '/selfDetail/:id',
      name: 'selfDetail',
      component: selfDetail,
      meta: {
        breadcrumb: "自查详情",
      }
    }, 
    {
      path: '/forumDetail/:id',
      name: 'forumDetail',
      component: forumDetail,
      meta: {
        breadcrumb: "论坛详情",
      }
    },
    {
      path: '/forumManagementDetail/:id',
      name: 'forumManagementDetail',
      component: forumManagementDetail,
      meta: {
        breadcrumb: "论坛管理详情",
      }
    },
    {
      path: '/BirthdayReminder',
      name: 'BirthdayReminder',
      component: BirthdayReminder,
      meta: {
        breadcrumb: "生日提醒",
      }
    }, {
      path: '/flightReport',
      name: 'flightReport',
      component: flightReport,
      meta: {
        breadcrumb: "飞行报表",
      }
    }, {
      path: '/flightException',
      name: 'flightException',
      component: flightException,
      meta: {
        breadcrumb: "飞行计划书数据异常报表",
      }
    }, {
      path: '/QARData',
      name: 'QARData',
      component: QARData,
      meta: {
        breadcrumb: "QAR数据展示",
      }
    },
    {
      path: '/updateRecord',
      name: 'updateRecord',
      component: updateRecord,
      meta: {
        breadcrumb: "E网更新记录",
      }
    }, {
      path: '/diningMenu',
      name: 'diningMenu',
      component: diningMenu,
      meta: {
        breadcrumb: "食堂菜谱",
      }
    }, {
      path: '/FilesHome',
      name: 'FilesHome',
      component: FilesHome,
      meta: {
        breadcrumb: "文件首页",
        keepAlive: true // 需要被缓存
      }
    }, {
      path: '/PresidentMailbox',
      name: 'PresidentMailbox',
      component: PresidentMailbox,
      meta: {
        breadcrumb: "总裁邮箱",
      }
    }, {
      path: '/HR',
      name: 'HR',
      component: HR,
      children: [{
        path: '/HR/clildHR',
        name: 'clildHR',
        component: clildHR,
      }, {
        path: '/HR/personalInfo',
        name: 'personalInfo',
        component: personalInfo,
      }, {
        path: '/HR/newsListHr/:classify',
        name: 'newsListHr',
        component: newsListHr
      }, {
        path: '/HR/newsDetailHr/:id',
        name: 'newsDetailHr',
        component: newsDetailHr,
      }, {
        path: '/HR/salary/:salaryMonth',
        name: 'salary',
        component: salary,
      }, {
        path: '/HR/salaryHistory/:param',
        name: 'salaryHistory',
        component: salaryHistory
      }, {
        path: '/HR/resume',
        name: 'resume',
        component: resume,
      }, {
        path: '/HR/editResume',
        name: 'editResume',
        component: editResume,
      }, {
        path: '/HR/',
        redirect: '/HR/clildHR'
      }, ]
    }, {
      path: '',
      redirect: '/home'
    },
    {
      path: '/meeting',
      name: 'meetingHome',
      component: meetingHome,
      meta: {
        // breadcrumb:"会议室预",
      },
      children: [{
          path: '/meeting/ReservationAllRoom/:id',
          name: 'ReservationAllRoom',
          component: ReservationAllRoom,
          meta: {
            // breadcrumb:"会议室预定",
          },
        },
        {
          path: '/meeting/meetingApp',
          name: 'meetingApp',
          component: meetingApp,
          meta: {
            // breadcrumb:"会议室预定",
          },

        },
        {
          path: '/meeting/bookingDetail/:id',
          name: 'bookingDetail',
          component: bookingDetail,
          meta: {
            // breadcrumb:"Reservation Booking",
          }
        },
        {
          path: '/meeting/MyBooking',
          name: 'MyBooking',
          component: MyBooking,
          meta: {
            breadcrumb: "我的预订",
          }
        },
        {
          path: '/meeting/meetingSearch/:type',
          name: 'meetingSearch',
          component: meetingSearch,
          meta: {
            breadcrumb: "会议通知",
          }
        },
        {
          path: '/meeting',
          redirect: '/meeting/ReservationAllRoom'
        },
      ]
    },
    {
      path: '/supplier',
      name: 'supplierHome',
      component: supplierHome,
      meta: {
        breadcrumb: "客户关系",
      },
      children: [{
          path: '/supplier/supplierCreate/:id',
          name: 'supplierCreate',
          component: supplierCreate,
          meta: {
            breadcrumb: "客户维护",
          },

        },
        {
          path: '/supplier/mySupplier',
          name: 'mySupplier',
          component: mySupplier,
          meta: {
            breadcrumb: "我的客户",
          }
        },
        {
          path: '/supplier/supplierSearch',
          name: 'supplierSearch',
          component: supplierSearch,
          meta: {
            breadcrumb: "客户查询",
          }
        },
        {
          path: '/supplier',
          redirect: '/supplier/mySupplier'
        },
      ]
    },
    {
      path: '/SMS',
      name: 'SMSHome',
      component: SMSHome,
      meta: {
        breadcrumb: "短信",
      },
      children: [{
          path: '/SMS/SMSApp',
          name: 'SMSApp',
          component: SMSApp,
          meta: {
            breadcrumb: "新建短信",
          },

        },
        {
          path: '/SMS/mySMS',
          name: 'mySMS',
          component: mySMS,
          meta: {
            breadcrumb: "我的短信",
          }
        },
        {
          path: '/SMS/SMSDetail/:id',
          name: 'SMSDetail',
          component: SMSDetail,
          meta: {
            breadcrumb: "短信详情",
          }
        },
        {
          path: '/SMS/SMSSearch',
          name: 'SMSSearch',
          component: SMSSearch,
          meta: {
            breadcrumb: "短信管理",
          }
        },
        {
          path: '/SMS',
          redirect: '/SMS/mySMS'
        },
      ]
    },
    {
      path: '/breakDown',
      name: 'breakDownHome',
      component: breakDownHome,
      meta: {
        breadcrumb: "接线",
      },
      children: [{
          path: '/breakDown/breakDownApp',
          name: 'breakDownApp',
          component: breakDownApp,
          meta: {
            breadcrumb: "新建接线记录",
          },

        },
        {
          path: '/breakDown/myBreakDown',
          name: 'myBreakDown',
          component: myBreakDown,
          meta: {
            breadcrumb: "我的接线记录",
          }
        },
        {
          path: '/breakDown/breakDownDetail/:id',
          name: 'breakDownDetail',
          component: breakDownDetail,
          meta: {
            breadcrumb: "接线详情",
          }
        },
        {
          path: '/breakDown/breakDownSearch',
          name: 'breakDownSearch',
          component: breakDownSearch,
          meta: {
            breadcrumb: "接线记录管理",
          }
        },
        {
          path: '/breakDown',
          redirect: '/breakDown/myBreakDown'
        },
      ]
    },
    {
      path: '/faultDeal',
      name: 'faultDealHome',
      component: faultDealHome,
      meta: {
        breadcrumb: "接障",
      },
      children: [{
          path: '/faultDeal/faultDealApp',
          name: 'faultDealApp',
          component: faultDealApp,
          meta: {
            breadcrumb: "新建接障记录",
          },

        },
        {
          path: '/faultDeal/myFaultDeal',
          name: 'myFaultDeal',
          component: myFaultDeal,
          meta: {
            breadcrumb: "我的接障记录",
          }
        },
        {
          path: '/faultDeal/faultDealDetail/:id',
          name: 'faultDealDetail',
          component: faultDealDetail,
          meta: {
            breadcrumb: "接障详情",
          }
        },
        {
          path: '/faultDeal/faultDealSearch',
          name: 'faultDealSearch',
          component: faultDealSearch,
          meta: {
            breadcrumb: "接障记录管理",
          }
        },
        {
          path: '/faultDeal',
          redirect: '/faultDeal/myfaultDeal'
        },
      ]
    },

    {
      path: '/forumHome',
      name: 'forumHome',
      component: forumHome,
      meta: {
        breadcrumb: "论坛",
      },
      children: [{
          path: '/forum/forumApp',
          name: 'forumApp',
          component: forumApp,
          meta: {
            breadcrumb: "发帖",
          }
        },
        {
          path: '/forum/myForum',
          name: 'myForum',
          component: myForum,
          meta: {
            breadcrumb: "帖子管理",
          }
        },
        {
          path: '/forum/contributeManagement',
          name: 'contributeManagement',
          component: contributeManagement,
          meta: {
            breadcrumb: "员工贡献榜管理",
          }
        },
        
        // {
        //   path: '/forum/forumSearch',
        //   name: 'forumSearch',
        //   component: forumSearch,
        //   meta: {
        //     breadcrumb: "帖子管理",
        //   }
        // },
      ]
    },

    {
      path: '/flightStatus',
      name: 'flightStatus',
      component: flightStatus,
      meta: {
        breadcrumb: "航班动态",
      }
    }, {
      path: '/doc',
      name: 'doc',
      component: doc,
      meta: {
        breadcrumb: "公文流转",
      },
      children: [{
          path: '/doc/docSub',
          name: 'DocSub',
          component: docSub,
          meta: {
            breadcrumb: "公文呈报",
          },
        }, {
          path: '/doc/docCommonApp/:code',
          name: 'docCommonApp',
          component: docCommonApp,
          meta: {
            breadcrumb: "公文呈报",
          }
        },
        {
          path: '/doc/docTracking',
          name: 'docTracking',
          component: docTracking,
          meta: {
            breadcrumb: "公文追踪",
          }
        }, {
          path: '/doc/docPending',
          name: 'docPending',
          component: docPending,
          meta: {
            breadcrumb: "公文签批",
          }
        },  {
          path: '/doc/docOverTime',
          name: 'docOverTime',
          component: docOverTime,
          meta: {
            breadcrumb: "超时公文",
          }
        }, {
          path: '/doc/docDetail/:id',
          name: 'docDetail',
          component: docDetail,
          meta: {
            breadcrumb: "公文详情",
          }
        }, {
          path: '/doc/docInfo/:id',
          name: 'docInfo',
          component: docInfo,
          meta: {
            breadcrumb: "公文详情",
          }
        }, {
          path: '/doc/docSearch',
          name: 'docSearch',
          component: docSearch,
          meta: {
            breadcrumb: "公文查询",
          }
        }, {
          path: '/doc/docToRead',
          name: 'docToRead',
          component: docToRead,
          meta: {
            breadcrumb: "公文待阅",
          }
        }, {
          path: '/doc/docDraft',
          name: 'docDraft',
          component: docDraft,
          meta: {
            breadcrumb: "公文草稿箱",
          }
        }, {
          path: '/doc/macroStatistics',
          name: 'macroStatistics',
          component: macroStatistics,
          meta: {
            breadcrumb: "公文统计",
          }
        }, {
          path: '/doc/normalStatistics',
          name: 'normalStatistics',
          component: normalStatistics,
          meta: {
            breadcrumb: "公文统计",
          }
        },
        {
          path: '/doc/approveStatistics',
          name: 'approveStatistics',
          component: approveStatistics,
          meta: {
            breadcrumb: "公文统计",
            power: ''
          }
        },
        {
          path: '/doc/',
          redirect: '/doc/docSub'
        },
      ]
    },
    operationSystem,
    duty,
    set,
    {
      path: '/softDownload',
      component: softDownload,
      meta: {
        breadcrumb: '软件下载'
      }
    },
    {
      path: '/test',
      component: test,
      meta: {
        breadcrumb: '版本提醒'
      }
    },
    {
      path: '/templateDownload',
      component: templateDownload,
      meta: {
        breadcrumb: '模板下载'
      }
    }

  ]
})

router.beforeEach((to, from, next) => {

  if (util.getCookie('userId')) {
    var history = store.getters.routeHistroy;
    // console.log(history)
    if (history.length != 0 && history[history.length - 1].path === to.path) {
      jquery('body,html').scrollTop(history[history.length - 1].top);
      // console.log(jquery('body,html').scrollTop())
      store.commit('popHistory');
    } else {
      // console.log(jquery('body,html').scrollTop())
      store.commit('pushHistory', { path: from.path, top: jquery('body,html').scrollTop() });
      jquery('body,html').animate({ scrollTop: 0 }, 50);
    }
    history=null;
    next();
  } else {
    util.loginOut();
  }
})

export default router
