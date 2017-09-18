import Vue from 'vue';
import {timeFilter} from '../filters/filters'
Vue.prototype.validatePhone = validatePhone
Vue.prototype.combineObj = combineObj
Vue.prototype.timeFilter = timeFilter

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
  Object.keys(target).forEach(function(key) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  })
  return target;
}

export default{combineObj}
