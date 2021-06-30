const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yanzmnumber: null,
    yanzminput: null,
    tellinput: null,
    btnDisabled: false,
    second: 60,
    yanzm: '发送验证码',
    imgList: '',
    newdata: true,
    region: ['北京市', '北京市', '东城区'],
    xingbie: '先生',
    name: '',
    xiangxidizhi: '',
    tell: '',
    xingbievalue: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    db.collection('worker').where({
      _openid: app.globalData.openid
    })
      .get({
        success: function (res) {
          if (res.data.length != 0) {
            console.log('tiaozhuan', res.data[0])
            if (res.data.xingbie = "先生") {
              var xingbievalue = true
            } else {
              var xingbievalue = false
            }
            self.setData({
              imgList: res.data[0].tximg,
              newdata: false,
              xingbievalue: xingbievalue,
              name: res.data[0].name,
              xiangxidizhi: res.data[0].xiangxidizhi,
              tell: res.data[0].tell,
              region: res.data[0].region
            })
          } else {
            db.collection('user').where({
              _openid: app.globalData.openid
            })
              .get({
                success: function (e) {
                  if (e.data[0].shouhuodizhi.length != 0) {
                    self.setData({
                      region: e.data[0].shouhuodizhi[0].region
                    })
                  }
                }
              })
          }
        }
      })
  },
  xingbie: function (e) {
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
  RegionChange: function (e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.tell)
    var yanzmnumber = this.data.yanzmnumber
    var yanzminput = this.data.yanzminput
    var old = e.detail.value.old
    var name = e.detail.value.name
    var xiangxidizhi = e.detail.value.xiangxidizhi
    var tell = e.detail.value.tell
    var xingbie = this.data.xingbie
    var region = this.data.region
    var tximg = this.data.imgList
    const jibeng = {
      old: old,
      name: name,
      xiangxidizhi: xiangxidizhi,
      tell: tell,
      xingbie: xingbie,
      region: region,
      tximg: tximg
    }
    if (tximg != "" && tximg != null) {
      if (name != "" && name != null) {
        if (tell != "" && tell != null) {
          if (tell.length == 11) {
            if (old != null && old != "") {
              if (xiangxidizhi != null && xiangxidizhi != "") {
                if (yanzminput == yanzmnumber && yanzminput.length == 6) {
                wx.navigateTo({
                  url: '../addshejishi2/addshejishi2',
                  success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', { jibeng: jibeng })
                  }
                })
              } else {
                wx.showToast({
                  title: '请输入正确验证码',
                  icon: 'none',
                  duration: 1000
                })
              }
              } else {
                wx.showToast({
                  title: '请填写详细地址',
                  icon: 'none',
                  duration: 1000
                })
              }
            } else {
              wx.showToast({
                title: '请填写工龄',
                icon: 'none',
                duration: 1000
              })
            }
          } else {
            wx.showToast({
              title: '请填写正确的电话',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          wx.showToast({
            title: '请填写电话',
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
    } else {
      wx.showToast({
        title: '请添加头像',
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
  /* 手机验证码 */
  tell(e) {
    this.setData({
      tellinput: e.detail.value
    })
  },
  yanzma(e) {
    if (this.data.tellinput.length == 11) {
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
          }
          , 1000)
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
      console.log('yes' + smscode + '-' + mobile)
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
  }
})