import api from '../../fetch/api'
import * as types from '../types'


const state = {
  depts: '',
  searchRes: '',
  queryDepId: null,
  depPageNumber: 1,
  empDetial: ''
}

const actions = {

  //获取部门列表
  getDeptList({ commit, rootState }, payload) {
    api.getDeptList()
      .then(res => {
        commit(types.GET_DEPT_LIST, res)
      })
  },
  //按搜索条件查部门人员
  queryEmpList({ commit, rootState }, payload) {
    if (!rootState.searchLoading) {
      commit(types.SET_SEARCH_LOADING, true, { root: true })
      Object.keys(payload).forEach(function(key) {
        if (payload[key] == '' || payload[key] == undefined || payload[key] == null) {
          delete payload[key]
        }
      })
      api.queryEmpList(Object.assign(payload, { deptId: state.queryDepId, pageNumber: state.depPageNumber, pageSize: 10 }))
        .then(res => {
          setTimeout(function() {
            commit(types.SET_SEARCH_LOADING, false, { root: true })
            commit(types.QUERY_EMP_LIST, res)
          }, 300)

        }, res => {
          setTimeout(function() {
            commit(types.SET_SEARCH_LOADING, false, { root: true })
            // commit(types.QUERY_EMP_LIST, '')
          }, 300)

        })
    }

  },
  //设置搜索部门
  setQueryDepId({ commit }, payload) {
    commit(types.SET_QUERY_DEP_ID, payload)
  },
  //设置分页
  setQueryPage({ commit }, payload) {
    commit(types.SET_QUERY_PAGE, payload)
  },
  //获取人员详情
  getEmpDetail({ commit, rootState }, payload) {
    api.getEmpDetail(payload)
      .then(res => {
        commit(types.GET_EMP_DATAIL, res)
      }, res => {
        commit(types.GET_EMP_DATAIL, '')
      })
  },
  //清除人员详情
}

const getters = {
  depts: state => state.depts,
  searchRes: state => state.searchRes,
  // inputName: state => state.inputName,
  queryDepId: state => state.queryDepId,
  // inputWorkMo: state => state.inputWorkMo,
  // iputMobileNumber: state => state.iputMobileNumber,
  // iputPhoneNumber: state => state.iputPhoneNumber,
  depPageNumber: state => state.depPageNumber,
  empDetial: state => state.empDetial,
}

const mutations = {
  [types.GET_DEPT_LIST](state, res) {
    state.depts = res.data.deptList
  },
  [types.QUERY_EMP_LIST](state, res) {
    state.searchRes = res
  },
  [types.SET_QUERY_DEP_ID](state, payload) {
    state.queryDepId = payload
  },
  [types.SET_QUERY_PAGE](state, payload) {
    state.depPageNumber = payload
  },
  [types.GET_EMP_DATAIL](state, res) {
    state.empDetial = res.data
  },
}

export default {
  state,
  actions,
  getters,
  mutations
}
