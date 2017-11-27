import api from '../../fetch/api'
import * as types from '../types'
import { Message } from 'element-ui';


const state = {
  roomList: [],
  conferenceType: [],
  conferenceNum: {
    "launchNum": 0,
    "partakeNum": 0,
    "cancelNum": 0
  }
}

const actions = {

  //获取房间列表
  getRoomPosition({ commit, state, rootState, rootGetters }) {
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
  getConferenceType({ commit, state, rootState, rootGetters }) {
    if (state.conferenceType.length == 0) {
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
    }
  },
  //获取会议数量
  getConferenceNum({ commit, rootState, rootGetters }) {
    api.getConferenceNum(rootGetters.userInfo.empId)
      .then(res => {
        commit(types.GET_CONFERENCE_NUM, res)
      }, res => {
        // commit(types.GET_EMP_DATAIL, '')
        Message({
          message: '获取会议数量失败！',
          type: 'error'
        });
      })
  }
}

const getters = {
  roomList: state => state.roomList,
  conferenceType: state => state.conferenceType,
  conferenceNum: state => state.conferenceNum,
}

const mutations = {
  [types.GET_ROOM_POSITION](state, res) {
    var arr = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

    function _convert(str) {
      var _str = str;
      for (var i = 0; i < arr.length; i++) {
        _str = _str.replace(new RegExp(arr[i], "g"), (i + 1));
      }
      return _str
    }
    res.data.forEach(r => {
      r._roomPosition = _convert(r.roomPosition);
    })
    console.log(res.data);
    res.data.sort(function(a, b) { return a._roomPosition.localeCompare(b._roomPosition) });
    state.roomList = res.data
  },
  [types.GET_CONFERENCE_TYPE](state, res) {
    state.conferenceType = res.data
  },
  [types.GET_CONFERENCE_NUM](state, res) {
    state.conferenceNum = res.data
  },

}

export default {
  state,
  actions,
  getters,
  mutations
}
