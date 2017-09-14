import axios from 'axios'
import qs from 'qs'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'http://192.168.8.92:8080/DonghaiAirAPI';


//POST传参序列化
axios.interceptors.request.use((config) => {
    if(config.method  === 'post'){
        config.data = qs.stringify(config.data);
    }
    return config;
},(error) =>{
     // _.toast("错误的传参", 'fail');
    return Promise.reject(error);
});
//返回状态判断
axios.interceptors.response.use((res) => {
  if (res.data.status != '0') {
    return Promise.reject(res);
  }
  return res;
}, (error) => {

  return Promise.reject(error);
});

export function fetch(url,params) {
  return new Promise((resolve, reject) => {
    axios.post(url,params)
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


export default {
  getDeptList() {

    return fetch('/dept/selectDeptOrg');
  },
  queryEmpList(params){
    return fetch('/emp/queryEmpDeptList',params)
  },
  getEmpDetail(id){
    return fetch('/emp/getEmpInfoById',{id:id})
  },
  commonApi(url, params) {
    return fetch(url, params)
  }
}
