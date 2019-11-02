//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    islogin: true,
    columns: ['A1栋', 'A2栋', 'A3栋', 'A4栋', 'A5栋'],
    building: '',
    index: 0,
    showBorder: false
  },

  onLoad: function() {
    if (!this.data.islogin) {
      wx.reLaunch({
        url: '../login/login',
      })
    }
  },

  formSubmit: function(e) {
    console.log('')
  },

  selectCompany: function() {
    console.log('121')
  },

  selectCompanyAddress: function() {

  },

  selectBuilding: function(e){
    this.setData({
      building: this.data.columns[e.detail.value]
    })
  }
  })