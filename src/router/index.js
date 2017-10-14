import Vue from 'vue'
import Router from 'vue-router'
import home from 'pages/home'
// import two from 'pages/two'
import doc from 'pages/Doc-Approval'
// import organizationStructure from 'pages/OrganizationStructure'

import docSub from 'pages/docSub/docSub.page'
import docTracking from 'pages/docSub/docTracking.page'
import docDetail from 'pages/docSub/docDetail.page'
import docSearch from 'pages/docSub/docSearch.page'
import docPending from 'pages/docSub/docPending.page'
import docToRead from 'pages/docSub/docToRead.page'

import approvalForm from 'pages/docSub/approvalForm.page'
import materialApp from 'pages/docSub/materialApp.page'
import vehicleApp from 'pages/docSub/vehicleApp.page'
import manuscriptApp from 'pages/docSub/manuscriptApp.page'
import docCommonApp from 'pages/docSub/docCommonApp.page'
// import manuscriptPaper from'pages/docSub/fileManuscriptPaper.page'
// import leisureTravel from 'pages/docSub/staff-leisure-travel.page'
// import business from 'pages/docSub/businessTrip.page'
// import mobSerReq from 'pages/docSub/mobSerReq.page'
// import businessCardReq from 'pages/docSub/businessCardReq.page'
// import conVoucher from 'pages/docSub/conVoucher.page'
// import procureReq from 'pages/docSub/procureReq.page'
// import reimburse from 'pages/docSub/reimburse.page'
// import payment from 'pages/docSub/payment.page'
// import budget from 'pages/docSub/budgetForm.page'
// import contractBudget from 'pages/docSub/contractBudget.page'
// import conChange from 'pages/docSub/conChange.page'
// import conApprovalNew from 'pages/docSub/conApprovalNew.page'
// import conApproval from 'pages/docSub/conApproval.page'


// import generalInfo from 'pages/GeneralInfo'
// import Epersonnel from 'pages/E-Personnel'

// import reimbursement from 'pages/e-personnel/reimbursement.page'

// import forms from 'pages/generalInfo/forms.page'
// import news from 'pages/generalInfo/news.page'
// import formDetail from 'pages/generalInfo/formDetail.page'
// import newsDetail from 'pages/generalInfo/newsDetail.page'
// import taskAssignment from 'pages/generalInfo/taskAssignment.page'
// import createTask from 'pages/generalInfo/createTask.page'
// import taskList from 'pages/generalInfo/taskList.page'
// import leaveDutyTrip from 'pages/generalInfo/leaveDutyTrip.page'
// import myBenefit from 'pages/generalInfo/myBenefit.page'
// import myBenefitList from 'pages/generalInfo/myBenefit/myBenefitList.page'
// import myBenefitDetail from 'pages/generalInfo/myBenefit/myBenefitDetail.page'
// import MeetingReservation from 'pages/generalInfo/MeetingReservation.page'
// import ReservationAllRoom from 'pages/generalInfo/meetingReservation/reservationAllRoom.page'
// import ReservationByRoom from 'pages/generalInfo/meetingReservation/reservationByRoom.page'
// import ReservationBooking from 'pages/generalInfo/meetingReservation/reservationBooking.page'
// import MyBooking from 'pages/generalInfo/meetingReservation/myBooking.page'

import staffCenter from 'pages/StaffCenter'
import myRequest from 'pages/StaffCenter/myRequest.page'
import jobRequest from 'pages/StaffCenter/jobRequest.page'
import flightSearch from 'pages/StaffCenter/flightSearch.page'
import flightStatus from 'pages/StaffCenter/flightStatus.page'

// import weibo from 'pages/weibo/weibo.page'
// import myWeiBo from 'pages/weibo/myWeiBo.page'
// import addFocus from 'pages/weibo/addFocus.page'
// import othersWeibo from 'pages/weibo/othersWeibo.page'
// import hisWeiBo from 'pages/weibo/hisWeiBo.page'
// import hisFocus from 'pages/weibo/hisFocus.page'

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


import diningMenu from '../pages/diningMenu.page'


