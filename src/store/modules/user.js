import api from '../../fetch/api'
import * as types from '../types'


const state = {
  userInfo: {
    "name": "",
    "empId": "",

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
  getUserInfo({ commit, state }) {
    api.getEmpDetail(state.userInfo.empId)
      .then(res => {
        console.log(res)
          commit(types.SET_USER_INFO, res.data);
      }, res => {

      })
  }
}

const getters = {
  userInfo: state => state.userInfo
}

const mutations = {
  [types.SET_USER_INFO](state, res) {
    state.userInfo = res
  },
  setEmpId(state, id) {
    state.userInfo.empId = id
  },

}

export default {
  state,
  actions,
  getters,
  mutations
}
