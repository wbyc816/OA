import Vue from 'vue';
import { timeFilter } from '../filters/filters'
Vue.prototype.validatePhone = validatePhone
Vue.prototype.combineObj = combineObj
Vue.prototype.timeFilter = timeFilter
Vue.prototype.clone = clone
Vue.prototype.changeTime = changeTime
Vue.prototype.renderContent = renderContent

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

Vue.prototype.getCookie = getCookie
Vue.prototype.setCookie = function (c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + escape(value) + ";path=/" +
    ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString() + "")

}
Vue.prototype.delCookie = function (c_name) {
  console.log(c_name);
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = this.getCookie(c_name);
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

function combineObj(target, source) {
  Object.keys(target).forEach(function (key) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  })
  return target;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
function changeTime(obj) {
  var _obj = obj;
  Object.keys(_obj).forEach(name => {
    console.log(_obj[name] instanceof Date)
    if (_obj[name] instanceof Date) {
      _obj[name] = _obj[name].getTime();

    }
  })
  console.log(_obj)
  return _obj
}

function renderContent(h, { node, data, store }) {
  return (
    <span>
      <span>
        <span>{data.name}</span>
      </span>
      <span style="float: right; margin-right: 20px">
        <el-button class="depAdd" type="primary" icon="plus" size="mini" on-click={() => this.addDep(store, data)}>添加</el-button>
      </span>
    </span>);
}

function formatTime (date, fmt) { //author: meizz
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

export default { combineObj, formatTime }
