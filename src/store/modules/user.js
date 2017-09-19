import api from '../../fetch/api'
import * as types from '../types'


const state = {
  userInfo: {
    "name": "运标副总裁",
    "gender": "F",
    "workPlace": "东海航空",
    "workEmail": null,
    "mobileNumber": null,
    "phoneNumber": "15099917405",
    "depts": "运行标准部",
    "deptNames": null,
    "deptName": null,
    "jobtitle": "虚拟岗",
    "workNo": "S005",
    "empId": "777669AF68DBCCABC30C3B6BCAA81825",
    "isFirstLogin": null,
    "levelNum": 30,
    "deptParentId": "CFCD208495D565EF66E7DFF9F98764DA",
    "picUrl": null,
    "deptId": "33E75FF09DD601BBE69F351039152189",
    "deptVo": {
      "id": null,
      "name": null,
      "fatherDeptId": "33E75FF09DD601BBE69F351039152189",
      "fatherDept": "运行标准部",
      "deptId": null,
      "dept": null
    },
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
