import api from '../../fetch/api'
import * as types from '../types'
import { Notification } from 'element-ui';
import router from '../../router'


const state = {
  confidentiality: [], //机密程度
  urgency: [], //重要程度
  docType: [], //公文类别
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
  extraDocs: [],
  processView: false,
  processData: []
}

const actions = {
  //重置
  clear({ commit, state }) {
    commit('setConfident', {
      "docDenseTypeCode": state.confidentiality[0].dictCode,
      "docDenseType": state.confidentiality[0].dictName
    })
    commit('setUrgency', {
      "docImportTypeCode": state.urgency[0].dictCode,
      "docImportType": state.urgency[0].dictName,
    })
    commit('setDocTtile', '')
    commit('setReciver', '')
  },

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
  //获取公文类型
  getDocForm({ commit, state }) {
    if (state.docType.length == 0) {
      api.getDocForm()
        .then(res => {
          commit(types.GET_DOC_FORM, res)
        }, res => {
          Notification({
            message: '获取公文类别失败！',
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
  selectDoc({ commit, rootGetters, state }) {
    api.selectDoc(rootGetters.userInfo.empId)
      .then(res => {
        if (res.status == "0") {
          commit(types.SELECT_DOC, res);
        } else {
          // Notification({
          //   message: '获取附加公文失败！',
          //   type: 'error'
          // });
        }
      }, res => {
        Notification({
          message: '获取附加公文失败！',
          type: 'error'
        });
      })
  },
  //提交公文
  submitDoc({ commit, state, rootState, rootGetters, dispatch }, payLoad) {
    var params = {
      "suggestPath": "",
      "taskDeptMajorName": rootGetters.userInfo.deptVo.fatherDept,
      "taskDeptMajorId": rootGetters.userInfo.deptVo.fatherDeptId,
      "taskDeptName": rootGetters.userInfo.deptVo.dept,
      "taskDeptId": rootGetters.userInfo.deptVo.deptId,
      "taskUserName": rootGetters.userInfo.name,
      "taskUserId": rootGetters.userInfo.empId,
      "docTypeCode": payLoad.docTypeCode,
      "docTitle": state.docTtile,
      "isSubmit":1
    }
    Object.assign(params, state.reciver, state.selConfident, state.selUrgency, payLoad.params)
    api.submitDoc(payLoad.url,params)
      .then(res => {
        if (res.status == "0") {
          this.commit(types.SET_SUBMIT_LOADING, false, { root: true })
          Notification({
            message: '呈报公文成功',
            type: 'success'
          });
          dispatch('clear')
          router.push('/doc/docTracking');
        } else {
          Notification({
            message: '呈报公文失败，请重试！',
            type: 'error'
          });
        }
      }, res => {
        Notification({
          message: '呈报公文失败，请重试！',
          type: 'error'
        });
      })
  },
  //流程信息
  getTaskDetail({ commit, rootGetters }, id) {
    commit(types.SET_PROCESS_VIEW, true)
    api.getTaskDetail(id)
      .then(res => {
        if (res.status == "0") {
          commit(types.GET_PROCESS_DATA, res);
        } else {
          // Notification({
          //   message: '获取附加公文失败！',
          //   type: 'error'
          // });
        }
      }, res => {
        Notification({
          message: '获取流转信息失败！',
          type: 'error'
        });
      })
  },
  //分发公文
  docDistribution({ commit, rootGetters }, params) {
    api.docDistribution(params)
      .then(res => {
        if (res.status == '0') {
          Notification({
            message: '分发公文成功',
            type: 'success'
          });
          router.push('/doc/docSearch');
        } else {
          Notification({
            message: '分发公文失败，请重试！',
            type: 'error'
          });
        }
      }, res => {

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
  docType: state => state.docType,
  isAdmin: state => state.isAdmin,
  processView: state => state.processView,
  processData: state => state.processData,
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
  [types.GET_DOC_FORM](state, res) {
    state.docType = res.data
  },
  [types.SELECT_DOC](state, res) {
    state.extraDocs = res.data.records;
  },
  [types.GET_PROCESS_DATA](state, res) {
    state.processData = res.data;
  },
  [types.SET_PROCESS_VIEW](state, res) {
    state.processView = res;
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
