import api from '../../fetch/api'
import * as types from '../types'


const state = {
  supplierList: [],
  currencyList: [],
}

const actions = {

  //获取供应商列表
  getSupplier({ commit, rootGetters, state }, payload) {
    if (state.supplierList.length === 0) {
      api.getSupplier(rootGetters.userInfo.empId)
        .then(res => {
          if (res.status == '0') {
            res.data.forEach((s, index) => {
              s.id = s.supplierName;
            })
            commit(types.GET_SUPPLIER_LIST, res.data)
          } else {

          }
        })
    }
  },

  //获取币种类型
  getCurrency({ commit, rootState, state }, payload) {
    if (state.currencyList.length === 0) {
      api.getCurrency()
        .then(res => {
          if (res.status == '0') {
            commit(types.GET_CURRENCY_LIST, res.data)
          } else {

          }
        })
    }
  },

}

const getters = {
  supplierList: state => state.supplierList,
  currencyList: state => state.currencyList,
}

const mutations = {
  [types.GET_SUPPLIER_LIST](state, data) {
    state.supplierList = data
  },
  [types.GET_CURRENCY_LIST](state, data) {
    state.currencyList = data
  },
}

export default {
  state,
  actions,
  getters,
  mutations
}
