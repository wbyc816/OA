import Vue from 'vue'
Vue.filter('time', function (value,type) {//value为13位的时间戳
  function t(s) {
        return s < 10 ? '0' + s: s;
  };
  if(typeof value=='number'){
    var time = new Date(value);
    var y = time.getFullYear();
    var m = time.getMonth();
    var d = time.getDate();
    var w = time.getDay();
    const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
    const weeks=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    if(!type){
      return y + '-' + t(m+1) + '-' + t(d);
    }
    else if(type=='day'){
      return t(d);
    }
    else if(type=='week'){
      return weeks[w];
    }
    else if(type=='month'){
      return months[m];
    }
  }else{
    return value;
  }

});