const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    shoucang: false,
    twoImageSize: null,
    threeImageSize: null,
    TabCur: 0,
    scrollLeft: 0,
    tab: ["工人详情", "用户评价"],
    isCalendarShow: false,
    pingjia: null,
    calendarMark: [],
    name: null,
    showDialog: false,
    worker: [],
    id: null,
  },
  onLoad: function (options) {
    var self = this
    const openid = app.globalData.openid
    db.collection('worker').doc(options.id).get({
      success: function (res) {
        console.log(res.data)
        db.collection('yuyue-tishi').doc('1e1b3423-601d-458b-92b9-4333ec0b6b29').get({
          success: function (take) {
            console.log(res.data.workprice)
            self.setData({
              ticheng: take.data.ticheng,
              pingjia: res.data.userspeak,
              calendarMark: res.data.worktime,
              name: res.data.work,
              worker: res.data,
              id: res.data._id
            })
          }
        })
      },
    })
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const weiboWidth = windowWidth - 40;
    const twoImageSize = (weiboWidth - 2.5) / 2;
    const threeImageSize = (weiboWidth - 2.5 * 2) / 3;
    this.setData({
      twoImageSize: twoImageSize,
      threeImageSize: threeImageSize
    })
  },

  /**
   * 显示日历栏
   */
  onOpenCalendar() {
    this.setData({
      isCalendarShow: true
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  go(e){
    console.log(e)
     wx.navigateTo({
      url: '../../../home/buyworker/xiangqing/xiangqing?title=' + this.data.id + '&name=' + e.currentTarget.id,
    }) 
  }
})