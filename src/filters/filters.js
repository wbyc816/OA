import Vue from 'vue'
Vue.filter('time', timeFilter);
Vue.filter('sex', sexFilter);
Vue.filter('phone', phone);
Vue.filter('nodeNameFormatter', nodeNameFormatter);

function timeFilter(value, type) { //value为13位的时间戳
  function t(s) {
    return s < 10 ? '0' + s : s;
  };
  if (type == 'all') {
    value = parseInt(value);
  }
  if (typeof value == 'number') {
    var time = new Date(value);
    var y = time.getFullYear(); //年
    var m = time.getMonth(); //月
    var d = time.getDate(); //日
    var w = time.getDay(); //星期
    var h = time.getHours(); //时
    var min = time.getMinutes(); //分
    var s = time.getSeconds(); //秒
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (type == 'date') {
      return y + '-' + t(m + 1) + '-' + t(d);
    }else if (type == 'xie') {
      return y + '/' + t(m + 1) + '/' + t(d);
    }else if (type == 'day') {
      return t(d);
    } else if (type == 'week') {
      return weeks[w];
    } else if (type == 'month') {
      return months[m];
    } else if (type == 'all') {
      return y + '-' + t(m + 1) + '-' + t(d) + ' ' + t(h) + ':' + t(min) + ':' + t(s)
    }
  } else {
    return value;
  }
}

function phone(val) {
  if (val) {
    return val.slice(0, 3) + ' ' + val.slice(3, 7) + ' ' + val.slice(7, 11)
  }else{
    return val
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
export { timeFilter }
