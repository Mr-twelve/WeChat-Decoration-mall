const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    TabCur: 0,
    tabname: ['上架中', '下架中'],
    tabnamexs: '上架中',
    a: 0,
    goods: [],
    goodsgengduos: 'huodong',
    goodsgengduo: false,
    huodong: false,
    gaijia: false,
    shezhiname: false,
    shezhitell: false,
    shezhishangpuname: false,
    shezhi: false,
    id: null,
    shangpu: null,
    have: false,
    /////////////////////////
    shangpuname: '',
    imgList: '',
    region: ['北京市', '北京市', '东城区'],
    xingbie: '先生',
    name: '',
    tell: '',
    xingbievalue: true,
  },

  onLoad: function(options) {

  },
  onShow(e) {
    var self = this
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        db.collection('userinfo').where({
          _openid: res.result.openid
        }).get({
          success: function(res) {
            self.shuaxin()
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  shuaxin(e) {
    var self = this
    var aa = this.data.a
    db.collection('shangpu').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function(res) {
        console.log(res.data.length)
        if (res.data.length != 0) {
          self.setData({
            TabCur: 0,
            tabnamexs: '上架中',
            goodsgengduos: 'huodong',
            goodsgengduo: false,
            huodong: false,
            gaijia: false,
            shezhiname: false,
            shezhitell: false,
            shezhishangpuname: false,
            shezhi: false,
            have: true,
            a: 0,
            goods: [],
            shangpu: res.data[0],
            id: res.data[0]._id
          })
          self.getgoods()
          console.log(self.data.worker.tximg)
        }
        if (res.data.length == 0) {
          wx.redirectTo({
            url: '../wo-de/addshangpin/addshangpin'
          })
        }
      }
    })
  },
  getgoods() {
    var self = this
    var id = this.data.id
    var aa = this.data.a
    db.collection('goods').where({
        shangpuid: id
      }).skip(aa)
      .limit(20)
      .get({
        success: function(res) {
          console.log(res)
          self.setData({
            a: aa + 20,
            shangpuname: '',
            imgList: '',
            region: ['北京市', '北京市', '东城区'],
            xingbie: '先生',
            name: '',
            tell: '',
            xingbievalue: true,
            goods: self.data.goods.concat(res.data),
          })
        },
        complete() {
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      })
  },
  xingbie: function(e) {
    if (e.detail.value) {
      this.setData({
        xingbie: "先生"
      })
    } else {
      this.setData({
        xingbie: "女士"
      })
    }
    console.log('switch 发生 change 事件，携带值为', e)
  },
  RegionChange: function(e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.tell)
    var shangpuname = e.detail.value.shangpuname
    var name = e.detail.value.name
    var tell = e.detail.value.tell
    var xingbie = this.data.xingbie
    var region = this.data.region
    var tximg = this.data.imgList
    if (tximg != "") {
      if (shangpuname != "") {
        if (name != "") {
          if (tell.length == 11) {
            wx.showLoading({
              title: '认证发布中...',
              mask: true
            })
            const cloudPath = "shangpu/" + shangpuname + "/" + shangpuname + ".jpg";
            wx.cloud.uploadFile({
              cloudPath: cloudPath,
              filePath: tximg[0], // 文件路径
              success: res => {
                var img = res.fileID
                db.collection('shangpu').add({
                  data: {
                    date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                    shangpuname: shangpuname,
                    name: name,
                    tell: tell,
                    xingbie: xingbie,
                    region: region,
                    tximg: img,

                    quxiao: false, //
                    renzheng: false, //是否通过认证
                    goods: [], //商品列表

                  },
                  success: function(res) {
                    console.log('成功')
                    wx.hideLoading()
                    wx.showModal({
                      title: '认证提交完成',
                      content: '请耐心等待审核通过，可到个人页面查看',
                      showCancel: false,
                      success(res) {
                        if (res.confirm) {
                          wx.switchTab({
                            url: '../../wo-de/wo-de'
                          })
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  },
                  fail: console.error
                })
                console.log(res.fileID)
              },
              fail: err => {}
            })
          } else {
            wx.showToast({
              title: '请填写正确的手机号',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          wx.showToast({
            title: '请填写您的真实姓名',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '请填写店铺名字',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '请上传店铺头像',
        icon: 'none',
        duration: 1000
      })
    }
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          imgList: res.tempFilePaths
        })
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  //////////////////////////////////////////////////////////////////////
  quxiaorenzheng(e) {
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    var self = this
    wx.showModal({
      title: '提示',
      content: '取消申请后可重新发布申请详细',
      success(res) {
        if (res.confirm) {
          db.collection('shangpu').doc(id).remove({
            success(res) {
              wx.switchTab({
                url: '../../wo-de/wo-de',
              })
            },
            fail: console.error
          })
        } else if (res.cancel) {}
      }
    })
  },
  add(e) {
    var shangpu = this.data.shangpu
    console.log(shangpu)
    var shangpuname = this.data.shangpu.name
    var shangpulocation = this.data.shangpu.region
    console.log(shangpuname)
    console.log(shangpulocation)
    var id = e.currentTarget.id
    var self = this
    wx.navigateTo({
      url: 'add/add?shangpuid=' + id + '&&shangpuname=' + shangpuname + '&&shangpulocation=' + shangpulocation,
    })
  },
  ingoods(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../buy/goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  //改价
  gaijia(e) {
    var id = e.currentTarget.id
    this.setData({
      id: id,
      gaijia: !this.data.gaijia
    })
  },
  //拼团活动
  pintuan(e) {
    var self = this
    var id = this.data.id
    if (e.detail.value.people == '2') {
      var style = '2人团'
    }
    if (e.detail.value.people == '3') {
      var style = '3人团'
    }
    if (e.detail.value.people == '4') {
      var style = '4人团'
    }

    if (e.detail.value.pintuanjiage != null && e.detail.value.pintuanjiage != '') {
      var huodong = {
        style: style,
        people: parseInt(e.detail.value.people),
        price: e.detail.value.pintuanjiage,
      }

      db.collection('goods').doc(id).update({
        data: {
          huodonghave: true,
          huodong: huodong
        },
        success(e) {
          self.shuaxin()
        },
        fail: console.error
      })

    } else {
      wx.showToast({
        title: '请填写拼团价格',
        icon: 'none',
        duration: 1000
      })
    }
    console.log(huodong)
  },
  goodsgengduo(e) {
    var id = e.currentTarget.id
/*     this.setData({
      id: id,
      goodsgengduo: !this.data.goodsgengduo
    }) */
    wx.navigateTo({
      url: 'huodong/huodong?id=' + e.currentTarget.id,
    })
  },
  goodsgengduos(e) {
    console.log(e)
    var goodsgengduos = e.currentTarget.id
    this.setData({
      goodsgengduos: goodsgengduos,
    })
  },
  newjiage(e) {
    var self = this
    console.log(e.detail.value.jiage)
    var id = this.data.id
    var jiage = e.detail.value.jiage
    db.collection('goods').doc(id).update({
      data: {
        price: jiage
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })

  },
  xiajia(e) {
    var self = this
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定删除该商品？',
      success(res) {
        if (res.confirm) {
          db.collection('goods').doc(id).remove({
            success(res) {
              wx.hideLoading()
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                self.shuaxin()
              }, 1500)
            },
          })
        } else if (res.cancel) {}
      }
    })
  },
  xiaoshou(e) {
    var id = this.data.shangpu._id
    console.log(id)
    wx.navigateTo({
      url: 'xiaoshou/xiaoshou?shangpuid=' + id,
    })
  },
  shezhi(e) {
    this.setData({
      shezhi: true
    })
  },
  wancheng(e) {
    this.setData({
      shezhi: false
    })
  },
  shezhiname(e) {
    this.setData({
      shezhiname: !this.data.shezhiname
    })
  },
  shezhitell(e) {
    this.setData({
      shezhitell: !this.data.shezhitell
    })
  },
  shezhishangpuname(e) {
    this.setData({
      shezhishangpuname: !this.data.shezhishangpuname
    })
  },
  shezhiname1(e) {
    var self = this
    console.log(e.detail.value.name)
    var id = this.data.id
    var name = e.detail.value.name
    db.collection('shangpu').doc(id).update({
      data: {
        name: name
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
  },
  shezhitell1(e) {
    var self = this
    console.log(e.detail.value.tell)
    var id = this.data.id
    var tell = e.detail.value.tell
    db.collection('shangpu').doc(id).update({
      data: {
        tell: tell
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
  },
  shezhishangpuname1(e) {
    var self = this
    console.log(e.detail.value.shangpuname)
    var id = this.data.id
    var shangpuname = e.detail.value.shangpuname
    db.collection('shangpu').doc(id).update({
      data: {
        shangpuname: shangpuname
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
  },
  zhuxiao(e) {
    var self = this
    var openid = app.globalData.openid
    var shangpuid = this.data.id
    wx.showModal({
      title: '确定注销该商铺？',
      content: '务必确定没有未完成的订单再注销',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '注销中...',
            mask: true
          })
          db.collection('shangpu').doc(shangpuid).remove({
            success(e) {
              wx.cloud.callFunction({
                // 要调用的云函数名称
                name: 'shangpu-zhuxiao',
                // 传递给云函数的参数
                data: {
                  id: openid,
                },
                success: res => {
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function () {
                    wx.switchTab({
                      url: '../../wo-de/wo-de',
                    })
                  }, 1500)
                  
                },
                fail: err => {},
                complete: () => {}
              })
            },
            fail: console.error
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  quxiao2(e) {
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    var self = this
    db.collection('shangpu').doc(id).remove({
      success(res) {
        wx.switchTab({
          url: '../../wo-de/wo-de',
        })
      },
      fail: console.error
    })
  },
  onPullDownRefresh: function() {
    console.log('下拉')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.shuaxin()
  },
  onReachBottom: function() {
    console.log('上拉')
    var goods = this.data.goods.length
    var aa = this.data.a
    console.log(goods)
    console.log(aa)
    if (goods == aa) {
      this.getgoods()
    }
  },
  tabSelect(e) {
    this.setData({
      tabnamexs: this.data.tabname[e.currentTarget.dataset.id],
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  xiajiaxiajia(e) {
    var self = this
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定下架该商品？',
      success(res) {
        if (res.confirm) {
          db.collection('goods').doc(id).update({
            data: {
              shangjia: false
            },
            success(res) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                self.shuaxin()
              }, 1500)
              
            },
            fail: console.error
          })
        } else if (res.cancel) {}
      }
    })
  },
  shangjia(e){
    var self = this
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定上架该商品？',
      success(res) {
        if (res.confirm) {
          db.collection('goods').doc(id).update({
            data: {
              shangjia: true
            },
            success(res) {
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              setTimeout(function () {
                self.shuaxin()
              }, 1500)
              
            },
            fail: console.error
          })
        } else if (res.cancel) { }
      }
    })
  }
})