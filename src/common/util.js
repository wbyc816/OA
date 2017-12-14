import Vue from 'vue';
import '../../static/urlConfig'
import { timeFilter, toThousands } from '../filters/filters'
Vue.prototype.validatePhone = validatePhone
Vue.prototype.combineObj = combineObj
Vue.prototype.timeFilter = timeFilter
Vue.prototype.clone = clone
Vue.prototype.changeTime = changeTime
Vue.prototype.toThousands = toThousands
Vue.prototype.getCookie = getCookie
Vue.prototype.setCookie = setCookie
Vue.prototype.delCookie = delCookie
Vue.prototype.showDowload = showDowload


function showDowload(docName){
  const docArr=['CPD','BXS','JKS','RSB','PXS','CLB','CLV','FKS','YFK','SWD','FWG']  //显示导出PDF的公文列表
  return docArr.find(d=>d==docName)!=undefined
}
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    var c_start = document.cookie.indexOf(c_name + "=")
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1
      var c_end = document.cookie.indexOf(";", c_start)
      if (c_end == -1) c_end = document.cookie.length
      return unescape(document.cookie.substring(c_start, c_end))
    }
  }
  return ""
}

function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) + ";path=/" +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + "")
}
function delCookie(c_name) {
  console.log(c_name);
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(c_name);
  if (cval != null)
    document.cookie = c_name + "=" + cval + ";path=/" + ";expires=" + exp.toGMTString();

}

function validatePhone(rule, value, callback) {
  if (value && value.length != 0) {
    if (!(/^1[34578]\d{9}$/.test(value))) {
      callback(new Error("手机号码格式有误"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

function combineObj(target, source, ignoreList) {
  Object.keys(target).forEach(function(key) {
    var temp;
    if (ignoreList && ignoreList.length != 0) {
      temp = ignoreList.find(i => i == key);
    }
    if (source.hasOwnProperty(key) && !temp) {
      target[key] = source[key]
    }
  })
  return target;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function changeTime(obj) {
  var _obj = clone(obj);
  Object.keys(obj).forEach(name => {
    if (obj[name] instanceof Date) {
      _obj[name] = obj[name].getTime();
    }
  })
  return _obj
}


function formatTime(date, fmt) { //author: meizz
  date = new Date(date)
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function preventEmpty(data, param = '空') {
  if (!data) {
    return param
  }
  return data
}

function loginOut() {
  var baseUrl=''
  if (process.env.NODE_ENV == 'development') { //开发环境
      baseUrl = urlConfig.devUrl
    } else {
      baseUrl = urlConfig.loginUrl
    }
  var a = document.createElement('a');
  a.setAttribute('href', baseUrl + "/login.html");
  // a.setAttribute('target', '_self');
  a.setAttribute('id', 'payUrl');
  // 防止反复添加
  if (!document.getElementById('payUrl')) document.body.appendChild(a);
  delCookie('userId');
  a.click();
}
export default { combineObj, formatTime, preventEmpty,loginOut,getCookie,delCookie,setCookie }
