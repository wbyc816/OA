import util from './util'

const dutyFmt = function(date) {
  if(!date) {
    return '空'
  }
  return util.formatTime(date, 'yyyy-MM-dd') 
}

const phoneFmt = function(num) {
   if(!num){
     return '空'
   }
   return num
}

export const fmts = [['dutyDate', dutyFmt],['deptName'],['empName'],['mobileNumber', phoneFmt],['phoneNumber', phoneFmt],['id']]