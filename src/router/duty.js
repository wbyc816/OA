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
      component: dutyUpload
    },
    {
      path: '/duty/dutyEdit',
      name: 'dutyEdit',
      component: dutyEdit 
    },
    {
      path: '/duty/',
      redirect: '/duty/dutyDetail'
    }
  ]
}


