//app.js
App({
  onLaunch: function () {
  },
  globalData: {
    userInfo: null,
    API: 'https://tapp.anyocharging.com:4204',
    isLogin: wx.getStorageSync('isLogin')
  }
})