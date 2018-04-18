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

  const updateRecord = () =>
  import ('pages/updateRecord.page')


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
    }, {
      path: '/newsDetail/:id',
      name: 'newsDetail',
      component: newsDetail,
      meta: {
        breadcrumb: "新闻详情",
      }
    }, {
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
