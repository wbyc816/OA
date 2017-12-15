import Vue from 'vue'
Vue.filter('time', timeFilter);
Vue.filter('sex', sexFilter);
Vue.filter('phone', phone);
Vue.filter('didDate', didDate);
Vue.filter('percent', percent);
Vue.filter('toThousands', toThousands);
Vue.filter('nodeNameFormatter', nodeNameFormatter);
Vue.filter('dotdotdot', dotdotdot);
Vue.filter('moneyCh', moneyCh);

function timeFilter(value, type) { //value为13位的时间戳
  function t(s) {
    return s < 10 ? '0' + s : s;
  };



  if (value != '' && value != null && value != undefined) {
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
    } else if (type == 'xie') {
      return y + '/' + t(m + 1) + '/' + t(d);
    } else if (type == 'day') {
      return d;
    } else if (type == 'week') {
      return weeks[w];
    } else if (type == 'month') {
      return months[m];
    } else if (type == 'ch') {
      return y + '年' + (m + 1) + '月' + d + '日';
    } else if (type == 'all') {
      return y + '-' + t(m + 1) + '-' + t(d) + ' ' + t(h) + ':' + t(min) + ':' + t(s)
    } else if (type == 'birthday') {
      return t(m + 1) + '月' + t(d) + '日'
    } else if (type == 'hours') {
      return t(h) + ":" + t(min);
    } else if (type == 'second') {
      return t(h) + ":" + t(min) + ":" + t(s);
    } else if (type == 'nosecond') {
      return y + '-' + t(m + 1) + '-' + t(d) + ' ' + t(h) + ':' + t(min)
    }

  } else {
    return value;
  }
}

function phone(val) {
  if (val) {
    return val.slice(0, 3) + ' ' + val.slice(3, 7) + ' ' + val.slice(7, 11)
  } else {
    return val
  }
}

function didDate(val) {
  if (val) {
    return val.slice(0, 4) + '.' + val.slice(4, 6);
  } else {
    return val
  }
}

function percent(val) {
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
  var arr = (val || 0).toString().split('.'),
    result = '';
  var num = arr[0];
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  if (arr[1]) {
    result = result + '.' + arr[1].substr(0, 2);
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

function dotdotdot(val) {
  var max = 45;
  if (val.length > max) {
    return val.substr(0, max - 3) + '...'
  } else {
    return val
  }
}

function moneyCh(money) {
  var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字  
  var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位  
  var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位  
  var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位  
  var cnInteger = "整"; //整数金额时后面跟的字符  
  var cnIntLast = "圆"; //整型完以后的单位  
  var maxNum = 999999999999999.9999; //最大处理的数字  
  var zeroCount;
  var IntLen;
  var decLen;
  var IntegerNum; //金额整数部分  
  var DecimalNum; //金额小数部分  
  var ChineseStr = ""; //输出的中文金额字符串  
  var parts; //分离金额后用的数组，预定义  
  if (money == "") {
    return "";
  }
  money = parseFloat(money);
  if (money >= maxNum) {

    return "";
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger;
    //ChineseStr = cnNums[0] + cnIntLast
    //document.getElementById("show").value=ChineseStr;  
    return ChineseStr;
  }
  money = money.toString(); //转换为字符串  
  if (money.indexOf(".") == -1) {
    IntegerNum = money;
    DecimalNum = '';
  } else {
    parts = money.split(".");
    IntegerNum = parts[0];
    DecimalNum = parts[1].substr(0, 4);
  }
  if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换  
    zeroCount = 0;
    IntLen = IntegerNum.length;
    for (var i = 0; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1);
      var p = IntLen - i - 1;
      var q = p / 4;
      var m = p % 4;
      if (n == "0") {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0];
        }
        zeroCount = 0; //归零  
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q];
      }
    }
    ChineseStr += cnIntLast;
    //整型部分处理完毕  
  }
  if (DecimalNum != '') { //小数部分  
    decLen = DecimalNum.length;
    for (var i = 0; i < decLen; i++) {
      var n = DecimalNum.substr(i, 1);
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    //ChineseStr += cnNums[0] + cnIntLast;
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger;
    //ChineseStr += cnInteger; 
  }
  return ChineseStr;
}
export { timeFilter, toThousands }
