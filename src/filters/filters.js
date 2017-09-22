import Vue from 'vue'
Vue.filter('time',timeFilter);
Vue.filter('sex',sexFilter);
Vue.filter('nodeNameFormatter',nodeNameFormatter);

function timeFilter(value, type) { //value为13位的时间戳
  function t(s) {
    return s < 10 ? '0' + s : s;
  };
  if (typeof value == 'number') {
    var time = new Date(value);
    var y = time.getFullYear();
    var m = time.getMonth();
    var d = time.getDate();
    var w = time.getDay();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (type=='date') {
      return y + '-' + t(m + 1) + '-' + t(d);
    } else if (type == 'day') {
      return t(d);
    } else if (type == 'week') {
      return weeks[w];
    } else if (type == 'month') {
      return months[m];
    }
  } else {
    return value;
  }
}
function nodeNameFormatter(cellValue) {
  switch (cellValue) {
    case "start":
      return "发起";
      break;
    case 'task':
      return "批核";
      break;
    case 'trans':
      return "转发";
      break;
    case 'end':
      return "归档";
      break;

    default:
      return cellValue;
  }
}

function sexFilter(val) {
  switch (val) {
    case "F":
      return "女";
      break;
    case 'M':
      return "男";
      break;

    default:
      return val;
  }
}
export {timeFilter}