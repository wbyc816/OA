import Vue from 'vue'
import Router from 'vue-router'
import home from 'pages/home'

//公文
import doc from 'pages/Doc-Approval'
import docSub from 'pages/docSub/docSub.page'
import docTracking from 'pages/docSub/docTracking.page'
import docDetail from 'pages/docSub/docDetail.page'
import docSearch from 'pages/docSub/docSearch.page'
import docPending from 'pages/docSub/docPending.page'
import docToRead from 'pages/docSub/docToRead.page'
import docDraft from 'pages/docSub/docDraft.page'
import docCommonApp from 'pages/docSub/docCommonApp.page'
//公文统计
import statisticsHome from 'pages/docSub/statistical/statisticsHome.page'
import macroStatistics from 'pages/docSub/statistical/macroStatistics.page'

//会议
import meetingHome from 'pages/meeting/meetingHome.page'
import ReservationAllRoom from 'pages/meeting/reservationAllRoom.page'
import bookingDetail from 'pages/meeting/bookingDetail.page'
import MyBooking from 'pages/meeting/myBooking.page'
import meetingSearch from 'pages/meeting/meetingSearch.page'
import meetingApp from 'pages/meeting/meetingApp.page'

//客户
import supplierHome from 'pages/supplier/supplierHome.page'
import mySupplier from 'pages/supplier/mySupplier.page'
import supplierSearch from 'pages/supplier/supplierSearch.page'
import supplierCreate from 'pages/supplier/supplierCreate.page'

//航班动态
import flightStatus from 'pages/flightStatus.page'


//公司同仁
import contactList from 'pages/ContactList.page'
//人力资源
import HR from '../pages/HR/homeHR.page'
import clildHR from '../pages/HR/clildHR.page'
import personalInfo from '../pages/HR/personalInfo.page'
import resume from '../pages/HR/resume.page'
import editResume from '../pages/HR/editResume.page'
import salary from '../pages/HR/salary.page'
import salaryHistory from '../pages/HR/salaryHistory.page'
import newsDetail from '../pages/HR/newsDetail.page'
import newsDetailHr from '../pages/HR/newsDetailHr.page'
import newsListHr from '../pages/HR/newsListHr.page'

//菜谱
import diningMenu from '../pages/diningMenu.page'


//生日提醒
import BirthdayReminder from 'pages/BirthdayReminder.page'

//文件首页
import FilesHome from 'pages/FilesHome.page'

//总裁邮箱
import PresidentMailbox from 'pages/PresidentMailbox.page'
import softDownload from '../pages/softDownload.page'


Vue.use(Router)

import operationSystem from './operationSystem'
import duty from './duty'
import set from './set'


export default new Router({

  // mode: 'history',
  // history: false,
  // hashbang: true,
  routes: [{
      path: '/home',
      name: 'home',
      component: home
    }, {
      path: '/contactList',
      name: 'contactList',
      component: contactList,
      meta: {
        breadcrumb: "公司同仁",
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
    }

  ]
})
