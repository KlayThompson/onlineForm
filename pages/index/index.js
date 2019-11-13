//index.js
//获取应用实例
import Toast from '../../utils/dist/toast/toast.js';
import Dialog from '../../utils/dist/dialog/dialog.js';

const app = getApp()
var API = app.globalData.API;
var common = require('../../utils/common.js')
const qiniuUploader = require("../../utils/qiniuUploader");

Page({
  data: {
    islogin: false,
    companyArr: ['上海', '北京', '纽约'],
    company: '',
    officeArr: ['花园坊', '静安寺', '和平饭店'],
    office: '',
    buildingArr: ['A1栋', 'A2栋', 'A3栋', 'A4栋', 'A5栋'],
    building: '',
    index: 0,
    showBorder: false,
    files: [],
    hiddenChooseImg: false,
    close_img: '../../resources/close_btn.png',
    accesskey: '',
    tags: [{
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

  onShow: function() {

  },

  onLoad: function() {
    var islogin = wx.getStorageSync('isLogin')
    this.setData({
      islogin: islogin
    })
    if (!this.data.islogin) {
      wx.reLaunch({
        url: '../login/login',
      })
    }
    if (this.data.islogin) {
      var that = this;
      var header = common.getHeader();
      wx.request({
        url: API + '/v1/vwMaintenanceWxapp/requestQiniuUpToken',
        method: 'GET',
        header: header,
        success: function(res) {
          if (res.statusCode == 200) {
            that.setData({
              accesskey: res.data.upToken
            })
          }
        },
        fail: function(err) {

        }
      })
    }
  },

  formSubmit: function(e) {
    console.log(e.detail.value)
    var that = this;
    var header = common.getHeader();
    //判断数据格式是否正确
    if (common.isEmpty(that.data.company)) {
      Toast('请选择公司名称')
      return
    }
    if (common.isEmpty(that.data.office)) {
      Toast('请选择办公地点')
      return
    }
    if (common.isEmpty(that.data.building)) {
      Toast('请选择所属建筑')
      return
    }
    if (common.isEmpty(e.detail.value.username)) {
      Toast('请输入姓名')
      return
    }
    if (common.isEmpty(e.detail.value.usernum)) {
      Toast('请输入工号')
      return
    }
    if (common.isEmpty(e.detail.value.phone) || common.isPhone(e.detail.value.phone)) {
      Toast('请输入正确的手机号码')
      return
    }
    if (common.isEmpty(e.detail.value.location)) {
      Toast('请输入报修地点')
      return
    }
    if (common.isEmpty(e.detail.value.desc)) {
      Toast('请输入故障描述')
      return
    }
    var faultStrArr = []
    for (var i = 0; i < that.data.tags.length; i++) {
      var tag = that.data.tags[i]
      if (tag.select) {
        faultStrArr.push(tag.title)
      }
    }
    if (faultStrArr.length == 0) {
      Toast('请选择故障分类')
      return
    }

    if (that.data.files.length > 0) {
      var uploadCount = 0
      var picsArr = []
      for (var i = 0; i < that.data.files.length; i++) {
        var filePath = that.data.files[i];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          console.log('file url is: ' + res.fileUrl);
          //图片地址
          picsArr.push(res.fileUrl);
          if (uploadCount == that.data.files.length) {
            //图片上传完成，开始上传表单内容
            wx.request({
              url: API + '/v1/vwMaintenanceWxapp/record',
              method: 'POST',
              header: header,
              data: {
                userId: e.detail.value.usernum,
                companyName: that.data.company,
                officeAddress: that.data.office,
                building: that.data.building,
                userName: e.detail.value.username,
                jobNumber: e.detail.value.usernum,
                phone: e.detail.value.phone,
                repairAddress: e.detail.value.location,
                faultDescription: e.detail.value.desc,
                faultClass: JSON.stringify(faultStrArr),
                imgUrls: JSON.stringify(picsArr)
              },
              success: function(res) {
                if (res.statusCode == 200) {
                  console.log('成功')
                } else {
                  Toast('上报失败，请重新尝试')
                }
              },
              fail: function(err) {
                Toast('上报失败，请检查网络')
              }
            })
          }
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'ECN',
          // domain: 'q0sjvxibw.bkt.clouddn.com',
          // uptoken: that.data.accesskey,
          domain: 'q0l9bm9ve.bkt.clouddn.com',
          uptoken: 'Jwi4nt4LG0oSorAZPptqPSBNZosVAJS-TqxdSohg:r-O_SQzpjlF_Q-0LJNZ4TKPXQsI=:eyJzY29wZSI6InN3aW5nY2xvdWQiLCJkZWFkbGluZSI6MTU3MzY1MDY1MH0='
        }, (res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        }, (res) => {
          uploadCount += 1;
        });
      }
    } else {
      wx.request({
        url: API + '/v1/vwMaintenanceWxapp/record',
        method: 'POST',
        header: header,
        data: {
          userId: e.detail.value.usernum,
          companyName: that.data.company,
          officeAddress: that.data.office,
          building: that.data.building,
          userName: e.detail.value.username,
          jobNumber: e.detail.value.usernum,
          phone: e.detail.value.phone,
          repairAddress: e.detail.value.location,
          faultDescription: e.detail.value.desc,
          faultClass: JSON.stringify(faultStrArr),
          imgUrls: ''
        },
        success: function (res) {
          if (res.statusCode == 200) {
            console.log('成功')
          } else {
            Toast('上报失败，请重新尝试')
          }
        },
        fail: function (err) {
          Toast('上报失败，请检查网络')
        }
      })
    }
  },

  selectCompany: function(e) {
    if (e.type == 'tap') {
      return
    }
    this.setData({
      company: this.data.companyArr[e.detail.value]
    })
  },

  selectCompanyAddress: function(e) {
    if (e.type == 'tap') {
      return
    }
    this.setData({
      office: this.data.officeArr[e.detail.value]
    })
  },

  selectBuilding: function(e) {
    if (e.type == 'tap') {
      return
    }
    this.setData({
      building: this.data.buildingArr[e.detail.value]
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

  chooseImage: function(e) {
    var that = this;

    if (that.data.files.length == 6) {
      Toast('最多支持上传6张图片');
      return
    }

    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 6 - that.data.files.length,
      success: function(res) {
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
  previewImage: function(e) {
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