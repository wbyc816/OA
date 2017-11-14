import Vue from 'vue'
Vue.filter('time', timeFilter);
Vue.filter('sex', sexFilter);
Vue.filter('phone', phone);
Vue.filter('didDate', didDate);
Vue.filter('percent', percent);
Vue.filter('toThousands', toThousands);
Vue.filter('nodeNameFormatter', nodeNameFormatter);
Vue.filter('dotdotdot', dotdotdot);

function timeFilter(value, type) { //value为13位的时间戳
  function t(s) {
    return s < 10 ? '0' + s : s;
  };
  
    

  if (value!=''&&value!=null&&value!=undefined) {
    value = parseInt(value);
    var time = new Date(value);
    var y = time.getFullYear(); //年
    var m = time.getMonth(); //月
    var d = time.getDate(); //日
    var w = time.getDay(); //星期
    var h = time.getHours(); //时
    var min = time.getMinutes(); //分
    var s = time.getSeconds(); //秒
    // const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    // const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (type == 'date') {
      return y + '-' + t(m + 1) + '-' + t(d);
    }else if (type == 'xie') {
      return y + '/' + t(m + 1) + '/' + t(d);
    }else if (type == 'day') {
      return d;
    } else if (type == 'week') {
      return weeks[w];
    } else if (type == 'month') {
      return months[m];
    } else if (type == 'ch') {
      return y+'年'+(m + 1)+'月'+d+'日';
    } else if (type == 'all') {
      return y + '-' + t(m + 1) + '-' + t(d) + ' ' + t(h) + ':' + t(min) + ':' + t(s)
    }else if (type == 'birthday') {
      return  t(m + 1) + '月' + t(d) + '日'
    }else if (type == 'hours') {
      return  t(h)+":"+t(min);
    }else if (type == 'second') {
      return  t(h)+":"+t(min)+":"+t(s);
    }else if (type == 'nosecond') {
      return  y + '-' + t(m + 1) + '-' + t(d) + ' ' + t(h) + ':' + t(min) 
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
function didDate(val) {
  if (val) {
    return val.slice(0, 4) + '.' + val.slice(4, 6);
  }else{
    return val
  }
}
function percent(val){
  return Math.round(val * 10000) / 100.00 + "%"
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
function toThousands(val) {  
    var arr=(val || 0).toString().split('.'),result = '';
    var num = arr[0];  
    while (num.length > 3) {  
        result = ',' + num.slice(-3) + result;  
        num = num.slice(0, num.length - 3);  
    }  
    if (num) { result = num + result; }  
    if(arr[1]){
      result=result+'.'+arr[1].substr(0, 2);
    }
    return result;  
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

function dotdotdot(val){
  var max=45;
  if(val.length>max){
    return val.substr(0,max-3)+'...'
  }else{
    return val
  }
}
export { timeFilter,toThousands }
