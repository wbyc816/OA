import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'http://192.168.8.92:8080/DonghaiAirAPI';
//axios.defaults.baseURL = 'http://58.250.197.143:8899/DonghaiAirAPI';


//POST传参序列化
axios.interceptors.request.use((config) => {
  if (!config.body) {
    config.data = qs.stringify(config.data);
  }
  return config;
}, (error) => {
  // _.toast("错误的传参", 'fail');
  return Promise.reject(error);
});
//返回状态判断
axios.interceptors.response.use((res) => {
  // if (res.data.status != '0') {
  //   return Promise.reject(res);
  // }
  return res;
}, (error) => {

  return Promise.reject(error);
});
Vue.prototype.$http = axios;
export function fetch(url, params, isBody) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, { body: isBody })
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
      .catch((error) => {
        reject(error);
      })
  })
}

export function concurrent(requests) {
  requests = requests.map(makeRequest);
  return new Promise((resolve, reject) => {
    axios.all(requests)
      .then(
        res => {
          resolve(res.map(function(elem) { return elem.data }))
        }, err => {
          reject(err);
        }
      )
      .catch((error) => {
        reject(error);
      })

  })
}

export function makeRequest(request) {
  return axios.post(request.url, request.params, { body: request.isBody })
}

export default {
  getDeptList() {
    return fetch('/dept/selectDeptOrg');
  },
  queryEmpList(params) {
    return fetch('/emp/queryEmpDeptList', params)
  },
  getEmpDetail(id) {
    return fetch('/emp/getEmpInfoById', { id: id })
  },
  getEmergencyContactInfo(id) {
    return fetch('/resume/getEmergencyContactInfo', { id: id })
  },
  updateEmergencyContactInfo(params) {
    return fetch('/resume/updateEmergencyContactInfo', params, true)
  },
  updateEmp(params) {
    return fetch('/emp/updateEmp', params, true)
  },
  commonApi(url, params) {
    return fetch(url, params)
  },
  getResumeInfo(id) {
    return fetch('/resume/getEmpInfo', { id: id })
  },
  getEmpPostInfo(id) {
    return fetch('/resume/getEmpPostInfo', { id: id })
  },
  updateBaseInfo(params) {
    return concurrent([{ url: '/resume/updateEmergencyContactInfo', params: params.emergency, isBody: true },
      { url: '/emp/updateEmp', params: params.emp, isBody: true }
    ])
  },
  getDict(dictCode,dictName) {
    return fetch('/api/getDict', { dictCode: dictCode,dictName:dictName })
  },
  getAdminStatus(id){
    return fetch('/doc/selectRecipent',{empId:id})
  },
  getDepById(id){
    return fetch('/dept/selectDeptOrgByDeptId',{deptId:id})
  },
  selectDoc(id){
    return fetch('/doc/selectDoc',{empId:id})
  },

}
