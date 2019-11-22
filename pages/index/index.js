//index.js
//获取应用实例
import Toast from '../../utils/dist/toast/toast.js';
import Dialog from '../../utils/dist/dialog/dialog.js';

const app = getApp()
var API = app.globalData.API;
var common = require('../../utils/common.js')
const qiniuUploader = require("../../utils/qiniuUploader");
var jsonData = require('../../utils/data.js')

Page({
  data: {
    islogin: false,
    companyArr: ['上汽大众安亭基地'],
    company: '',
    officeArr: [],
    office: '',
    buildingArr: [],
    building: '',
    index: 0,
    showBorder: false,
    files: [],
    hiddenChooseImg: false,
    close_img: '../../resources/close_btn.png',
    accesskey: '',
    tags: [
      {
        title: '消防设施',
        select: false
      },
      {
        title: '保卫设施',
        select: false
      },
      {
        title: '食堂及浴室设施',
        select: false
      },
      {
        title: 'IT类（64999）',
        select: false
      },
      {
        title: '照明类',
        select: false
      },
      {
        title: '空调与通风',
        select: false
      },
      {
        title: '办公室家具',
        select: false
      },
      {
        title: '电子设备（电视投影冰箱微波炉等）',
        select: false
      },
      {
        title: '电力供应',
        select: false
      },
      {
        title: '天然气设施',
        select: false
      },
      {
        title: '自来水供应',
        select: false
      },
      {
        title: '祥源动力管线（蒸汽压缩空气冷热水）',
        select: false
      },
      {
        title: '土建类',
        select: false
      },
      {
        title: '其他',
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
    var arr = jsonData.getOfficeData();
    that.setData({
      officeArr: arr
    })
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
    if (common.isEmpty(that.data.office.office)) {
      Toast('请选择办公地点')
      return
    }
    if (common.isEmpty(that.data.building.building)) {
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
    if (common.isEmpty(e.detail.value.phone) || !common.isPhone(e.detail.value.phone)) {
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
      Toast.loading({
        duration: 0,
        mask: true,
        message: '请稍后...'
      });
      var picsArr = []
      for (var i = 0; i < that.data.files.length; i++) {
        var filePath = that.data.files[i];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          console.log('file url is: ' + res.fileUrl);
          //图片地址
          picsArr.push(res.fileUrl);
          if (picsArr.length == that.data.files.length) {
            //图片上传完成，开始上传表单内容
            wx.request({
              url: API + '/v1/vwMaintenanceWxapp/record',
              method: 'POST',
              header: header,
              data: {
                userId: e.detail.value.usernum,
                companyName: that.data.company,
                officeAddress: that.data.office.office,
                building: that.data.building.building,
                userName: e.detail.value.username,
                jobNumber: e.detail.value.usernum,
                phone: e.detail.value.phone,
                repairAddress: e.detail.value.location,
                faultDescription: e.detail.value.desc,
                faultClass: JSON.stringify(faultStrArr),
                imgUrls: JSON.stringify(picsArr)
              },
              success: function(res) {
                Toast.clear()
                if (res.statusCode == 200) {
                  Toast.success({
                    message: '故障上报成功!',
                    duration: 3500,
                    onClose: function () {
                      //清空表单
                      wx.reLaunch({
                        url: '../index/index',
                      })
                    }
                  })
                } else {
                  Toast('故障上报失败，请重新尝试')
                }
              },
              fail: function(err) {
                Toast.clear()
                Toast('故障上报失败，请检查网络')
              }
            })
          }
        }, (error) => {
          console.log('error: ' + error);
        }, {
          region: 'ECN',
          domain: 'q0sjvxibw.bkt.clouddn.com',
          uptoken: that.data.accesskey,
          // domain: 'q0l9bm9ve.bkt.clouddn.com',
          // uptoken: 'Jwi4nt4LG0oSorAZPptqPSBNZosVAJS-TqxdSohg:r-O_SQzpjlF_Q-0LJNZ4TKPXQsI=:eyJzY29wZSI6InN3aW5nY2xvdWQiLCJkZWFkbGluZSI6MTU3MzY1MDY1MH0='
        });
      }
    } else {
      Toast.loading({
        mask: true,
        message: '请稍后...'
      });
      wx.request({
        url: API + '/v1/vwMaintenanceWxapp/record',
        method: 'POST',
        header: header,
        data: {
          userId: e.detail.value.usernum,
          companyName: that.data.company,
          officeAddress: that.data.office.office,
          building: that.data.building.building,
          userName: e.detail.value.username,
          jobNumber: e.detail.value.usernum,
          phone: e.detail.value.phone,
          repairAddress: e.detail.value.location,
          faultDescription: e.detail.value.desc,
          faultClass: JSON.stringify(faultStrArr),
          imgUrls: ''
        },
        success: function (res) {
          Toast.clear()
          if (res.statusCode == 200) {
            Toast.success({
              message: '故障上报成功!',
              duration: 3500,
              onClose: function() {
                //清空表单
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            })
          } else {
            Toast('故障上报失败，请重新尝试')
          }
        },
        fail: function (err) {
          Toast.clear()
          Toast('故障上报失败，请检查网络')
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
    var arr = this.data.officeArr[e.detail.value].buildingList
    this.setData({
      office: this.data.officeArr[e.detail.value],
      buildingArr: arr,
      building: ''
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
          [choseChange]: !model.select,
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