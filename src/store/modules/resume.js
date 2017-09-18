import api from '../../fetch/api'
import * as types from '../types'
import { Message } from 'element-ui';


const state = {
  resumeInfo: '',
  empPostInfo:''
}

const actions = {

  //获取人员详情
  getResumeInfo({ commit, rootState,rootGetters }) {
    api.getResumeInfo(rootGetters.userInfo.empId)
      .then(res => {
        commit(types.GET_RESUME_INFO, res)
      }, res => {
        // commit(types.GET_EMP_DATAIL, '')
        Message({
          message: '获取个人信息失败！',
          type: 'error'
        });
      })
  },
  getEmpPostInfo({ commit, rootState,rootGetters }) {
    api.getEmpPostInfo(rootGetters.userInfo.empId)
      .then(res => {
        commit(types.GET_EMP_POST_INFO, res)
      }, res => {
        // commit(types.GET_EMP_DATAIL, '')
        Message({
          message: '获取职务信息失败！',
          type: 'error'
        });
      })
  }


}

const getters = {
  resumeInfo: state => state.resumeInfo,
  empPostInfo: state => state.empPostInfo,

}

const mutations = {
  [types.GET_RESUME_INFO](state, res) {
    state.resumeInfo = res.data
  },
  [types.GET_EMP_POST_INFO](state, res) {
    state.empPostInfo = res.data
  },
}

export default {
  state,
  actions,
  getters,
  mutations
}
