const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  data: {
    neir:null,
    shoucang:false,
  },

  onLoad: function(options) {
    console.log(options.id)
    var self=this
    const openid = app.globalData.openid
    db.collection('saomang').doc(options.id).get({
      success: function (res) {
        console.log(res.data)
        self.setData({
          id: options.id,
          neir: res.data
        })
        
        console.log(openid)
        db.collection('user').where({
          _openid: openid
        })
          .get({
            success: function (res) {
              console.log(res)
              if (res.data.length == 0) {
                self.setData({
                  ifuser: false
                })
              } else {
                self.setData({
                  ifuser: true
                })
                self.ynshoucang()
              }
            }
          })
      },
    })
  },
  //是否收藏
  ynshoucang(e) {
    var self = this
    if (this.data.ifuser == true) {
      db.collection('user').where({
        _openid: app.globalData.openid // 填入当前用户 openid
      }).get().then(res => {
        self.setData({
          ynshoucang: res.data[0].gouwuchetext,
          userid: res.data[0]._id
        })
        console.log('res', res.data[0])
        const ynshoucang = res.data[0].gouwuchetext
        const goodsid = self.data.id
        for (var i = 0; i < ynshoucang.length; i++) {
          if (ynshoucang[i].id == goodsid) {
            self.setData({
              shoucang: true,
            })
          }
        }
      })
    }

  },
  shoucang(e) {
    var self = this
    if (this.data.ifuser == true) {
      if (this.data.ynshoucang == null) {
        db.collection('user').doc(this.data.userid).update({
          // data 传入需要局部更新的数据
          data: {
            gouwuchetext: [{
              id: this.data.id,
              title: this.data.neir.title,
              tximg: this.data.neir.fenmianimg,
              fenlei: this.data.neir.fenlei
            }]
          },
          success(res) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1500,
              mask: true,
              success: function (res) {
                self.setData({
                  shoucang: true
                })
              },
              fail: function (res) { },
              complete: function (res) {
                self.ynshoucang()
              },
            })
          },
          fail: console.error
        })
      } else {
        db.collection('user').doc(this.data.userid).update({
          // data 传入需要局部更新的数据
          data: {
            gouwuchetext: _.unshift([{
              id: this.data.id,
              title: this.data.neir.title,
              tximg: this.data.neir.fenmianimg,
              fenlei: this.data.neir.fenlei
            }])
          },
          success(res) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1000,
              mask: true,
              success: function (res) {
                self.setData({
                  shoucang: true
                })
              },
              fail: function (res) { },
              complete: function (res) {
                self.ynshoucang()
              },
            })
          },
          fail: console.error
        })
      }
    } else {
      wx.showModal({
        content: '初次使用请注册相关信息',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../wo-de/adduserinfor/adduserinfor',
            })
          } else if (res.cancel) {

          }
        }
      })
    }

  },
  quxiaoshoucang(e) {
    var self = this
    var id = self.data.id
    var userid = self.data.userid
    var ynshoucang = self.data.ynshoucang
    ynshoucang.forEach((value, index) => {
      console.log(value.id)
      if (value.id == id) {
        console.log(index)
        ynshoucang.splice(index, 1)
        self.setData({
          shoucang: false,
          ynshoucang: ynshoucang
        })
        db.collection('user').doc(userid).update({
          // data 传入需要局部更新的数据
          data: {
            gouwuchetext: ynshoucang
          },
          success(res) {
            wx.showToast({
              title: '已取消收藏',
              icon: 'success',
              duration: 1500,
            })
          },
          fail: console.error
        })
      }
    })
  },

})