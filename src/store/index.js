// 组装模块并导出 store 的文件
import Vue from 'vue'
import Vuex from 'vuex'
import dept from './modules/dept';
import user from './modules/user';
import * as types from './types'

Vue.use(Vuex);
// 导出需要的模块

const state = {
  searchLoading: false
}
const getters ={
	searchLoading: state => state.searchLoading
}
const mutations={
	[types.SET_SEARCH_LOADING](state, palyload) {
		state.searchLoading=palyload;
	}
}
export default new Vuex.Store({
  state,
  getters,
  mutations,
  modules: {
    dept,
    user
  }
});
