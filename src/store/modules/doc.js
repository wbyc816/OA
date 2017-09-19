import api from '../../fetch/api'
import * as types from '../types'
import { Notification } from 'element-ui';


const state = {
  confidentiality: [], //机密程度
  urgency: [], //重要程度
  isAdmin: false,
  docTtile: '',
  reciver: '',
  selConfident: {
    "docDenseTypeCode": "",
    "docDenseType": ""
  },
  selUrgency: {
    "docImportTypeCode": "",
    "docImportType": "",
  },
  extraDocs: []
}

const actions = {
  //
  getAdminStatus({ commit, state, rootState, rootGetters }) {
    api.getAdminStatus(rootGetters.userInfo.empId)
      .then(res => {
        if (res.data != null) {
          commit(types.GET_ADMIN_STATUS, true)
        }
      }, res => {
        Notification({
          message: '获取密级程度信息失败！',
          type: 'error'
        });
      })
  },
  //获取机密程度
  getConfident({ commit, state, rootState, rootGetters }) {
    if (state.confidentiality.length == 0) {
      api.getDict('DOC02')
        .then(res => {
          commit(types.SET_CONFIDENT, res)
        }, res => {
          Notification({
            message: '获取密级程度信息失败！',
            type: 'error'
          });
        })
    }

  },
  //获取重要程度
  getUrgency({ commit, state, rootState, rootGetters }) {
    if (state.urgency.length == 0) {
      api.getDict('DOC03')
        .then(res => {
          commit(types.SET_URGENCY, res)
        }, res => {
          Notification({
            message: '获取重要程度信息失败！',
            type: 'error'
          });
        })
    }
  },
  //根据部门ID获取组织结构
  getDepById({ commit, state, rootState, rootGetters }) {
    api.getDepById(rootGetters.userInfo.deptId)
      .then(res => {
        if (res.status == '0') {
          commit(types.GET_DEPT_LIST, res, { root: true })
        }
      }, res => {
        Notification({
          message: '获取密级程度信息失败！',
          type: 'error'
        });
      })
  },
  //获取额外公文
  selectDoc({ commit,rootGetters }) {
    api.selectDoc(123)
      .then(res => {
        if (res.status == "0") {
          commit(types.SELECT_DOC, res);
        } else {
          Notification({
            message: '获取附加公文失败！',
            type: 'error'
          });
        }
      }, res => {
        Notification({
          message: '获取附加公文失败！',
          type: 'error'
        });
      })
  }
}

const getters = {
  confidentiality: state => state.confidentiality,
  urgency: state => state.urgency,
  selConfident: state => state.selConfident,
  selUrgency: state => state.selUrgency,
  docTtile: state => state.docTtile,
  reciver: state => state.reciver,
  extraDocs: state => state.extraDocs,

}

const mutations = {
  [types.SET_CONFIDENT](state, res) {
    state.confidentiality = res.data
    state.selConfident.docDenseTypeCode = res.data[0].dictCode;
    state.selConfident.docDenseType = res.data[0].dictName;
  },
  [types.SET_URGENCY](state, res) {
    state.urgency = res.data;
    state.selUrgency.docImportTypeCode = res.data[0].dictCode;
    state.selUrgency.docImportType = res.data[0].dictName;
  },
  [types.GET_ADMIN_STATUS](state, res) {
    state.isAdmin = res
  },
  [types.SELECT_DOC](state, res) {
    state.extraDocs = res.data;
  },
  setConfident(state, payLoad) {
    state.selConfident = payLoad
  },
  setUrgency(state, payLoad) {
    state.selUrgency = payLoad
  },
  setDocTtile(state, payLoad) {
    state.docTtile = payLoad
  },
  setReciver(state, payLoad) {
    state.reciver = payLoad;
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
