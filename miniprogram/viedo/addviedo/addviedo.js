const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fenlei: null,
    modalName: null,
    worker: null,
    textareavaluelength: 0,
    tempFilePath: null,
    checkbox: [{
        value: '美缝',
        name: '美缝',
        checked: false,
      }, {
        value: '封阳台',
        name: '封阳台',
        checked: false,
      }, {
        value: '开荒打扫',
        name: '开荒打扫',
        checked: false,
      }, {
        value: '油漆工',
        name: '油漆工',
        checked: false,
      }, {
        value: '木工',
        name: '木工',
        checked: false,
      }, {
        value: '基础工人',
        name: '基础工人',
        checked: false,
      }, {
        value: '泥工',
        name: '泥工',
        checked: false,
      }, {
        value: '水电工',
        name: '水电工',
        checked: false,
      },
      {
        value: '设计师',
        name: '设计师',
        checked: false,
      },
      {
        value: '其他',
        name: '其他',
        checked: false,
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this

    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        self.setData({
          nickName: nickName,
          avatarUrl: avatarUrl
        })
      }
    })

    db.collection('worker').where({
      _openid: app.globalData.openid
    }).get({
      success: function(res) {
        self.setData({
          worker: res.data[0]
        })
        console.log(self.data.worker)
      }
    })
  },

  upvideo(e) {
    var self = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success(res) {
        self.setData({
          tempFilePath: res.tempFilePath
        })
      }
    })
  },
  formSubmit(e) {
    
    var nickName = this.data.nickName
    var avatarUrl = this.data.avatarUrl
    var fenlei = this.data.fenlei
    var worker = this.data.worker
    var title = e.detail.value.title
    var contect = e.detail.value.contect
    var tempFilePath = this.data.tempFilePath
    var year = new Date().getFullYear()
    var month = (new Date().getMonth() + 1)
    var date = new Date().getDate()
    var time = new Date().getHours() + ':' + new Date().getMinutes()
    if (tempFilePath != null) {
      if (title != '') {
        if (contect != '') {
          if (fenlei != null) {
            wx.showLoading({
              title: '上传中...',
              mask: true
            })
            wx.cloud.uploadFile({
              cloudPath: 'vedio/' + year + '/' + month + '/' + date + '/' + title + worker.name + '.mp4',
              filePath: tempFilePath,
              success: res => {
                console.log(res.fileID)
                db.collection('viedo').add({
                  data: {
                    nickName: nickName,
                    avatarUrl: avatarUrl,
                    title: title,
                    contect: contect,
                    fenlei: fenlei,
                    lookvideo:false,
                    workerdengji: worker.workerdengji, //等级
                    workerid: worker._id, //工人_id
                    star: worker.star, //工人星级
                    name: worker.name, //名字
                    vedio: res.fileID, //视频路径
                    timeyear: year, //年
                    timemonth: month, //月
                    timedate: date, //日
                    timetime: time, //时间
                    lookall: false, //是否展开
                  },
                  success: function(res) {
                    wx.hideLoading()
                    wx.switchTab({
                      url: '../../viedo/viedo'
                    })
                    console.log(res)
                  },
                  fail: console.error
                })
              },
              fail: err => {}
            })
          } else {
            wx.showToast({
              title: '请选择分类',
              icon: 'none',
            })
          }
        } else {
          wx.showToast({
            title: '请填写内容',
            icon: 'none',
          })
        }
      } else {
        wx.showToast({
          title: '请填写标题',
          icon: 'none',
        })
      }
    } else {
      wx.showToast({
        title: '请上传视频',
        icon: 'none',
      })
    }
  },
  inputtextarea(e) {
    this.setData({
      textareavaluelength: e.detail.value.length
    })
  },
  showModal(e) {
    this.setData({
      modalName: 'ChooseModal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ChooseCheckbox(e) {
    console.log(e.currentTarget.dataset.value)
    this.setData({
      fenlei: e.currentTarget.dataset.value,
      modalName: null
    })
  },
})