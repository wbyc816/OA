import api from '../../fetch/api'
import * as types from '../types'
import { Notification } from 'element-ui';


const state = {
  emergencyContactInfo: [{}],
  airPortList: []
}

const actions = {

  getAirPortList({ commit }) {
    api.getAirPortList()
      .then(res => {
        commit(types.SET_AIR_PORT_LIST, res.data)
      }, res => {
        // commit(types.GET_EMERGENCY_CONTACT_INFO, [{}])
      })
  },

  //获取紧急联系人信息
  getEmergencyContactInfo({ commit, rootState }, payload) {
    api.getEmergencyContactInfo(payload)
      .then(res => {
        commit(types.GET_EMERGENCY_CONTACT_INFO, res)
      }, res => {
        // commit(types.GET_EMERGENCY_CONTACT_INFO, [{}])
      })
  },
  //员工个人信息修改
  updateEmp({ commit, rootState }, payload) {
    Object.keys(payload).forEach(function(key) {
      if (payload[key] == '' || payload[key] == undefined || payload[key] == null) {
        delete payload[key]
      }
    })
    api.updateEmp(payload)
  },
  //紧急联系人信息修改
  updateEmergencyContactInfo({ commit, rootState }, payload) {
    api.updateEmergencyContactInfo(payload)
  },
  //修改基本信息
  updateBaseInfo({ commit, dispatch, rootState, rootGetters }, payload) {

    api.updateBaseInfo(payload)
      .then((res) => {
        // console.log(res)
        // if (res[0].status == '0') {
        //   dispatch('getEmergencyContactInfo', rootGetters.userInfo.empId);
        //   // Notification({
        //   //   message: '修改紧急联系人信息成功,请等待后台审核！',
        //   //   type: 'success'
        //   // });
        // } else {
        //   Notification({
        //     message: '修改紧急联系人信息失败，请重试！',
        //     type: 'error'
        //   });
        // }
        // if (res[1].status == '0') {
        //   dispatch('getEmpDetail', rootGetters.userInfo.empId);
        //   setTimeout(function() {
        //     // Notification({
        //     //   message: '修改个人基本信息成功！',
        //     //   type: 'success'
        //     // });
        //   }, 200)

        // } else {
        //   setTimeout(function() {
        //     Notification({
        //       message: '修改个人基本信息失败，请重试！',
        //       type: 'error'
        //     });
        //   }, 200)
        // }
        // if (res[0].status == '0' && res[1].status == '0') {
        //   setTimeout(function() {
        //     Notification({
        //       message: '修改个人信息成功,请等待后台审核！',
        //       type: 'success'
        //     });
        //     commit(types.SET_EDIT_STATUS, false, { root: true })
        //   }, 200)
        // }
        setTimeout(function() {
          Notification({
            message: '修改个人信息成功！',
            type: 'success'
          });
          commit(types.SET_EDIT_STATUS, false, { root: true })
        }, 200)
        dispatch('getUserInfo');
      })
  }
}

const getters = {
  emergencyContactInfo: state => state.emergencyContactInfo,
  airPortList: state => state.airPortList,
}

const mutations = {
  [types.GET_EMERGENCY_CONTACT_INFO](state, res) {
    state.emergencyContactInfo = res.data
  },
  [types.SET_AIR_PORT_LIST](state, res) {
    state.airPortList = res
  },
}

export default {
  state,
  actions,
  getters,
  mutations
}
