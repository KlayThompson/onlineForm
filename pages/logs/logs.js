//logs.js
import Notify from '../../utils/dist/notify/notify.js';

const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
    Notify({ type: 'warning', message: '通知内容' });
  }
})
