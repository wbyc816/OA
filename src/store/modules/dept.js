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
  getDeptList({ commit, rootState }, palyload) {
    if (!state.depts) {
      api.getDeptList()
        .then(res => {
          commit(types.GET_DEPT_LIST, res)
        })
    }
  },
  //按搜索条件查部门人员
  queryEmpList({ commit, rootState }, palyload) {
    if (!rootState.searchLoading) {
      commit(types.SET_SEARCH_LOADING, true, { root: true })
      Object.keys(palyload).forEach(function(key) {
        if (palyload[key].length == 0) {
          delete palyload[key]
        }
      })
      api.queryEmpList(Object.assign(palyload, { deptId: state.queryDepId, pageNumber: state.depPageNumber, pageSize: 10 }))
        .then(res => {

          setTimeout(function() {
            commit(types.SET_SEARCH_LOADING, false, { root: true })
            commit(types.QUERY_EMP_LIST, res)
          }, 300)

        }, res => {
          setTimeout(function() {
            commit(types.SET_SEARCH_LOADING, false, { root: true })
            commit(types.QUERY_EMP_LIST, '')
          }, 300)

        })
    }

  },
  //设置搜索部门
  setQueryDepId({ commit }, palyload) {
    commit(types.SET_QUERY_DEP_ID, palyload)
  },
  //设置分页
  setQueryPage({ commit }, palyload) {
    commit(types.SET_QUERY_PAGE, palyload)
  },
  //获取人员详情
  getEmpDetail({ commit, rootState }, palyload) {
    api.getEmpDetail(palyload)
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
  [types.SET_QUERY_DEP_ID](state, palyload) {
    state.queryDepId = palyload
  },
  [types.SET_QUERY_PAGE](state, palyload) {
    state.depPageNumber = palyload
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
