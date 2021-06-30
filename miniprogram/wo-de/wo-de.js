const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ynworker: 0,
    showDialog: false,
    openid: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow(e) {
    var self = this
    const openid = app.globalData.openid
    self.setData({
      openid: openid
    })
    if (app.globalData.userInfo) {
      self.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (self.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        self.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          self.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    

    db.collection('worker').where({
        _openid: openid
      })
      .get({
        success: function(res) {
          if (res.data.length == 1) {
            if (res.data[0].worker == true) {
              self.setData({
                ynworker: 1,
              })
            }
          }
        }
      })

  },
  getUserInfo: function(e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo){
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      const openid = app.globalData.openid
      db.collection('user').where({
        _openid: openid
      })
        .get({
          success: function (res) {
            if (res.data.length == 0) {
              db.collection('user').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  gouwucheworker: null, //购物车
                  gouwuchetext: null, //购物车
                  message: false,
                  name: e.detail.userInfo.nickName,
                  tell: null,
                  xingbie: null, //性别 
                  shouhuodizhi: null, //收货地址
                  morenshouhuodizhi: null, //默认收货地址
                  buy: null, //购买  
                  yuyue: null, //预约服务
                  buygo: null, //购买后发货
                  buyyes: null, //已确定收货
                  gouwuche: null, //购物车
                  shoucang: null, //收藏
                },
                success: function (res) {

                },
                fail: console.error
              })
            } else {

            }
          }
        })
    }else{
      
    }
  },

  /* 弹窗 */
  toggleDialog(e) {
    console.log(e.currentTarget.id)
    this.setData({
      name: e.currentTarget.id,
      showDialog: !this.data.showDialog
    });
  },
  goshoucang(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: '../buy/shoucang/shoucang',
            })
          }
        }
      })
    
  },
  gogouwuche(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: '../buy/gouwuche/gouwuche',
            })
          }
        }
      })
    
  },
  godingdan(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: 'dingdan/dingdan',
            })
          }
        }
      })
    
  },
  gobuydingdan(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: 'buydingdan/buydingdan',
            })
          }
        }
      })
    
  },
  goshouhuodizhi(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: 'shouhuodizhi/shouhuodizhi',
            })
          }
        }
      })
    
  },
  goadduserinfor(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: '../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
            })
          }
        }
      })
    
  },
  goshangjia(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: '../shangjia/shangjia',
            })
          }
        }
      })
    
  },
  goworker(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: '../worker/worker',
            })
          }
        }
      })
    
  },
  goworkerguanli(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
                  
                }
              }
            })
          }else{
            wx.navigateTo({
              url: 'workerguanli/workerguanli',
            })
          }
        }
      })
    
  },
  goshangpuguanli(e) {
    const openid = app.globalData.openid
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../wo-de/adduserinfor/adduserinfor',
                  })
                } else if (res.cancel) {
    
                }
              }
            })
          }else{
            wx.navigateTo({
              url: 'shangpuguanli/shangpuguanli',
            })
          }
        }
      })
    
  },


})