//生日提醒
import BirthdayReminder from 'pages/BirthdayReminder.page'

//文件首页
import FilesHome from 'pages/FilesHome.page'

//总裁邮箱
import PresidentMailbox from 'pages/PresidentMailbox.page'

Vue.use(Router)

import operationSystem from './operationSystem'
import duty from './duty'

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

        } , {
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
       } , {
          path: '/FilesHome',
          name: 'FilesHome',
          component: FilesHome,
          meta: {
            breadcrumb: "文件首页",
          }
       } , {
          path: '/PresidentMailbox',
          name: 'PresidentMailbox',
          component: PresidentMailbox,
          meta: {
            breadcrumb: "总裁邮箱",
          }
       } , {
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
                path: '/HR/salary/:salaryMonth',
                name: 'salary',
                component: salary,
            }, {
              path: '/HR/salaryHistory/:param',
              name: 'salaryHistory',
              component: salaryHistory
            },{
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
        }, {
            path: '/flightStatus',
            name: 'flightStatus',
            component: flightStatus,
            meta: {
                breadcrumb: "航班动态",
            }
        },{
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
                    path: '/doc/approvalForm',
                    name: 'ApprovalForm',
                    component: approvalForm,
                    meta: {
                        breadcrumb: "公文呈报",
                    }
                }, {
                    path: '/doc/materialApp',
                    name: 'materialApp',
                    component: materialApp,
                    meta: {
                        breadcrumb: "公文呈报",
                    }
                }, {
                    path: '/doc/vehicleApp',
                    name: 'vehicleApp',
                    component: vehicleApp,
                    meta: {
                        breadcrumb: "公文呈报",
                    }
                }, {
                    path: '/doc/manuscriptApp',
                    name: 'manuscriptApp',
                    component: manuscriptApp,
                    meta: {
                        breadcrumb: "公文呈报",
                    }
                }, {
                    path: '/doc/docCommonApp/:code',
                    name: 'docCommonApp',
                    component: docCommonApp,
                    meta: {
                        breadcrumb: "公文呈报",
                    }
                },
                // {
                //  path:'/doc/leisureTravel',
                //  name:'leisureTravel',
                //  component:leisureTravel,
                //  meta:{
                //      breadcrumb:"Leisure Travel",
                //  }
                // },
                // {
                //  path:'/doc/manuscriptPaper',
                //  name:'manuscriptPaper',
                //  component:manuscriptPaper,
                //  meta:{
                //      breadcrumb:"File Manuscript Paper",
                //  }
                // },
                // {
                //  path:'/doc/businessTrip',
                //  name:'businessTrip',
                //  component:business,
                //  meta:{
                //      breadcrumb:"Business Trip",
                //  }
                // },
                // {
                //  path:'/doc/mobSerReq',
                //  name:'mobSerReq',
                //  component:mobSerReq,
                //  meta:{
                //      breadcrumb:"Mobile Phone Services Request",
                //  }
                // },
                // {
                //  path:'/doc/businessCardReq',
                //  name:'businessCardReq',
                //  component:businessCardReq,
                //  meta:{
                //      breadcrumb:"Business Card Request Form",
                //  }
                // },
                // {
                //  path:'/doc/conVoucher',
                //  name:'ConVoucher',
                //  component:conVoucher,
                //  meta:{
                //      breadcrumb:"Concession Voucher Form",
                //  }
                // },
                // {
                //  path:'/doc/procureReq',
                //  name:'ProcureReq',
                //  component:procureReq,
                //  meta:{
                //      breadcrumb:"Procurement Requisition Form",
                //  }
                // },
                // {
                //  path:'/doc/reimburse',
                //  name:'Reimburse',
                //  component:reimburse,
                //  meta:{
                //      breadcrumb:"Reimbursement Form",
                //  }
                // },
                //  {
                //      path:'/doc/payment',
                //      name:'Payment',
                //      component:payment,
                //      meta:{
                //          breadcrumb:"Payment Form",
                //      }
                //  },
                //  {
                //      path:'/doc/budget',
                //      name:'Budget',
                //      component:budget,
                //      meta:{
                //          breadcrumb:"Budget Form",
                //      }
                //  },
                //  {
                //      path:'/doc/contractBudget',
                //      name:'ContractBudget',
                //      component:contractBudget,
                //      meta:{
                //          breadcrumb:"Contract Budget Change",
                //      }
                //  },
                //  {
                //      path:'/doc/conChange',
                //      name:'ContractChange',
                //      component:conChange,
                //      meta:{
                //          breadcrumb:"Contract Budget Change ",
                //      },
                //  },
                //  {
                //      path:'/doc/conApprovalNew',
                //      name:'ConApprovalNew',
                //      component:conApprovalNew,
                //      meta:{
                //          breadcrumb:"Contract Approval New",
                //      }
                //  },
                //  {
                //      path:'/doc/conApproval',
                //      name:'ConApproval',
                //      component:conApproval,
                //      meta:{
                //          breadcrumb:"Contract Approval",
                //      }
                //  },
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
                },
                //  {
                //      path:'/doc/paymentSearch',
                //      name:'paymentSearch',
                //      component:paymentSearch,
                //      meta:{
                //          breadcrumb:"Payment Search",
                //      }
                //  },
                {
                    path: '/doc/',
                    redirect: '/doc/docSub'
                },
            ]
        },
        // {
        //  path:'/organizationStructure',
        //  name:'organizationStructure',
        //  component:organizationStructure,
        //  meta:{
        //      breadcrumb:"Organization Structure",
        //  }
        // },
        // {
        //  path:'/generalInfo',
        //  name:'generalInfo',
        //  component:generalInfo,
        //  meta:{
        //      breadcrumb:"General Info",
        //  },
        //  children:[
        //  {
        //      path:'/generalInfo/forms',
        //      name:'forms',
        //      component:forms,
        //      meta:{
        //          breadcrumb:"Forms",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/news',
        //      name:'news',
        //      component:news,
        //      meta:{
        //          breadcrumb:"News",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/taskAssignment',
        //      name:'taskAssignment',
        //      component:taskAssignment,
        //      meta:{
        //          breadcrumb:"TaskAssignment",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/createTask',
        //      name:'createTask',
        //      component:createTask,
        //      meta:{
        //          breadcrumb:"Create Task",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/taskList',
        //      name:'taskList',
        //      component:taskList,
        //      meta:{
        //          breadcrumb:"TaskList",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/leaveDutyTrip',
        //      name:'leaveDutyTrip',
        //      component:leaveDutyTrip,
        //      meta:{
        //          breadcrumb:"Leave&Duty Trip",
        //      }
        //  },
        //  {
        //      path:'/generalInfo',
        //      redirect: '/generalInfo/forms'
        //  }
        //  ]
        // },
        // {
        //  path:'/generalInfo/formDetail',
        //  name:'formDetail',
        //  component:formDetail,
        //  meta:{
        //      breadcrumb:"Form Detail",
        //  }
        // },
        // {
        //  path:'/generalInfo/newsDetail',
        //  name:'newsDetail',
        //  component:newsDetail,
        //  meta:{
        //      breadcrumb:"News Detail",
        //  }
        // },

        // {
        //  path:'/generalInfo/MeetingReservation',
        //  name:'MeetingReservation',
        //  component:MeetingReservation,
        //  meta:{
        //      breadcrumb:"Meeting Reservation",
        //  },
        //  children:[
        //  {
        //      path:'/generalInfo/MeetingReservation/ReservationAllRoom',
        //      name:'ReservationAllRoom',
        //      component:ReservationAllRoom,
        //      meta:{
        //          breadcrumb:"Reservation AllRoom",
        //      },

        //  },
        //  {
        //      path:'/generalInfo/MeetingReservation/ReservationByRoom',
        //      name:'ReservationByRoom',
        //      component:ReservationByRoom,
        //      meta:{
        //          breadcrumb:"Reservation ByRoom",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/MeetingReservation/ReservationBooking',
        //      name:'ReservationBooking',
        //      component:ReservationBooking,
        //      meta:{
        //          breadcrumb:"Reservation Booking",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/MeetingReservation/MyBooking',
        //      name:'MyBooking',
        //      component:MyBooking,
        //      meta:{
        //          breadcrumb:"My Booking",
        //      }
        //  },
        //  {
        //      path:'/generalInfo/MeetingReservation',
        //      redirect: '/generalInfo/MeetingReservation/ReservationAllRoom'
        //  },
        //  ]
        // },
        // {
        //  path:'/generalInfo/myBenefit',
        //  name:'myBenefit',
        //  component:myBenefit,
        //  meta:{
        //      breadcrumb:"My Benefit List",
        //  },
        //  children:[
        //  {
        //      path:'/generalInfo/myBenefit/myBenefitList',
        //      name:'myBenefitList',
        //      component:myBenefitList
        //  },
        //  {
        //      path:'/generalInfo/myBenefit',
        //      redirect: '/generalInfo/myBenefit/myBenefitList'
        //  }
        //  ]

        // },
        // {
        //  path:'/generalInfo/myBenefit/myBenefitDetail',
        //  name:'myBenefitDetail',
        //  component:myBenefitDetail,
        //  meta:{
        //      breadcrumb:"My Benefit Detail",
        //  }
        // },   
        // {
        //  path:'/E-personnel',
        //  name:'E-personnel',
        //  component:Epersonnel,
        //  meta:{
        //      breadcrumb:"Epersonnel",
        //  },
        //  children:[
        //  {
        //      path:'/E-personnel/reimbursement',
        //      name:'reimbursement',
        //      component:reimbursement,
        //      meta:{
        //          breadcrumb:"Reimbursement",
        //      }
        //  },
        //  {
        //      path:'/E-personnel',
        //      redirect: '/E-personnel/reimbursement'
        //  }
        //  ]
        // },
        {
            path: '/staffCenter',
            name: 'staffCenter',
            component: staffCenter,
            meta: {
                breadcrumb: "员工中心",
            },
            children: [{
                    path: '/staffCenter/myRequest',
                    name: 'myRequest',
                    component: myRequest,
                    meta: {
                        breadcrumb: "My Request",
                    }
                }, {
                    path: '/staffCenter/jobRequest',
                    name: 'jobRequest',
                    component: jobRequest,
                    meta: {
                        breadcrumb: "Job Request & Problem",
                    }
                }, {
                    path: '/staffCenter/flightSearch',
                    name: 'flightSearch',
                    component: flightSearch,
                    meta: {
                        breadcrumb: "Flight Search",
                    }
                },

                {
                    path: '/staffCenter',
                    redirect: '/staffCenter/myRequest'
                }
            ]
        },
        // {
        //  path:'/weibo',
        //  name:'weibo',
        //  component:weibo,
        //  meta:{
        //      breadcrumb:"WeiBo",
        //  },
        //  children:[
        //  {
        //      path:'/weibo/myWeiBo',
        //      name:'myWeiBo',
        //      component:myWeiBo
        //  },
        //  {
        //      path:'/weibo/addFocus',
        //      name:'addFocus',
        //      component:addFocus,
        //      meta:{
        //          breadcrumb:"Add Focus",
        //      }
        //  },
        //  {
        //      path:'/weibo/',
        //      redirect: '/weibo/myWeiBo'
        //  }
        //  ]
        // },
        // {
        //  path:'/othersWeibo',
        //  name:'othersWeibo',
        //  component:othersWeibo,
        //  children:[
        //  {
        //      path:'/othersWeibo/hisWeiBo',
        //      name:'hisWeiBo',
        //      component:hisWeiBo,
        //      meta:{
        //          breadcrumb:"HisWeiBo",
        //      }
        //  },
        //  {
        //      path:'/othersWeibo/hisFocus',
        //      name:'hisFocus',
        //      component:hisFocus,
        //      meta:{
        //          breadcrumb:"His Focus",
        //      }
        //  },
        //  {
        //      path:'/othersWeibo/',
        //      redirect: '/othersWeibo/hisWeiBo'
        //  }
        //  ]
        // }
       operationSystem,
       duty
    ]
})
