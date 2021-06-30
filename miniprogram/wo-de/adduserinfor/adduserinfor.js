// miniprogram/pages/adduserinfor/adduserinfor.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yanzmnumber: null,
    yanzminput: null,
    btnDisabled: false,
    second: 60,
    yanzm: '发送验证码',
    newdata: true,
    region: ['北京市', '北京市', '东城区'],
    xingbie: '男',
    name: '',
    xiangxidizhi: '',
    tell: '',
    tellinput: null,
    xingbievalue: true,
    have: false,
    zcxiangxi: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (options.xiangxi){
      this.setData({
        zcxiangxi:true
      })

    }else{
      
    }
    var self = this
    db.collection('user').where({
        _openid: app.globalData.openid
      })
      .get({
        success: function(res) {
          if (res.data.length != 0) {
            console.log('tiaozhuan', res.data[0])
            if (res.data.xingbie = "男") {
              var xingbievalue = true
            } else {
              var xingbievalue = false
            }
            if (res.data[0].message==false){
              self.setData({
                message: res.data[0].message,
                id: res.data[0]._id,
                have: true,
              })
            }else{
              self.setData({
                message: res.data[0].message,
                id: res.data[0]._id,
                have: true,
                newdata: false,
                xingbievalue: xingbievalue,
                name: res.data[0].name,
                xiangxidizhi: res.data[0].xiangxidizhi,
                tell: res.data[0].tell,
                region: res.data[0].region
              })
            }
          } else {}
        }
      })
  },

  xingbie: function(e) {
    if (e.detail.value) {
      this.setData({
        xingbie: "男"
      })
    } else {
      this.setData({
        xingbie: "女"
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
    console.log(e.detail.value)
    var id=this.data.id
    var message = this.data.message
    var name = e.detail.value.name
    var yanzmnumber = this.data.yanzmnumber
    var yanzminput = this.data.yanzminput
    var location = e.detail.value.location
    var region = this.data.region
    var have = this.data.have
    //var xiangxidizhi = e.detail.value.xiangxidizhi
    var tell = e.detail.value.tell
    var xingbie = this.data.xingbie
    var shouhuodizhi0 = [{
      location: location,
      name: name,
      tell: tell,
      region: region
    }]
    console.log(have)
    if (name !== "" && tell.length != "") {
      if (yanzminput == yanzmnumber && yanzminput.length == 6) {
        if (have == false) {
          if (location != "") {
            db.collection('user').add({
              // data 字段表示需新增的 JSON 数据
              data: {
                gouwucheworker: null, //购物车
                gouwuchetext: null, //购物车
                message:true,
                name: name,
                tell: tell,
                xingbie: xingbie, //性别 
                shouhuodizhi: shouhuodizhi0, //收货地址
                morenshouhuodizhi: null, //默认收货地址
                buy: null, //购买  
                yuyue: null, //预约服务
                buygo: null, //购买后发货
                buyyes: null, //已确定收货
                gouwuche: null, //购物车
                shoucang: null, //收藏
              },
              success: function(res) {
                wx.showToast({
                    title: '信息提交',
                    icon: 'sucess',
                    duration: 1000,
                    complete(res) {
                      wx.switchTab({
                        url: '../../wo-de/wo-de'
                      })
                    }
                  }),
                  console.log(res)
              },
              fail: console.error
            })
          } else {
            wx.showToast({
              title: '请填写详细地址',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          if (message==true){
            db.collection('user').doc(id).update({
              data: {
                message: true,
                name: name,
                tell: tell,
              },
              success: function (res) {
                wx.showToast({
                  title: '信息提交',
                  icon: 'sucess',
                  duration: 2000,
                  complete(res) {
                    setTimeout(function () {
                      wx.switchTab({
                        url: '../../wo-de/wo-de'
                      })
                    }, 1000)
                  }
                }),
                  console.log(res)
              },
              fail: console.error

            })
          }else{
            if (location != "") {
              db.collection('user').doc(id).update({
                // data 字段表示需新增的 JSON 数据
                data: {
                  message: true,
                  name: name,
                  tell: tell,
                  xingbie: xingbie, //性别 
                  shouhuodizhi: shouhuodizhi0, //收货地址
                  morenshouhuodizhi: null, //默认收货地址
                  buy: null, //购买  
                  yuyue: null, //预约服务
                  buygo: null, //购买后发货
                  buyyes: null, //已确定收货
                  gouwuche: null, //购物车
                  shoucang: null, //收藏
                },
                success: function (res) {
                  wx.showToast({
                    title: '信息提交',
                    icon: 'sucess',
                    duration: 1000,
                    complete(res) {
                      wx.switchTab({
                        url: '../../wo-de/wo-de'
                      })
                    }
                  }),
                    console.log(res)
                },
                fail: console.error
              })
            } else {
              wx.showToast({
                title: '请填写详细地址',
                icon: 'none',
                duration: 1000
              })
            }
          }
          
        }

      } else {
        wx.showToast({
          title: '请输入正确验证码',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '！信息不完整',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /* 手机验证码 */
  tell(e) {
    this.setData({
      tellinput: e.detail.value
    })
  },
  yanzma(e) {
    if (this.data.tellinput != null && this.data.tellinput.length == 11) {
      this.fasongyzm()
      let promise = new Promise((resolve, reject) => {
        let setTimer = setInterval(
          () => {
            var second = this.data.second - 1;
            this.setData({
              second: second,
              yanzm: second + '秒',
              btnDisabled: true
            })
            if (this.data.second <= 0) {
              this.setData({
                second: 60,
                yanzm: '获取验证码',
                btnDisabled: false
              })
              resolve(setTimer)
            }
          }, 1000)
      })
      promise.then((setTimer) => {
        clearInterval(setTimer)
      })
    } else {
      wx.showToast({
        title: '请输入正确手机号',
        icon: 'none',
        duration: 1000
      })
    }
  },
  fasongyzm(e) {
    var number = Math.floor(Math.random() * 1000000)
    console.log(number)
    if (number > 99999 && number < 1000000) {
      var mobile = this.data.tellinput
      var smscode = number
      var plugin = requirePlugin("qcloudsms")
      this.setData({
        yanzmnumber: smscode
      })
      /* plugin.sendSMS(
      {
        secretid: 'AKIDGDXewGaLTfzoh1R0SA2qqq3B6rJjzQ4MgTVg',
        secretkey: '6RvOLkx8Pn8a6ldu93ow8RhfAh33o1BlhYr835Z2',
        mobile: mobile,
        content: '您的手机号：' + mobile + '，验证码：' + smscode + '，请及时完成验证，如不是本人操作请忽略。【腾讯云市场】'
      },
      function success(res) {
        if (res.data.message) {
          console.log(res.data.message)
        } else if (res.data.result >= 0) {
          console.log(res.data.errmsg)
        } else {
          console.log(res.data.errmsg)
        }
      },
      function fail(err) {
        console.log(err.errMsg)
      }
    )  */
    } else {
      this.fasongyzm()
    }
  },
  yanzminput(e) {
    this.setData({
      yanzminput: e.detail.value
    })
  },
  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    if (e.detail.userInfo) {
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
                  wx.switchTab({
                    url: '../../wo-de/wo-de'
                  })
                },
                fail: console.error
              })
            } else {

            }
          }
        })
    } else {

    }
  },
})