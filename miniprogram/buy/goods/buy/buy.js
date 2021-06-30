const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    have: 'false',
    style: null,
    region: ['陕西省', '西安市', '雁塔区'],
    showadd: false,
    shangpu: null,
    shangpuid: null,
    buy: null,
    usershouhuodizhi0: null,
    showDialog: false,
    index: 0,
    userid: '',
    usershouhuodizhi: null,
    total: 0, //选中商品总价
    tximage: null,
    price: null,
    describe: null,
    _id: null,
    name: null,
    number: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.have == 'false') {
      this.setData({
        _id: options.take,
        userInfo: app.globalData.userInfo
      })
    }
    if (options.have == 'true') {
      this.setData({
        have: 'true',
        _id: options.take,
        style: options.style,
        userInfo: app.globalData.userInfo
      })
    }

  },
  onShow: function(options) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    var self = this
    var _id = self.data._id
    console.log(_id)
    db.collection('goods').doc(_id).get({
      success: res => {
        self.setData({
          goods: res.data,
          shangpuid: res.data.shangpuid,
          tximage: res.data.tximage,
          price: res.data.price,
          total: res.data.price,
          describe: res.data.describe,
          _id: res.data._id,
          name: res.data.name,
        })
        console.log('[goods]', self.data.goods)
        var shangpuid = res.data.shangpuid
        db.collection('shangpu').doc(shangpuid).get({
          success: function(res) {
            self.setData({
              shangpu: res.data,
            })
            console.log('[shangpu]', self.data.shangpu)
            db.collection('user').where({
              _openid: app.globalData.openid // 填入当前用户 openid
            }).get({
              success(res) {
                self.setData({
                  buy: res.data[0].buy,
                  userid: res.data[0]._id,
                  usershouhuodizhi: res.data[0].shouhuodizhi,
                  usershouhuodizhi0: res.data[0].shouhuodizhi[0]
                })
                console.log('[buy]', self.data.buy)
                console.log('[userid]', self.data.userid)
                console.log('[usershouhuodizhi]', self.data.usershouhuodizhi)
                console.log('[usershouhuodizhi0]', self.data.usershouhuodizhi0)
              },
              complete(a) {
                const name = self.data.name
                const price = self.data.price
                if (name != null && price != null) {
                  wx.hideLoading()
                  self.total()
                }
              }
            })
          },
        })
      },
    })

  },
  //商品数量减
  lose(e) {
    const number = this.data.number - 1
    if (number < 1) {} else {
      this.setData({
        number: number
      })
      this.total()
    }
  },
  //商品数量加
  add(e) {
    console.log(e.currentTarget.id)
    const number = this.data.number + 1
    this.setData({
      number: number
    })
    this.total()
  },
  total(e) {
    const number = this.data.number
    var sum = 0
    if (this.data.have == 'false') {
      sum = number * this.data.price + sum
      this.setData({
        total: sum,
      })
    }
    if (this.data.have == 'true') {
      sum = number * this.data.goods.huodong.price + sum
      this.setData({
        total: sum,
      })
    }

  },

  /**
   * 控制 pop 的打开关闭
   * 该方法作用有2:
   * 1：点击弹窗以外的位置可消失弹窗
   * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
   */
  shouhuodizhi(e) {
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  shouhuodizhi2(e) {
    console.log(e.currentTarget.id)
    this.setData({
      usershouhuodizhi0: this.data.usershouhuodizhi[e.currentTarget.id],
      showDialog: !this.data.showDialog
    });
  },
  formSubmit(e) {
    wx.showLoading({
      title: '加载中...',
    })
    if (this.data.usershouhuodizhi0 != null) {
    if (this.data.have == 'false') {
      console.log(e)
      var self = this
      var name = this.data.name
      var price = this.data.price
      var shangpuid = this.data.shangpuid
      var tximage = this.data.tximage
      var jindu = 0
      var beizhu = e.detail.value.beizhu
      var usershouhuodizhi0 = this.data.usershouhuodizhi0
      var total = this.data.total
      var number = this.data.number
      var id = this.data._id

      db.collection('buygoods').add({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          date0: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
          date1: null,
          date2: null,
          huodong: null,
          pingjia: {},
          ifpingjia: 0,
          shangpuid: shangpuid,
          name: name,
          price: price,
          tximage: tximage,
          jindu: 0,
          beizhu: beizhu,
          usershouhuodizhi: usershouhuodizhi0,
          total: total,
          number: number,
          goodsid: id,
          kuaidi: null
        },
        success: function(rreess) {
          wx.hideLoading()
          wx.showToast({
              title: '下单成功',
              icon: 'sucess',
              duration: 2000,
              complete(rreess) {
                setTimeout(function() {
                  //要延时执行的代码
                  wx.switchTab({
                    url: '../../../wo-de/wo-de'
                  })
                }, 1500) //延迟时间
              }
            }),
            console.log(rreess)
        },
        fail: console.error
      })
    }
    if (this.data.have == 'true') {
      //活动/////////////////////////////////////
      console.log(e)
      var self = this
      var huodong = this.data.style
      var name = this.data.name
      var price = this.data.goods.huodong.price
      var shangpuid = this.data.shangpuid
      var tximage = this.data.tximage
      var jindu = 0
      var beizhu = e.detail.value.beizhu
      var usershouhuodizhi0 = this.data.usershouhuodizhi0
      var total = this.data.total
      var number = this.data.number
      var id = this.data._id
      var userInfo = this.data.userInfo
      db.collection('buygoods').add({
        // data 传入需要局部更新的数据
        data: {
          // 表示将 done 字段置为 true
          date0: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
          date1: null,
          date2: null,
          huodong: huodong,
          pingjia: {},
          ifpingjia: 0,
          shangpuid: shangpuid,
          name: name,
          price: price,
          tximage: tximage,
          jindu: 999,
          beizhu: beizhu,
          usershouhuodizhi: usershouhuodizhi0,
          total: total,
          number: number,
          goodsid: id,
          kuaidi: null
        },
        success: function(rreess) {
          var user = [{
            people: 1,
            user: [{
              name: userInfo.nickName,
              tximg: userInfo.avatarUrl,
              openid: app.globalData.openid,
              buygoodsid: rreess._id
            }]
          }]
          db.collection('goods').doc(id).get({
            success: function(res) {
              var oldhuodongxiangqin = res.data.huodongxiangqin
              var newhuodongxiangqin = oldhuodongxiangqin.concat(user)
              wx.cloud.callFunction({
                name: 'goods-huodong-pindan',
                data: {
                  newhuodongxiangqin: newhuodongxiangqin,
                  id: id,
                },
                success: res => {
                  wx.hideLoading()
                  wx.showToast({
                    title: '下单成功',
                    icon: 'sucess',
                    duration: 2000,
                    complete(rreess) {
                      setTimeout(function() {
                        //要延时执行的代码
                        wx.switchTab({
                          url: '../../../wo-de/wo-de'
                        })
                      }, 1500) //延迟时间
                    }
                  })
                },
              })
            }
          })
        },
        fail: console.error
      })
    }
  }else{
      wx.showToast({
        title: '请添加收货地址',
        icon: 'none',
        duration: 1000
      })
  }
  },


  addshouhuodizhi(e) {
    wx.navigateTo({
      url: '../../../wo-de/shouhuodizhi/addshouhuodizhi/addshouhuodizhi',
    })
  },
  adddizhi(e) {
    this.setData({
      showadd: true
    })
  },
  hidedizhi(e) {
    this.setData({
      showDialog: false,
      showadd: false
    })
  },
  RegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  //提交地址学习
  submitdizhi(e) {
    var self = this
    var location = e.detail.value.location
    var name = e.detail.value.name
    var tell = e.detail.value.tell
    if (name != "") {
      if (tell.length == 11) {
        if (location != "") {
          var shouhuodizhi0 = [{
            location: e.detail.value.location,
            name: e.detail.value.name,
            tell: e.detail.value.tell,
            region: this.data.region
          }]
          self.setData({
            usershouhuodizhi0: shouhuodizhi0[0],
          })
          db.collection('user').where({
            _openid: app.globalData.openid // 填入当前用户 openid
          }).get({
            success: function(res) {
              var userid = res.data[0]._id
              var shouhuodizhi = res.data[0].shouhuodizhi
              if (shouhuodizhi == null || shouhuodizhi == '' || shouhuodizhi == []) {
                var newshouhuodizhi = shouhuodizhi0
              } else {
                var newshouhuodizhi = shouhuodizhi0.concat(shouhuodizhi)
              }
              console.log(shouhuodizhi)
              console.log(newshouhuodizhi)
              db.collection('user').doc(userid).update({
                data: {
                  shouhuodizhi: newshouhuodizhi
                },
                success: function(res) {
                  self.setData({
                    usershouhuodizhi: newshouhuodizhi,
                  })
                },

                fail: console.error,
                complete() {
                  self.hidedizhi()
                },
              })
            }
          })

        } else {
          wx.showToast({
            title: '请输入详细地址',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '请填写名字',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //修改地址
  xiugai(e) {
    var id = this.data.userid
    var index = e.currentTarget.id
    console.log(e)
    wx.navigateTo({
      url: 'xiugai/xiugai?id=' + id + '&&index=' + index,
    })
  }
})