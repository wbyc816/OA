import dutyBase from 'pages/duty/dutyBase.page'
import dutyDetail from 'pages/duty/dutyDetail.page'
import dutyUpload from 'pages/duty/dutyUpload.page'
import dutyEdit from 'pages/duty/dutyEdit.page'

export default {
  path: '/duty',
  name: 'dutyBase',
  component: dutyBase,
  meta: {
    breadcrumb: "今日值班",
  },
  children: [
    {
      path: '/duty/dutyDetail',
      name: 'dutyDetail',
      component: dutyDetail,
    },
    {
      path: '/duty/dutyUpload',
      name: 'dutyUpload',
      component: dutyUpload,
      meta: {
        breadcrumb: "新增值班信息",
      },
    },
    {
      path: '/duty/dutyEdit',
      name: 'dutyEdit',
      component: dutyEdit,
      meta: {
        breadcrumb: "值班信息维护",
      },
    },
    {
      path: '/duty/',
      redirect: '/duty/dutyDetail'
    }
  ]
}


