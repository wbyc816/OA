import os from 'pages/operationSystem.page'
import osSub from 'pages/osSub/osSub.page'

export default {
  path: '/os',
  name: os,
  component: os,
  meta: {
    breadcrumb: "业务系统",
  },
  children: [
    {
      path: '/os/osSub',
      name: 'osSub',
      component: osSub,
    },
    {
      path: '/os/',
      redirect: '/os/osSub'
    }
  ]
}


