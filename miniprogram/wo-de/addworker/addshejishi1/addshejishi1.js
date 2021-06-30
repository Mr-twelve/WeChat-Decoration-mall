const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
                wx.navigateTo({
                  url: '../addshejishi2/addshejishi2',
                  success: function (res) {
                    // 通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', { jibeng: jibeng })
                  }
                })
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
})