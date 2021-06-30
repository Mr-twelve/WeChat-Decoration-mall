const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({
  data: {
    a:0,
    slider: 5,//星星
    isCalendarShow: false,
    calendarMark: [],
    name:null,
    worker:[],
  },

  onLoad(res) {
    this.getworker(res.take)
  },
  getworker(e){
    var aa=this.data.a
    var self = this
    var name=e
    console.log(name)
    db.collection('worker').where({
      work:name,
      worker: true
    }).skip(aa)
      .limit(20)
      .get({
        success(e) {
          console.log(e)
          self.setData({
            a:aa+20,
            name: name,
            worker: self.data.worker.concat(e.data)
          })
        },
        fail: console.error
      })
  },
  xiangqing(e) {
    console.log(this.data.name)
    wx.navigateTo({
      url: 'xiangqing/xiangqing?title=' + e.currentTarget.id + '&name=' + this.data.name,
    })
  },
  onOpenCalendar(e) {
    var self=this
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
  onReachBottom: function () {
    console.log('上拉')
    var name=this.data.name
    var worker = this.data.worker.length
    var aa = this.data.a
    console.log(worker)
    console.log(aa)
    if (worker == aa) {
      this.getworker(name)
    }
  }
})