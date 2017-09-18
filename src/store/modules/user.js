import api from '../../fetch/api'
import * as types from '../types'


const state = {
  userInfo: {
    "name": "王子利",
    "gender": "0",
    "workPlace": "东海航空",
    "workEmail": "17633901314@168.com",
    "moblieNumber": null,
    "phoneNumber": null,
    "depts": "维修一分部",
    "deptNames": null,
    "jobtitle": "专员",
    "workNo": "A00457",
    "empId": "777669AF68DBCCABC30C3B6BCAA81825",
    "isFirstLogin": 0,
    "levelNum": null,
    "deptParentId": null
  }
}

const actions = {

  /**
   * 获取部门列表
   */
  // getDeptList({ commit }, palyload) {
  //   if (!state.depts) {
  //     api.getDeptList()
  //       .then(res => {
  //         commit(types.GET_DEPT_LIST, res)
  //       })
  //   }
  // }
}

const getters = {
  userInfo: state => state.userInfo
}

const mutations = {
  // [types.GET_DEPT_LIST](state, res) {
  //   state.depts = res.data.deptList
  // }
}

export default {
  state,
  actions,
  getters,
  mutations
}
