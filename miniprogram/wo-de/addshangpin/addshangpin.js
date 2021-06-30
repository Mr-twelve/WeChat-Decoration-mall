const app = getApp();
const db = wx.cloud.database();
Page({
  data: {
    yanzmnumber: null,
    yanzminput: null,
    btnDisabled: false,
    second: 60,
    yanzm: '发送验证码',
    newdata: true,
    sfzimgz: null,
    sfzimgf: null,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },
  onShow(e) {
    this.shuaxin()
  },
  shuaxin(e) {
    var self = this
    var aa = this.data.a
    db.collection('shangpu').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function(res) {
        console.log(res.data)
        if (res.data.length != 0) {
          self.setData({
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
          db.collection('user').where({
              _openid: app.globalData.openid
            })
            .get({
              success: function(e) {
                if (e.data[0].shouhuodizhi.length != 0) {
                  self.setData({
                    have: false,
                    region: e.data[0].shouhuodizhi[0].region
                  })
                }
              }
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
    var yanzmnumber = this.data.yanzmnumber
    var yanzminput = this.data.yanzminput
    var shangpuname = e.detail.value.shangpuname
    var name = e.detail.value.name
    var tell = e.detail.value.tell
    var xingbie = this.data.xingbie
    var region = this.data.region
    var tximg = this.data.imgList
    var yyzzimg = this.data.sfzimgz
    var jyxkzimg = this.data.sfzimgf
    if (tximg != "") {
      if (shangpuname != "") {
        if (name != "") {
          if (tell.length == 11) {
            if (yyzzimg != null) {
              if (jyxkzimg != null) {
                if (jyxkzimg != null) {
                  if (yanzminput == yanzmnumber && yanzminput.length == 6) {
                    wx.showLoading({
                      title: '认证发布中...',
                      mask: true
                    })
                    const cloudPath = "shangpu/" + shangpuname + "/" + shangpuname + ".jpg";
                    const yyzzimgcloudPath = "shangpu/" + shangpuname + "/" + '营业执照' + shangpuname + ".jpg";
                    const jyxkzimgcloudPath = "shangpu/" + shangpuname + "/" + '经营许可证' + shangpuname + ".jpg";
                    wx.cloud.uploadFile({
                      cloudPath: cloudPath,
                      filePath: tximg[0], // 文件路径
                      success: res => {
                        var img = res.fileID
                        wx.cloud.uploadFile({
                          cloudPath: yyzzimgcloudPath,
                          filePath: yyzzimg[0], // 文件路径
                          success: res => {
                            var imgyyzz = res.fileID
                            wx.cloud.uploadFile({
                              cloudPath: jyxkzimgcloudPath,
                              filePath: jyxkzimg[0], // 文件路径
                              success: res => {
                                var imgjyxkz = res.fileID


                                db.collection('shangpu').add({
                                  data: {
                                    date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                                    shangpuname: shangpuname,
                                    name: name,
                                    tell: tell,
                                    xingbie: xingbie,
                                    region: region,
                                    tximg: img,
                                    imgyyzz: imgyyzz, //营业执照
                                    imgjyxkz: imgjyxkz, //经营许可证

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
                                          wx.redirectTo({
                                            url: '../../shangjia/shangjia'
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
                          },
                          fail: err => {}
                        })
                      },
                      fail: err => {}
                    })
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
                  title: '请上传经营许可证',
                  icon: 'none',
                  duration: 1000
                })
              }
            } else {
              wx.showToast({
                title: '请上传营业执照',
                icon: 'none',
                duration: 1000
              })
            }
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
      urls: e.currentTarget.dataset.url
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
      url: '../add/add?shangpuid=' + id + '&&shangpuname=' + shangpuname + '&&shangpulocation=' + shangpulocation,
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
    this.setData({
      id: id,
      goodsgengduo: !this.data.goodsgengduo
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
      content: '确定下架该商品？',
      success(res) {
        if (res.confirm) {
          db.collection('goods').doc(id).remove({
            success(res) {
              self.shuaxin()
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
                  wx.switchTab({
                    url: '../../wo-de/wo-de',
                  })
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
  ChooseImagesfzimgz(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          sfzimgz: res.tempFilePaths
        })
      }
    });
  },
  ChooseImagesfzimgf(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          sfzimgf: res.tempFilePaths
        })
      }
    });
  },
  DelImgsfzimgz(e) {
    this.setData({
      sfzimgz: null
    })
  },
  DelImgsfzimgf(e) {
    this.setData({
      sfzimgf: null
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
  quxiaoptuan(e) {
    var self = this
    var id = this.data.id
    db.collection('goods').doc(id).update({
      data: {
        huodonghave: false,
        huodong: null
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
  }
})