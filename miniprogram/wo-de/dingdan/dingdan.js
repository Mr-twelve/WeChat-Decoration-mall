import {
  getUUID,
  getExt
} from "../../share/utils/utils.js";
const db = wx.cloud.database()
const app = getApp()

Page({
  data: {
    a:0,
    slider: 5, //星星
    showpingjia: false,
    showDialog: false,
    imgList: [],
    usertximg: null,
    username: null,
    dingdan: [{
        name: "未接单",
      },
      {
        name: "已接单",
      },
      {
        name: "已完成",
      }
    ],
    userid: "",
    speak: null,
    oldpingjia: [],
    workerid: null,
    yuyue: [],
    TabCur: 0,
    scrollLeft: 0
  },
  onLoad(e) {
    console.log('Load')
    this.shuaxin()
  },
  onShow(e) {
    console.log('show')
    this.shuaxin()
  },
  shuaxin(e) {
    var self = this
    db.collection('yuyue').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function(res) {
        /* console.log(res.data) */
        self.setData({
          a:0,
          ///////////////////////////////////////
          yuyue: res.data
        })
      }
    })
  },

  chakan(e) {
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: 'chakan/chakan?title=' + e.currentTarget.id,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  fukuan50(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: 'fukuan/fukuan?id=' + id,
    })
  },
  fukuan30(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: 'fukuan30/fukuan30?id=' + id,
    })
  },
  fukuan20(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: 'fukuan20/fukuan20?id=' + id,
    })
  },
  formSubmit(e) {
    wx.showLoading({
      mask: true,
      title: '评价中...',
    })
    console.log(e.detail.value.speak)
    var self = this
    var fileIDList = []
    var imgList = this.data.imgList
    var usertximg = app.globalData.userInfo.avatarUrl
    var username = app.globalData.userInfo.nickName
    var id = this.data.workerid
    var speak = e.detail.value.speak
    var star = this.data.slider
    var userid = this.data.userid
    var userspeak = this.data.speak + 1
    var oldpingjia = this.data.oldpingjia

    imgList.forEach((value, index) => {
      const cloudPath = "yuyue/" + "pingjia/" + index + "-" + getUUID() + ".jpg";
      wx.cloud.uploadFile({
        filePath: value,
        cloudPath: cloudPath,
        success: (res) => {
          fileIDList.push(res.fileID);
          console.log('file', fileIDList)
          if (fileIDList.length == imgList.length) {
            var pingjia = {
              fileIDList: fileIDList,
              usertximg: usertximg,
              user: app.globalData.openid,
              name: username,
              date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
              yuyueid: userid,
              star: star,
              speak: speak
            }
            var sum = 0
            var pingjialength = oldpingjia.push(pingjia)
            oldpingjia.forEach((value, index) => {
              sum += value.star
            })
            sum = (sum / pingjialength).toFixed(1)
            console.log('[sum]', sum)
            console.log('[oldpingjia]', oldpingjia)
            console.log('[userspeak]', userspeak)
            console.log('work_id', id)
            //调用云函数评价工人
            wx.cloud.callFunction({
              name: 'yuyue-user-pingjia',
              data: {
                sum: sum,
                pingjia: oldpingjia,
                id: id,
              },
              success: res => {
                console.log('yuyue_id',userid)
                console.log('userspeak', userspeak)
                db.collection('yuyue').doc(userid).update({
                  // data 传入需要局部更新的数据
                  data: {
                    // 表示将 done 字段置为 true
                    userspeak: oldpingjia,
                    speak: parseInt(userspeak)
                  },
                  success: res => {
                    wx.hideLoading()
                    wx.showToast({
                      title: '评价成功',
                    });
                    setTimeout(function() {
                      self.shuaxin()
                      self.hipingjia()
                    }, 1500)
                  },
                  fail: console.error
                })

              },
              fail: err => {
                console.error('[云函数] [login] 调用失败', err)
              },
            })

          }
        }
      })
    })
  },
  //星星
  bindchange(e) {
    this.setData({
      slider: e.detail.value
    })
  },
  pingjia(e) {
    var self = this
    db.collection('yuyue').doc(e.currentTarget.id).get({
      success: function(res) {
        self.setData({
          userid: res.data._id,
          speak: res.data.speak,
        });
        
        db.collection('worker').where({
          _openid: res.data.workerid // 填入当前用户 openid
        }).get({
          success: function(ress) {
            self.setData({
              oldpingjia: ress.data[0].userspeak,
              workerid: ress.data[0]._id,
              showpingjia: true
            });
          }
        })
      }
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 3, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  hipingjia(e) {
    this.setData({
      showpingjia: false
    })
  },
  onReachBottom: function () {
    console.log('上拉')
    var name = this.data.name
    var yuyue = this.data.yuyue.length
    var aa = this.data.a
    var self = this
    console.log(yuyue)
    console.log(aa)
    if (yuyue == aa) {
      db.collection('yuyue').where({
        _openid: app.globalData.openid // 填入当前用户 openid
      }).skip(aa)
        .limit(20)
        .get({
          success: function (res) {
            self.setData({
              a: aa + 20,
              yuyue: self.data.yuyue.concat(res.data)
            })
          }
        })
    }
  }
})