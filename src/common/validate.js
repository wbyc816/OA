export const validateEquel = (compareValue)=>{
  return (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (value !== compareValue) {
      // console.log(value,compareValue)
      callback(new Error('两次输入密码不一致!'));
    } else {
      callback();
    }
  }
}

export const validateDiff = (compareValue)=>{
  return (rule,value,callback) => {
    if (value === '') {
      callback(new Error('请输入新密码'));
    } else if (value === compareValue) {
      callback(new Error('新老密码一致!'));
    } else {
      callback();
    }
  }
}