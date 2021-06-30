import {
  getUUID,
  getExt
} from "../../../share/utils/utils.js";
const app = getApp()
const db = wx.cloud.database()
const self=this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gongjiachakan:false,
    imgList: [],
    region: ['北京市', '北京市', '东城区'],
    shezhiname: false,
    shezhitell: false,
    shezhikouhao: false,
    shezhifuwufanwei: false,
    shezhitp: false,

    shezhi: false,
    index: 2,
    showDialog: false,
    isCalendarShow: false, //日历显示
    calendarMark: [], //日历内容
    showDialog: false,
    have: false,
    worker: [],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.shuaxin()
  },
  shuaxin(e){
    var self = this
    db.collection('worker').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function (res) {
        console.log(res.data)
        if (res.data.length != 0) {
          self.setData({
            imgList: [],
            region: ['北京市', '北京市', '东城区'],
            shezhiname: false,
            shezhitell: false,
            shezhikouhao: false,
            shezhifuwufanwei: false,
            shezhitp: false,

            shezhi: false,
            index: 2,
            showDialog: false,
            isCalendarShow: false, //日历显示
            showDialog: false,
            //////////////////////////////////////////////
            calendarMark: res.data[0].worktime,
            have: true,
            worker: res.data[0],
            id: res.data[0]._id
          })
          console.log(self.data.worker.tximg)
        }else{
          self.setData({
            imgList: [],
            region: ['北京市', '北京市', '东城区'],
            shezhiname: false,
            shezhitell: false,
            shezhikouhao: false,
            shezhifuwufanwei: false,
            shezhitp: false,

            shezhi: false,
            index: 2,
            showDialog: false,
            isCalendarShow: false, //日历显示
            showDialog: false,
            //////////////////////////////////////////////
            calendarMark: [], //日历内容
            have: false,
            worker: [],
            id: ''
          })
          console.log(self.data.worker.tximg)
        }
      }
    })
  },
  quxiao(e) {
    var self = this
    wx.showModal({
      title: '提示',
      content: '取消申请后可重新发布申请详细',
      success(res) {
        if (res.confirm) {
          db.collection('worker').doc(self.data.id).remove({
            success(res) {
              self.shuaxin()
            },
            fail: console.error
          })
        } else if (res.cancel) {}
      }
    })
  },
  quxiao2(e) {
    var self = this
    db.collection('worker').doc(self.data.id).remove({
      success(res) {
        self.shuaxin()
      },
      fail: console.error
    })
  },

  add(e) {
    wx.navigateTo({
      url: '../addworker1/addworker1',
    })
  },
  addshejishi(e) {
    wx.navigateTo({
      url: '../addshejishi1/addshejishi1',
    })
  },
  /**
   * 显示日历栏
   */
  setrili() {
    this.setData({
      isCalendarShow: true
    })
  },
  onOpenCalendar(e) {
    var self = this
    var id = e.currentTarget.id
    console.log(e.currentTarget.id)
    db.collection('worker').doc(id).get({
      success: function (res) {
        console.log(res.data)
        self.setData({
          calendarMark: res.data.worktime,
          isCalendarShow: true,
        })
      }
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
    var id = this.data.id
    if (index >= 0) {
      oldcalendarMark.splice(index, 1)
    } else {
      oldcalendarMark.push(calendarMark)
    }
    this.setData({
      calendarMark: oldcalendarMark
    })
    db.collection('worker').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        worktime: oldcalendarMark
      },
      success: console.log,
      fail: console.error
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
  gongjia(e) {
    console.log(e.currentTarget.id)
    this.setData({
      name: e.currentTarget.id,
      showDialog: !this.data.showDialog
    });
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
  quedin(e) {
    var self=this
    var id = this.data.id
    var workprice = e.detail.value
    db.collection('worker').doc(id).update({
      data: {
        workprice: workprice
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
    console.log(this.data.lists)
  },
  shezhi(e) {
    this.setData({
      shezhi: true,
      isCalendarShow: false, //日历显示
    })
  },
  wancheng(e) {
    this.setData({
      shezhi: false,
      isCalendarShow: false, //日历显示
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
  shezhikouhao(e) {
    this.setData({
      shezhikouhao: !this.data.shezhikouhao
    })
  },
  shezhifuwufanwei(e) {
    this.setData({
      shezhifuwufanwei: !this.data.shezhifuwufanwei
    })
  },
  shezhitp(e) {
    this.setData({
      shezhitp: !this.data.shezhitp
    })
  },
  RegionChange: function(e) {
    console.log(e)
    this.setData({
      region: e.detail.value
    })
  },

  shezhiname1(e) {
    var self=this
    console.log(e.detail.value.name)
    var id = this.data.id
    var name = e.detail.value.name
    db.collection('worker').doc(id).update({
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
    db.collection('worker').doc(id).update({
      data: {
        tell: tell
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
  },
  shezhikouhao1(e) {
    var self = this
    console.log(e.detail.value.kouhao)
    var id = this.data.id
    var kouhao = e.detail.value.kouhao
    db.collection('worker').doc(id).update({
      data: {
        kouhao: kouhao
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
  },
  shezhifuwufanwei1(e) {
    var self=this
    var id = this.data.id
    var region = this.data.region
    db.collection('worker').doc(id).update({
      data: {
        region: region
      },
      success(e) {
        self.shuaxin()
      },
      fail: console.error
    })
  },
  shezhitp1(e) {
    wx.showLoading({
      title: '图片上传中',
      mask: true
    })
    var self=this
    var id = this.data.id
    var imgList = this.data.imgList
    var fileIDList = []
    imgList.forEach((value, index) => {
      const cloudPath = "worker/" + "workerjinenglook/" + self.data.worker.name + "/" + index + "-" + getUUID() + ".jpg";
      wx.cloud.uploadFile({
        filePath: value,
        cloudPath: cloudPath,
        success: (res) => {
          fileIDList.push(res.fileID);
          console.log('file', fileIDList)
          if (fileIDList.length == imgList.length) {
            db.collection('worker').doc(id).update({
              data: {
                workerjinenglook: fileIDList
              },
              success(e) {
                wx.hideLoading()
                self.shuaxin()
              },
              fail: console.error
            })
          }
        }
      })
    })
  },
  gongjiachakan(e){
   
    var id = this.data.id
    console.log(id)
   wx.navigateTo({
     url: '../../../workerprice/workerprice?id=' + id,
   })
  }
})