const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifuserwx:false,
    ifuser: true,
    pindanpeople: 0,
    chakanpindan: false,
    good: null,
    slider: 5, //星星
    twoImageSize: null,
    threeImageSize: null,
    pingjia: null,
    TabCur: 0,
    scrollLeft: 0,
    tab: ["商品详情", "评价"],
    ynshoucang: [],
    shoucang: false,
    userid: '',
    image: [],
    name: '',
    price: '',
    describe: '',
    _id: '',
    number: 1, //商品数量
  },

  onLoad: function(options) {
    var self = this
    wx.showLoading({
      title: '加载中...',
    })
    console.log(options.goods_id)
    db.collection('goods').doc(options.goods_id).get({
      success: res => {
        // res.data 包含该记录的数据
        const goods0 = res.data
        console.log('goods0', res.data)
        const shoucang = res.data.shoucang
        var pindanpeople = 0
        goods0.huodongxiangqin.forEach((value, index) => {
          pindanpeople += value.people
        })
        self.setData({
          pindanpeople: pindanpeople,
          good: goods0,
          pingjia: res.data.pingjia,
          tximage: res.data.tximage,
          image: res.data.image,
          price: res.data.price,
          describe: res.data.describe,
          _id: res.data._id,
          name: res.data.name
        })
        wx.hideLoading()
      },
      complete: res => {
        const openid = app.globalData.openid
        db.collection('user').where({
            _openid: openid
          })
          .get({
            success: function(res) {
              if (res.data.length == 0) {
                self.setData({
                  ifuser: false
                })
              } else {
                self.setData({
                  ifuserwx: res.data[0].message
                })
                self.ynshoucang()
              }
            }
          })
      }
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
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  //查看全部拼单
  chakanpindan(e) {
    if (this.data.ifuser == true) {
      this.setData({
        chakanpindan: !this.data.chakanpindan
      })
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
  //参与拼单
  chanyupindan(e) {
    if (this.data.ifuser == true) {
      if (this.data.ifuserwx == true) {
        wx.navigateTo({
          url: 'buy/pindanbuy/pindanbuy?take=' + this.data._id + '&&index=' + e.currentTarget.id + '&&style=' + this.data.good.huodong.style,
        })
      } else {
        wx.showModal({
          content: '订购服务需要填写详细',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    } else {
      wx.showModal({
        content: '初次使用请注册相关信息',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
            })
          } else if (res.cancel) {

          }
        }
      })
    }

  },
  //是否收藏
  ynshoucang(e) {
    var self = this
    if (this.data.ifuser == true) {
      db.collection('user').where({
        _openid: app.globalData.openid // 填入当前用户 openid
      }).get().then(res => {
        self.setData({
          ynshoucang: res.data[0].shoucang,
          userid: res.data[0]._id
        })
        console.log('res', res.data[0])
        const ynshoucang = res.data[0].shoucang
        const goodsid = self.data._id
        /* const id = res.data[0]._id */
        for (var i = 0; i < ynshoucang.length; i++) {
          if (ynshoucang[i].id == goodsid) {
            self.setData({
              shoucang: true,
            })
          }
        }
      })
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
    var id = self.data._id
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
            shoucang: ynshoucang
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
  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: this.data.image,
      current: e.target.id
    });
  },
  onImage(e) {
    console.log(e)
    wx.previewImage({
      urls: e.currentTarget.id,
      current: ""
    });
  },
  addgouwuche(e) {
    if (this.data.ifuser == true) {
      console.log(e.currentTarget.dataset.target)
      this.setData({
        modalName: true
      })
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
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  trueadd(e) {
    this.setData({
      modalName: null
    })
    db.collection('user').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get().then(res => {
      if (res.data[0].gouwuche == null) {
        db.collection('user').doc(this.data.userid).update({
          // data 传入需要局部更新的数据
          data: {
            gouwuche: [{
              id: this.data._id,
              number: parseInt(e.target.dataset.target),
              name: this.data.name,
              price: this.data.price,
              tximg: this.data.tximage
            }]

          },
          success(res) {
            wx.showToast({
              title: '成功加入购物车',
              icon: 'success',
              duration: 1500,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          },
          fail: console.error
        })
      } else {
        db.collection('user').doc(this.data.userid).update({
          // data 传入需要局部更新的数据
          data: {
            gouwuche: _.unshift([{
              id: this.data._id,
              number: parseInt(e.target.dataset.target),
              name: this.data.name,
              price: this.data.price,
              tximg: this.data.tximage
            }])

          },
          success(res) {
            wx.showToast({
              title: '成功加入购物车',
              icon: 'success',
              duration: 1500,
              mask: true,
              success: function(res) {},
              fail: function(res) {},
              complete: function(res) {},
            })
          },
          fail: console.error
        })
      }
    })
  },
  lose(e) {
    if (this.data.number > 1) {
      this.setData({
        number: this.data.number - 1
      })
    }
  },
  lose10(e) {
    if (this.data.number > 10) {
      this.setData({
        number: this.data.number - 10
      })
    }
  },
  add(e) {
    this.setData({
      number: this.data.number + 1
    })
  },
  add10(e) {
    this.setData({
      number: this.data.number + 10
    })
  },
  text(e) {
    console.log('userid', this.data.userid)
    console.log('name', this.data.name)
    console.log('price', this.data.price)
    console.log('image', this.data.image)
    console.log('discribe', this.data.describe)
  },
  shoucang(e) {
    var self = this
    if (this.data.ifuser == true) {
      if (this.data.ynshoucang == null) {
        db.collection('user').doc(this.data.userid).update({
          // data 传入需要局部更新的数据
          data: {
            shoucang: [{
              id: this.data._id,
              name: this.data.name,
              price: this.data.price,
              tximg: this.data.tximage
            }]
          },
          success(res) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1500,
              mask: true,
              success: function(res) {
                self.setData({
                  shoucang: true
                })
              },
              fail: function(res) {},
              complete: function(res) {
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
            shoucang: _.unshift([{
              id: this.data._id,
              name: this.data.name,
              price: this.data.price,
              tximg: this.data.tximage
            }])
          },
          success(res) {
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1000,
              mask: true,
              success: function(res) {
                self.setData({
                  shoucang: true
                })
              },
              fail: function(res) {},
              complete: function(res) {
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
  buy(e) {
    if (this.data.ifuser == true) {
      if (this.data.ifuserwx==true){
        wx.navigateTo({
          url: 'buy/buy?take=' + this.data._id + '&&have=' + 'false',
        })
      }else{
        wx.showModal({
          content: '订购服务需要填写详细',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../wo-de/adduserinfor/adduserinfor?xiangxi='+true,
              })
            } else if (res.cancel) {

            }
          }
        })
      }
    } else {
      wx.showModal({
        content: '初次使用请注册相关信息',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
            })
          } else if (res.cancel) {

          }
        }
      })
    }

  },
  pindan(e) {
    if (this.data.ifuser == true) {
      if (this.data.ifuserwx == true) {
        wx.navigateTo({
          url: 'buy/buy?take=' + this.data._id + '&&have=' + 'true' + '&&style=' + this.data.good.huodong.style,
        })
      } else {
        wx.showModal({
          content: '订购服务需要填写详细',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
              })
            } else if (res.cancel) {

            }
          }
        })
      }
      
    } else {
      wx.showModal({
        content: '初次使用请注册相关信息',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
            })
          } else if (res.cancel) {

          }
        }
      })
    }

  }
})