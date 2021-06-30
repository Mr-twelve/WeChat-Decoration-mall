const app = getApp()
const db = wx.cloud.database()
const _ = db.command  
Page({
  data: {
    shoucang:false,
    twoImageSize: null,
    threeImageSize: null,
    TabCur: 0,
    scrollLeft: 0,
    tab: ["工人详情", "用户评价"],
    isCalendarShow: false,
    pingjia:null,
    calendarMark: [],
    name: null,
    showDialog: false,
    worker: [],
    id: null,
  },
  onLoad: function (options) {
    var self = this
    const openid = app.globalData.openid
    db.collection('worker').doc(options.title).get({
      success: function (res) {
        console.log(res.data)
        db.collection('yuyue-tishi').doc('1e1b3423-601d-458b-92b9-4333ec0b6b29').get({
          success: function (take) {
            console.log(res.data.workprice)
            self.setData({
              stylename: options.name,
              ticheng: take.data.ticheng,
              pingjia: res.data.userspeak,
              calendarMark: res.data.worktime,
              name: res.data.work,
              worker: res.data,
              id: res.data._id
            })
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
          }
        })
      },
    })
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const weiboWidth = windowWidth - 40;
    const twoImageSize = (weiboWidth - 2.5) / 2;
    const threeImageSize = (weiboWidth - 2.5 * 2) / 3;
    this.setData({
      twoImageSize: twoImageSize,
      threeImageSize: threeImageSize
    })
  },
  buy(e) {
    var self=this
    const openid = app.globalData.openid
   db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
                  })
                } else if (res.cancel) {
                 
                }
              }
            })
          }else{
            self.setData({
              showDialog: !self.data.showDialog,
            })
          }
        }
      }) 
  },
  jvjue(e) {
    this.buy()
  },
  jieshou(e) {
    var name = this.data.name
    var id = this.data.id
    var ticheng=this.data.ticheng
    const take = {
      name: name,
      id: this.data.id
    }
    wx.navigateTo({
      url: '../../../yuyue/yuyue?name=' + name + '&id=' + id + '&ticheng=' + ticheng + '&stylename=' + this.data.stylename,
    })
    this.setData({
      showDialog: !this.data.showDialog,
    })
  },
  /**
   * 显示日历栏
   */
  onOpenCalendar() {
    this.setData({
      isCalendarShow: true
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  ynshoucang(e) {
    var self = this
    if (this.data.ifuser == true) {
      db.collection('user').where({
        _openid: app.globalData.openid // 填入当前用户 openid
      }).get().then(res => {
        self.setData({
          ynshoucang: res.data[0].gouwucheworker,
          userid: res.data[0]._id
        })
        console.log('res', res.data[0])
        const ynshoucang = res.data[0].gouwucheworker
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
            gouwucheworker: [{
              id: this.data.id,
              name: this.data.worker.name,
              tximg: this.data.worker.tximg,
              star: this.data.worker.star,
              work: this.data.worker.work,
              old: this.data.worker.old,
              kouhao: this.data.worker.kouhao,
              workerdengji: this.data.worker.workerdengji,
              fenlei: this.data.worker.fenlei
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
            gouwucheworker: _.unshift([{
              id: this.data.id,
              name: this.data.worker.name,
              tximg: this.data.worker.tximg,
              star: this.data.worker.star,
              work: this.data.worker.work,
              old: this.data.worker.old,
              kouhao: this.data.worker.kouhao,
              workerdengji: this.data.worker.workerdengji,
              fenlei: this.data.worker.fenlei
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
            gouwucheworker: ynshoucang
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