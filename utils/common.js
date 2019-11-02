
var md5 = require('./md5.js')
var Base64 = require('./base64.min.js')
const appid = '123'
const appkey = 'UtOCzqb67d3sN12Kts4URwy8';
const API_ = 'https://tapp.anyocharging.com:12333'
function isPhone(phoneNum) {
  var reg = /^1[0-9]{10}$/
  return reg.test(phoneNum)
}



function isEmpty(val){

  if (typeof val == 'boolean' ){
    return val
  }

  if(typeof val == 'null'){
    return true
  }
  if(val.length == 0){
    return true
  }
  if(val.replace(/(^s*)|(s*$)/g, "").length == 0){
    return true
  }
}

function formatPhone(phone){
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

/**
 * 获取全局请求头
 */
function getHeader(){
  var r = Date.parse(new Date())
  var password = md5.hexMD5(r + appkey)
  var sign = password + ',' + r;
  // var session = 'cc2bcf06781f4ebd9e4b55baa13ed50e';
  var session = wx.getStorageSync('sessionToken')

  var obj = {
    'app-id': appid,
    'app-sign': sign,
    'session-token': session
  }
  return obj
}

module.exports = {
  isPhone: isPhone,
  isEmpty: isEmpty,
  formatPhone: formatPhone,
  getHeader: getHeader,
}
