// pages/login/login.js
import Notify from '../../utils/dist/notify/notify.js';
import Toast from '../../utils/dist/toast/toast.js';
var timer;
const app = getApp();
var API = app.globalData.API;
var common = require('../../utils/common.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSendCodeBtn: true,
    count: 60,
    phone: '',
    vCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.cleanTimeOut()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton({})
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 点击登录按钮
  loginButtonClick: function () {
    var that = this;

    if (this.data.phone.length != 11) {
      Toast('请输入正确的手机号');
      return;
    }
    if (this.data.vCode.length == 0) {
      Toast('请输入短信验证码');
      return;
    }
    var header = common.getHeader()
    wx.request({
      url: API + '/v1/vwMaintenanceWxapp/login',
      method: 'POST',
      header: header,
      data: {
        phoneNumber: that.data.phone,
        smsCode: that.data.vCode
      },
      success: function (res) {
        if (res.statusCode == 200) {
          wx.setStorageSync('sessionToken', res.data.sessionToken)
          wx.setStorageSync("isLogin", true)
          Notify({
            type: 'success',
            message: '登录成功',
            onClose: function () {
              wx.reLaunch({
                url: '../index/index',
              })
            }
          })
        } else if (res.statusCode == 403) {
          Notify({ type: 'warning', message: '短信验证码错误' })
        } else {
          Notify({
            type: 'warning',
            message: '登录失败'
          });
        }

      },
      fail: function (err) {
        Notify({
          type: 'warning',
          message: '登录失败'
        });
      }
    })
  },

  sendCode() {
    var that = this;
    if (!this.data.showSendCodeBtn) {
      return;
    }

    if (this.data.phone.length != 11) {
      Toast('请输入正确的手机号');
      return;
    }
    var header = common.getHeader()
    wx.request({
      url: API + '/v1/vwMaintenanceWxapp/requestLoginSmsCode',
      method: 'POST',
      header: header,
      data: {
        phoneNumber: that.data.phone
      },
      success: function (res) {
        if (res.statusCode == 200) {
          that.setData({
            showSendCodeBtn: false
          })

          //开始倒计时
          timer = setInterval(function () {
            that.countdown()
          }, 1000)
          Notify({
            type: 'success',
            message: '验证码已发送'
          });
        } else if (res.statusCode == 403) {
          Notify({
            type: 'warning',
            message: '该手机号不存在,用户无权登录'
          });
        } else {
          Notify({
            type: 'warning',
            message: '验证码发送失败'
          });
        }
        
      },
      fail: function (err) {
        Notify({
          type: 'warning',
          message: '验证码发送失败，请检查网络连接'
        });
      }
    })
  },

  countdown: function () {
    if (this.data.count == 0) {
      this.setData({
        showSendCodeBtn: true
      })
      this.cleanTimeOut()
    } else {
      var wait = this.data.count;
      wait--;
      this.setData({
        count: wait
      })
    }
  },

  cleanTimeOut() {
    if (timer != null) {
      clearTimeout(timer)
    }
    this.setData({
      count: 60
    })
  },

  // 验证码输入框监听
  modalVCodeInputChange: function (event) {
    this.setData({
      vCode: event.detail.value
    })
  },
  // 手机号输入监听
  inputPhoneNumberChange: function (e) {
    this.setData({
      phone: e.detail.value
    })
  }
})