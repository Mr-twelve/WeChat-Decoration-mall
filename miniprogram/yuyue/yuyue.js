import {
  getUUID,
  getExt
} from "../share/utils/utils.js";
const app = getApp()
const db = wx.cloud.database()


Page({
  data: {
    showxiaodingdan: false,
    xiaodingdanprice: null,
    xiaodingdan: null,
    ifxiaodingdan: false,
    fuwsm: false,
    tabpage: 1,
    region: ['北京市', '北京市', '东城区'],
    workeropenid: null,
    workeryuyuenumber: null,
    location: "",
    workerid: null,
    yuyuename: null,
    checked: '先生',
    imgList: [],
    address: ''
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      ticheng: options.ticheng,
      yuyuename: options.stylename,
      workerid: options.id,
    })
    var self = this
    db.collection('worker').doc(options.id).get({
      success: function(res) {
        self.setData({
          workprice: res.data.workprice,
          workeryuyuenumber: res.data.yuyuenumber + 1,
          workeropenid: res.data._openid,
        })
        db.collection('user').where({
            _openid: app.globalData.openid
          })
          .get({
            success: function(e) {
              if (e.data[0].shouhuodizhi.length != 0) {
                console.log(res.data.workprice)
                self.setData({
                  have: true,
                  region: e.data[0].shouhuodizhi[0].region
                })
              }
            }
          })
      }
    })
  },
  onShow(e) {
    var self = this
    db.collection('yuyue-tishi').doc("d01d29b0-9609-44fa-9fbc-2690028aa3b1").get({
      success: function(res) {
        console.log(res.data)
        self.setData({
          xiaodingdanprice: res.data.xiaodingdanprice,
          xiaodingdan: res.data.xiaodingdan
        })
      }
    })
  },
  RegionChange: function(e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },

  formSubmit(e) {
    var self = this
    console.log(e.detail.value)
    var noknow = this.data.noknow
    const totalprice = self.data.totalprice
    const sumhaveprice = self.data.sumhaveprice
    const sumnoprice = self.data.sumnoprice
    const ticheng = self.data.ticheng
    const yuyuename = self.data.yuyuename
    const workeropenid = self.data.workeropenid
    const workerid = self.data.workerid
    const workeryuyuenumber = self.data.workeryuyuenumber
    const location = self.data.region
    const simple = e.detail.value.simple
    const message = e.detail.value.message
    const xxlocation = e.detail.value.location
    const name = e.detail.value.name
    const tell = e.detail.value.tell
    const xinbie = self.data.checked
    const imgList = self.data.imgList
    const fileIDList = [];

    if (xxlocation != "" && xxlocation != []) {
      if (name != "" && name != []) {
        if (tell != "" && tell != []) {
          if (tell.length == 11) {
            if (simple != "" && simple != []) {
              if (imgList != [] && imgList != "" && imgList != null) {
                /*  if (message != "" && message != []) { */
                if (e.detail.value.radiogroup.length == 1) {
                  wx.showLoading({
                    title: '预约发布中...',
                  })
                  self.data.imgList.forEach((value, index) => {
                    const cloudPath = self.getCloudPath(value);
                    wx.cloud.uploadFile({
                      filePath: value,
                      cloudPath: cloudPath,
                      success: (res) => {
                        fileIDList.push(res.fileID);
                        console.log('file', fileIDList.length)
                        if (fileIDList.length == self.data.imgList.length) {
                          if (noknow == false) {
                            const number = Math.random().toString(36).substr(2, 15).concat(Math.random().toString(36).substr(2, 15))
                            db.collection('yuyue').add({
                              data: {
                                worker_id: workerid,
                                userspeak: [], //订单评价工人
                                speak: 0, //是否订单评价过工人
                                workerid: workeropenid, //工人编号
                                number: number, //预约编号
                                fukuan: 1, //付款1为付款1元定价50为50%开工，80为80%开工50%，100为完成
                                jindu: 0, //进度1为付款1元，50为完成50%，100为完工
                                time: new Date().getFullYear() + '-' + parseInt(new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                                ticheng: ticheng,
                                ifqitaxiang: false,
                                qitaxiangprice: null,
                                totalprice: totalprice, //价格详情表数组
                                sumhaveprice: sumhaveprice, //抽取价格
                                sumnoprice: sumnoprice, //原价
                                time1: null, //开工时间
                                time2: null, //完成时间
                                title: yuyuename, //服务类型
                                location: location, //定位
                                xxlocation: xxlocation, //详细地址
                                name: name, //用户名字
                                tell: tell, //用户电话
                                xinbie: xinbie, //用户性别
                                simple: simple, //工程简述
                                message: message, //备注工程详细说明
                                imgList: fileIDList, //图片
                                workerquxiao: null //工人取消后备注
                              },
                              success: function (ress) {
                                //加入工人数据库
                                wx.cloud.callFunction({
                                  name: 'yuyue-add-worker',
                                  data: {
                                    workerid: workerid,
                                    number: workeryuyuenumber
                                  },
                                  success: res => {
                                    wx.showToast({
                                      title: '预约发布成功',
                                    });
                                    setTimeout(function () {
                                      wx.redirectTo({
                                        url: '../wo-de/dingdan/dingdan'
                                      })
                                    }, 1500)
                                  },
                                  fail: err => {
                                    console.error('[云函数] [login] 调用失败', err)
                                  }
                                })
                              },
                              fail: console.error,
                              complete(e) { }
                            })
                          } else {
                            const number = Math.random().toString(36).substr(2, 15).concat(Math.random().toString(36).substr(2, 15))
                            db.collection('yuyue').add({
                              data: {
                                worker_id: workerid,
                                userspeak: [], //订单评价工人
                                speak: 0, //是否订单评价过工人
                                workerid: workeropenid, //工人编号
                                number: number, //预约编号
                                fukuan: 1, //付款1为付款1元定价50为50%开工，80为80%开工50%，100为完成
                                jindu: 0, //进度1为付款1元，50为完成50%，100为完工
                                time: new Date().getFullYear() + '-' + parseInt(new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                                ticheng: ticheng,
                                ifqitaxiang: false,
                                qitaxiangprice: null,
                                totalprice: '未测量将以实际施工为标准并附加300订金', //价格详情表数组
                                sumhaveprice: null, //抽取价格
                                sumnoprice: null, //原价
                                time1: null, //开工时间
                                time2: null, //完成时间
                                title: yuyuename, //服务类型
                                location: location, //定位
                                xxlocation: xxlocation, //详细地址
                                name: name, //用户名字
                                tell: tell, //用户电话
                                xinbie: xinbie, //用户性别
                                simple: simple, //工程简述
                                message: message, //备注工程详细说明
                                imgList: fileIDList, //图片
                                workerquxiao: null //工人取消后备注
                              },
                              success: function (ress) {
                                //加入工人数据库
                                wx.cloud.callFunction({
                                  name: 'yuyue-add-worker',
                                  data: {
                                    workerid: workerid,
                                    number: workeryuyuenumber
                                  },
                                  success: res => {
                                    wx.showToast({
                                      title: '预约发布成功',
                                    });
                                    setTimeout(function () {
                                      wx.redirectTo({
                                        url: '../wo-de/dingdan/dingdan'
                                      })
                                    }, 1500)
                                  },
                                  fail: err => {
                                    console.error('[云函数] [login] 调用失败', err)
                                  }
                                })
                              },
                              fail: console.error,
                              complete(e) { }
                            })
                          }
                        }
                      }
                    })
                  });

                } else {
                  wx.showToast({
                    title: '请阅读服务声明并同意',
                    icon: 'none',
                    duration: 1000
                  })
                }
                /* } else {
                  wx.showToast({
                    title: '请填写备注',
                    icon: 'none',
                    duration: 1000,
                    mask: true,
                  })
                } */
              } else {
                wx.showToast({
                  title: '请上传相关图片',
                  icon: 'none',
                  duration: 1000,
                  mask: true,
                })
              }
            } else {
              wx.showToast({
                title: '请填写工程简述',
                icon: 'none',
                duration: 1000,
                mask: true,
              })
            }
          } else {
            wx.showToast({
              title: '请填写正确的电话',
              icon: 'none',
              duration: 1000,
              mask: true,
            })
          }
        } else {
          wx.showToast({
            title: '请填写联系人电话',
            icon: 'none',
            duration: 1000,
            mask: true,
          })
        }
      } else {
        wx.showToast({
          title: '请填写联系人姓名',
          icon: 'none',
          duration: 1000,
          mask: true,
        })
      }
    } else {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }
  },


  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  checked0(e) {
    this.setData({
      checked: '先生'
    })
  },
  checked1(e) {
    this.setData({
      checked: '女士'
    })
  },
  /* 打开位置页面 */
  openLocationPage: function() {
    const that = this;
    wx.chooseLocation({
      success: res => {
        if (res.name) {
          delete res["errMsg"];
          that.setData({
            location: res
          })
        }
      }
    })
  },

  /* 获取位置信息的事件 */
  onLocationTap: function(event) {
    const that = this; /* 使用到that的地方必须定义that */
    wx.getSetting({
      success: res => {
        const isLocation = res.authSetting['scope.userLocation'];
        /* console.log(isLocation) */
        if (isLocation) {
          that.openLocationPage();
        } else {
          wx.authorize({
            scope: "scope.userLocation",
            success: (res) => {
              that.openLocationPage();
            }
          });
        }
      }
    })
  },
  getCloudPath: function(fileName) {
    const tody = new Date();
    const year = tody.getFullYear();
    const month = tody.getMonth() + 1;
    const day = tody.getDate();
    const cloudPath = "yuyue/" + year + "/" + month + "/" + day + "/" + getUUID() + "." + getExt(fileName);
    return cloudPath;
  },

  text(e) {

  },
  celiang(e) {
    /* this.setData({
      tabpage: 0
    }) */
  },
  gongjia(e) {
    var xiaodingdan = this.data.xiaodingdan
    console.log(xiaodingdan)
    var ticheng = this.data.ticheng
    var workprice = this.data.workprice
    var gongjia = e.detail.value
    var length = Object.keys(gongjia).length;
    var kuong = false
    var totalprice = []
    var sumhaveprice = 0 //提成的钱
    var sumnoprice = 0 //为提成的
    Object.entries(gongjia).forEach(([key, value], index) => {
      Object.entries(workprice).forEach(([key2, price], index2) => {
        if (key == key2) {
          console.log('11--[' + value + ']')
          console.log('22--[' + xiaodingdan[key] + ']')
          var xiaodindanvalue = xiaodingdan[key]
          if (parseInt(value) < parseInt(xiaodindanvalue)) {
            console.log(key + "小定单")
            this.setData({
              ifxiaodingdan: true,
            })
            var newprice = {
              ifxiaodingdan: true,
              name: key,
              celiang: value,
              price: ((price * (0.01 * ticheng)).toFixed(2)),
              price2: price,
              price3: ((price * (0.01 * ticheng + 1)).toFixed(2))
            }
            totalprice.push(newprice)
            sumhaveprice += ((price * (0.01 * ticheng)).toFixed(2)) * value
            sumnoprice += price * value
          } else {
            var newprice = {
              ifxiaodingdan: false,
              name: key,
              celiang: value,
              price: ((price * (0.01 * ticheng)).toFixed(2)),
              price2: price,
              price3: ((price * (0.01 * ticheng + 1)).toFixed(2))
            }
            totalprice.push(newprice)
            sumhaveprice += ((price * (0.01 * ticheng)).toFixed(2)) * value
            sumnoprice += price * value
          }
        }
      })
      if (value == '') {
        kuong = true
      }
      if (length == index + 1) {
        if (kuong == true) {
          wx.showToast({
            title: '请填所有的价格项',
            icon: 'none',
            duration: 1000
          })
        }
        if (kuong == false) {
          this.setData({
            noknow: false,
            totalprice: totalprice,
            sumhaveprice: sumhaveprice,
            sumnoprice: sumnoprice,
            tabpage: 0,
          })
        }
      }
    });
    console.log(totalprice)
  },
  fanhui(e) {

  },
  fuwsmfuwsm(e) {
    var self = this
    const db = wx.cloud.database()
    db.collection('yuyue-tishi').doc("966646df-7759-4b0b-8451-2a0211728636").get({
      success: function(res) {
        self.setData({
          fuwusm: res.data,
          fuwsm: true
        })
        console.log(res.data)
      }
    })
  },
  fuwsm(e) {
    this.setData({
      fuwsm: !this.data.fuwsm
    })
  },
  noknow(e) {
    this.setData({
      noknow: true,
      tabpage: 0,
    })
  },
})