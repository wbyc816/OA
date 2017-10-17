import api from '../../fetch/api'
import * as types from '../types'
import { Message } from 'element-ui';


const state = {
  roomList:[],
  conferenceType:[]
}

const actions = {

  //获取房间列表
  getRoomPosition({ commit, rootState,rootGetters }) {
    api.getRoomPosition()
      .then(res => {
        commit(types.GET_ROOM_POSITION, res)
      }, res => {
        // commit(types.GET_EMP_DATAIL, '')
        Message({
          message: '获取会议室失败！',
          type: 'error'
        });
      })
  },
 //获取会议类型
  getConferenceType({ commit, rootState,rootGetters }) {
    api.getConferenceType()
      .then(res => {
        commit(types.GET_CONFERENCE_TYPE, res)
      }, res => {
        // commit(types.GET_EMP_DATAIL, '')
        Message({
          message: '获取会议类型失败！',
          type: 'error'
        });
      })
  },


}

const getters = {
  roomList: state => state.roomList,
  conferenceType: state => state.conferenceType,
}

const mutations = {
  [types.GET_ROOM_POSITION](state, res) {
    state.roomList = res.data
  },
  [types.GET_CONFERENCE_TYPE](state, res) {
    state.conferenceType = res.data
  },

}

export default {
  state,
  actions,
  getters,
  mutations
}
