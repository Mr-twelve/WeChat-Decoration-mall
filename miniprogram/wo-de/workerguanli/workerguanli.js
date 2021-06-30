const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    a: 0,
    show:false,
    worker:[],
    TabCur: 0,
    scrollLeft: 0,
    dingdan: [{
      name: "待审核",
    },
    {
      name: "已审核",
    }],
  },

  onLoad: function (options) {

  },
  onShow(e){
    this.setData({
      a: 0,
      show: false,
      worker: [],
    })
    this.getworker()
  },
  getworker(e){
    var self = this
    var aa = this.data.a
    db.collection('worker').where({})
      .skip(aa)
      .limit(20)
      .get({
        success: function (res) {
          console.log(res.data)
          self.setData({
            a: aa + 20,
            worker: self.data.worker.concat(res.data)
          })
        },
        fail: console.error
      })
  },
  xiangqing(e){
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: 'xiangqing/xiangqing?title=' + e.currentTarget.id,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
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
  gongjiachakan(e) {

    var id = e.currentTarget.id
    console.log(id)
     wx.navigateTo({
      url: '../../workerprice/workerprice?id=' + id,
    }) 
  },
  onPullDownRefresh: function () {
    console.log('下拉')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.onShow()
  },
  onReachBottom: function () {
    console.log('上拉')
    var worker = this.data.worker.length
    var aa = this.data.a
    console.log(worker)
    console.log(aa)
    if (worker == aa) {
      this.getworker()
    }
  }

})