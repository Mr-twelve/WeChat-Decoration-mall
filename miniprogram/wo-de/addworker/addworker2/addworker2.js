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
        value: '墙固',
        name: '墙固',
        checked: false,
      }, {
        value: '地固',
        name: '地固',
        checked: false,
      }, {
        value: '地面保护',
        name: '地面保护',
        checked: false,
      }, {
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
      }, {
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
    /* this.work() */
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    var work=[]
    items[values].checked = !items[values].checked;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].checked==true){
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
    console.log(txcloudPath)
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
                              number: Math.random().toString(36).substr(2, 15).concat(Math.random().toString(36).substr(2, 15)),
                              tximg: tximgid, //头像
                              name: jibeng.name, //名字
                              old: jibeng.old, //年龄
                              tell: jibeng.tell, //电话
                              xingbie: jibeng.xingbie, //性别
                              region: jibeng.region, //位置
                              xiangxidizhi: jibeng.xiangxidizhi, //详细位置

                              quxiao: false, //是否被取消认证
                              worker: false, //是否认证成功
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
                              kouhao: kouhao, //口号
                              work: work, //工种 
                              workerjinenglook: fileIDList, //计能展示
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
                                      url: '../../../wo-de/wo-de'
                                    })
                                  } else if (res.cancel) {
                                    console.log('用户点击取消')
                                  }
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
    /* console.log(length) */
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
  }
})