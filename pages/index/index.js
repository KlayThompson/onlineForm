//index.js
//获取应用实例
import Toast from '../../utils/dist/toast/toast.js';
import Dialog from '../../utils/dist/dialog/dialog.js';

const app = getApp()

Page({
  data: {
    islogin: true,
    columns: ['A1栋', 'A2栋', 'A3栋', 'A4栋', 'A5栋'],
    building: '',
    index: 0,
    showBorder: false,
    files: [],
    hiddenChooseImg: false,
    close_img: '../../resources/close_btn.png',
    tags: [
      {
        title: '失去连接',
        select: false
      },
      {
        title: '故障',
        select: false
      },
      {
        title: '开关损坏',
        select: false
      },
      {
        title: '没电',
        select: false
      },
      {
        title: '无信号',
        select: false
      },
      {
        title: '有毒',
        select: false
      },
      {
        title: '占用中',
        select: false
      },
      ]
  },

  onLoad: function() {
    if (!this.data.islogin) {
      wx.reLaunch({
        url: '../login/login',
      })
    }
  },

  formSubmit: function(e) {
    console.log(e.detail.value)
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
  },

  selectTag: function(e) {
    console.log(e)
    var title = e.currentTarget.dataset.title
    for (var i = 0; i < this.data.tags.length; i++) {
      var model = this.data.tags[i];
      if (title == model.title) {
        let choseChange = "tags[" + i + "].select"
        this.setData({
          [choseChange]: true,
        })
      } 
      // else {
      //   let choseChange = "tags[" + i + "].select"
      //   this.setData({
      //     [choseChange]: false,
      //   })
      // }
    }
  },

  chooseImage: function (e) {
    var that = this;

  if (that.data.files.length == 6) {
    Toast('最多支持上传6张图片');
    return
  }

    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 6 - that.data.files.length,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        if (that.data.files.length == 6) {
          that.setData({
            hiddenChooseImg: true
          })
        } else {
          that.setData({
            hiddenChooseImg: false
          })
        }
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  deleImage: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var tempFiles = that.data.files
    tempFiles.splice(index)
    that.setData({
      files: tempFiles
    })
    if (tempFiles.length < 6) {
      that.setData({
        hiddenChooseImg: false
      })
    } else {
      hiddenChooseImg: true
    }
  }
  })