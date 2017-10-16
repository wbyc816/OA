import set from 'pages/set/set.page'
import personalPsw from 'pages/set/personalPsw.page'
import loginPsw from 'pages/set/loginPsw.page'
import phoneNumber from 'pages/set/phoneNumber.page'

export default {
  path: '/set',
  name: 'set',
  component: set,
  meta: {
    breadcrumb: "设置",
  },
  children: [
    {
      path: '/set/personalPsw',
      name: 'personalPsw',
      component: personalPsw,
      meta: {
        breadcrumb: "修改个人密码",
      },
    },
    {
      path: '/set/loginPsw',
      name: 'loginPsw',
      component: loginPsw,
      meta: {
        breadcrumb: "修改登录密码",
      },
    },
    {
      path: '/set/phoneNumber',
      name: 'phoneNumber',
      component: phoneNumber,
      meta: {
        breadcrumb: "修改手机号码",
      },
    },
    {
      path: '/set/',
      redirect: '/set/loginPsw'
    }
  ]
}


