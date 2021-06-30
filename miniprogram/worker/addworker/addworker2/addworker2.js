import {
  getUUID,
  getExt
} from "../../../share/utils/utils.js";
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fuwsm: false,
    Tarbar: 0,
    isCalendarShow: false, //日历显示
    calendarMark: [], //标记日历
    showDialog: false,
    lists: null,
    index: 2,
    jibeng: null,
    imgList: [],
    modalName: null,
    modalName1: null,
    modalName2: null,
    workprice: '',
    worktime: '',
    modalName: null,
    work: [],
    checkbox: [{
        value: '美缝',
        name: '美缝',
        checked: false,
      }, {
        value: '封阳台',
        name: '封阳台',
        checked: false,
      }, {
        value: '开荒打扫',
        name: '开荒打扫',
        checked: false,
      }, 
      {
        value: '验房师',
        name: '验房师',
        checked: false,
      },
      {
        value: '油漆工',
        name: '油漆工',
        checked: false,
      }, {
        value: '木工',
        name: '木工',
        checked: false,
      }, {
        value: '基础工人',
        name: '基础工人',
        checked: false,
      }, {
        value: '泥工',
        name: '泥工',
        checked: false,
      }, {
        value: '水电工',
        name: '水电工',
        checked: false,
      },
      /* {
           value: '设计师',
           name: '设计师',
           checked: false,
         } */
    ],
    txtlist: [
      '欢迎您进行工人认证',
      '请在文字后的输入框中输入您的报价',
      '浅色数字为推荐报价',
      '全部输入完成后点击确定',
      '点击返回之后将不会保存您的报价',
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      self.setData({
        jibeng: data.jibeng
      })
    })
    db.collection('goodsnumber').doc('7594ba71-600e-461f-8394-10f7d241bc64').get({
      success: function (res) {
        self.setData({
          workernumber: res.data.workernumber
        })
      }
    })
  },

  textareaAInput(e) {
    this.setData({
      workprice: e.detail.value
    })
  },
  textareaAInput2(e) {
    this.setData({
      worktime: e.detail.value
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    var work = []
    items[values].checked = !items[values].checked;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].checked == true) {
        console.log(items[i].name)
        work.push(items[i].name)
      }
    }
    console.log(work)
    this.setData({
      lists: null,
      work: work,
      checkbox: items
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 8, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
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

  formSubmit(e) {
    console.log(e)
    if (e.detail.value.radiogroup.length == 1) {
      console.log('no')
    } else {
      console.log('yes')
    }
    var self = this
    const fileIDList = [];
    const txcloudPath = "worker/" + "tximg/" + self.data.jibeng.name + "-" + getUUID() + ".jpg"
    const sfzzcloudPath = "worker/" + "sfzz/" + self.data.jibeng.name + "-" + getUUID() + ".jpg"
    const sfzfcloudPath = "worker/" + "sfzf/" + self.data.jibeng.name + "-" + getUUID() + ".jpg"
    console.log(txcloudPath)
    var workernumber = self.data.workernumber
    var newworkernumber = (parseInt(workernumber) + 1).toString()
    var jibeng = self.data.jibeng
    var kouhao = e.detail.value.kouhao
    var worktime = self.data.calendarMark
    var workprice = self.data.lists
    var work = self.data.work
    var imgList = self.data.imgList.length
    if (kouhao != "" && kouhao != null) {
      if (work != "" && work != []) {
        if (workprice != "" && workprice != null) {
          if (imgList != 0) {
            if (e.detail.value.radiogroup.length == 1) {
              wx.showLoading({
                title: '认证发布中...',
                mask: true
              })
              //头像上传
              wx.cloud.uploadFile({
                cloudPath: txcloudPath,
                filePath: jibeng.tximg[0],
                success: res => {
                  const tximgid = res.fileID
                  console.log('tximgid', tximgid)
                  //身份证正上传
                  wx.cloud.uploadFile({
                    cloudPath: sfzzcloudPath,
                    filePath: jibeng.sfzimgz[0],
                    success: res => {
                      const sfzzimg = res.fileID
                      console.log('tximgid', tximgid)
                      //身份证反上传
                      wx.cloud.uploadFile({
                        cloudPath: sfzfcloudPath,
                        filePath: jibeng.sfzimgf[0],
                        success: res => {
                          const sfzfimg = res.fileID
                          console.log('tximgid', tximgid)


                          //技能展示图片上传
                          self.data.imgList.forEach((value, index) => {
                            const cloudPath = "worker/" + "workerjinenglook/" + self.data.jibeng.name + "/" + index + "-" + getUUID() + ".jpg";
                            wx.cloud.uploadFile({
                              filePath: value,
                              cloudPath: cloudPath,
                              success: (res) => {
                                fileIDList.push(res.fileID);
                                console.log('file', fileIDList)
                                if (fileIDList.length == self.data.imgList.length) {
                                  console.log('up')
                                  db.collection('worker').add({
                                    data: {
                                      date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                                      number: parseInt(workernumber),
                                      tximg: tximgid, //头像
                                      sfzzimg: sfzzimg,//身份证正
                                      sfzfimg: sfzfimg,//身份证反
                                      name: jibeng.name, //名字
                                      old: jibeng.old, //年龄
                                      tell: jibeng.tell, //电话
                                      xingbie: jibeng.xingbie, //性别
                                      region: jibeng.region, //位置
                                      region2: null, //位置
                                      xiangxidizhi: jibeng.xiangxidizhi, //详细位置

                                      quxiao: false, //是否被取消认证
                                      worker: false, //是否认证成功
                                      addworker: true, //是否认证成功
                                      userspeak: [], //用户评价
                                      star: 5,
                                      yuyue: null, //预约订单包含未结单
                                      yuyuenumber: 0, //预约数量
                                      jiedan: null, //已接单
                                      jiedannumber: 0, //接单数量
                                      wancheng: null, //已完成
                                      wanchengnumber: 0, //完成数量
                                      workerstyle: null, //个人风格
                                      workerdengji: null, //工人等级 

                                      worktime: worktime, //时间表
                                      workprice: workprice, //工价
                                      addworkprice:{},
                                      kouhao: kouhao, //口号
                                      work: work, //工种 
                                      addwork: [], //add工种 
                                      workerjinenglook: fileIDList, //计能展示
                                      addworkerjinenglook: [], //计能展示

                                      pintuanpeople:[],
                                      pintuan: false,//拼团
                                      pintuanxiangqin:{},//拼团详情
                                    },
                                    success: function(res) {
                                      wx.cloud.callFunction({
                                        // 要调用的云函数名称
                                        name: 'worker-number',
                                        // 传递给云函数的参数
                                        data: {
                                          workernumber: newworkernumber
                                        },
                                        success: res => {
                                          console.log('成功')
                                          wx.hideLoading()
                                          wx.showModal({
                                            title: '认证提交完成',
                                            content: '请耐心等待审核通过，可到个人页面查看',
                                            showCancel: false,
                                            success(res) {
                                              if (res.confirm) {
                                                wx.reLaunch({
                                                  url: '../../../worker/worker',
                                                })
                                              } else if (res.cancel) {
                                                console.log('用户点击取消')
                                              }
                                            }
                                          })
                                        },
                                        fail: err => {
                                          
                                        },
                                        complete: () => {
                                          
                                        }
                                      })
                                    },
                                    fail: console.error
                                  })
                                }
                              }
                            })
                          });


                        },
                      })
                    },
                  })
                },
              })

            } else {
              wx.showToast({
                title: '请阅读服务声明并同意',
                icon: 'none',
                duration: 1000
              })
            }
          } else {
            wx.showToast({
              title: '请添加技能展示',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          wx.showToast({
            title: '请设置工价',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '请选择个人技能',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '请填写口号',
        icon: 'none',
        duration: 1000
      })
    }





    /*  } else {
       wx.showToast({
         title: '！信息不完整',
         icon: 'none',
         duration: 1000
       })
     } */
  },

  toggleDialog(e) {
    var work = this.data.work
    if (work == "" || work == null) {
      wx.showToast({
        title: '请先选择个人技能',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        Tarbar: 1
      });
    }
  },
  addindex(e) {
    this.setData({
      index: this.data.index + 1
    })
  },
  jieindex(e) {
    this.setData({
      index: this.data.index - 1
    })
  },
  gongjia(e) {
    var gongjia = e.detail.value
    var length = Object.keys(gongjia).length;
    console.log(gongjia)
    var kuong = false
    Object.entries(gongjia).forEach(([key, value], index) => {
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
            isCalendarShow: false,
            Tarbar: 0,
            lists: gongjia
          })
        }
      }
    });
  },
  /**
   * 显示日历栏
   */
  onOpenCalendar() {
    this.setData({
      isCalendarShow: true
    })
  },

  /**
   * 获取选择日期
   */
  onCalendarGetDate(e) {
    console.log('本次选择了:', e.detail.selected);
    var calendarMark = e.detail.selected
    var oldcalendarMark = this.data.calendarMark
    var index = oldcalendarMark.indexOf(calendarMark)
    if (index >= 0) {
      oldcalendarMark.splice(index, 1)
    } else {
      oldcalendarMark.push(calendarMark)
    }
    this.setData({
      calendarMark: oldcalendarMark
    })
  },
  fanhui(e) {
    this.setData({
      Tarbar: 0,
    })
  },
  fuwsm(e) {
    this.setData({
      fuwsm: !this.data.fuwsm
    })
  },
  fuwsmfuwsm(e) {
    var self = this
    const db = wx.cloud.database()
    db.collection('yuyue-tishi').doc("5632f5c8-8afa-4d36-9432-0b067b6ce39a").get({
      success: function(res) {
        self.setData({
          fuwusm: res.data,
          fuwsm: true
        })
        console.log(res.data)
      }
    })
  },
})