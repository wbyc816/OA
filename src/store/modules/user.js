import api from '../../fetch/api'
import * as types from '../types'


const state = {
  userInfo: {
    "name": "",
    "empId": "",

  },
  isReady:false
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
        // console.log(res)
          commit(types.SET_USER_INFO, res.data);
          commit('setReady',true);
      }, res => {

      })
  }
}

const getters = {
  userInfo: state => state.userInfo,
  isReady: state => state.isReady,

}

const mutations = {
  [types.SET_USER_INFO](state, res) {
    state.userInfo = res
  },
  setEmpId(state, id) {
    state.userInfo.empId = id
  },
  setReady(state,val){
    state.isReady=val;
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
