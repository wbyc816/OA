import api from '../../fetch/api'
import * as types from '../types'
import util from '../../common/util.js'

const state = {
  userInfo: {
    "name": "",
    "empId": "",

  },
  dutys:[],
  isReady: false
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
        if (res.status == 0) {
          commit(types.SET_USER_INFO, res.data);
          commit('setReady', true);
        }else{
          util.loginOut();
        }
      }, res => {
          util.loginOut();
      })
  }
}

const getters = {
  userInfo: state => state.userInfo,
  isReady: state => state.isReady,
  dutys: state => state.dutys,

}

const mutations = {
  [types.SET_USER_INFO](state, res) {
    state.userInfo = res
  },
  setEmpId(state, id) {
    state.userInfo.empId = id
  },
  setReady(state, val) {
    state.isReady = val;
  },
  setDutys(state,data){
    state.dutys=data;
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
