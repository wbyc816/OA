// 组装模块并导出 store 的文件
import Vue from 'vue'
import Vuex from 'vuex'
import dept from './modules/dept';
import center from './modules/center';
import resume from './modules/resume';
import user from './modules/user';
import * as types from './types'

Vue.use(Vuex);
// 导出需要的模块

const state = {
  searchLoading: false,
  baseURL:'http://192.168.8.92:8080/DonghaiAirAPI',
  editStatus:false
}
const getters ={
	searchLoading: state => state.searchLoading,
  editStatus: state => state.editStatus,
  baseURL: state => state.baseURL
}
const actions={
  setEditStatus({commit},palyload){
    commit(types.SET_EDIT_STATUS, palyload)
  }
}
const mutations={
	[types.SET_SEARCH_LOADING](state, palyload) {
		state.searchLoading=palyload;
	},
  [types.SET_EDIT_STATUS](state, palyload) {
    state.editStatus=palyload;
  },
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    dept,
    center,
    user,
    resume
  }
});
