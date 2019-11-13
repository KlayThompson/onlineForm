//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    API: 'http://172.16.1.2:3505',
    isLogin: wx.getStorageSync('isLogin')
  }
})