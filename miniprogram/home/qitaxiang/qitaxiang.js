const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    a: 0,
    slider: 5,//星星
    isCalendarShow: false,
    calendarMark: [],
    name: '美缝',
    worker: [],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    list: [{
      name: '美缝',
      id: 0
    }, {
        name: '封阳台',
        id: 1
      }, {
        name: '开荒打扫',
        id: 2
      }, {
        name: '验房师',
        id: 3
      }],
    load: true
  },
  onLoad() {
    this.getworker()
  },
  onReady() {
    
  },
  getworker(e){
    var aa = this.data.a
    var self=this
    var name = this.data.name
    db.collection('worker').where({
      work: name,
      worker: true
    }).skip(aa) 
      .limit(20) 
      .get({
      success: function (res) {
        self.setData({
          a: aa + 20,
          worker:res.data
        })
        console.log(res.data)
      }
    })
  },
  tabSelect(e) {
    this.setData({
      a:0,
      worker:[],
      name: e.currentTarget.id,
      TabCur: e.currentTarget.dataset.id,
    })
    this.getworker()
  },
  goxiangqin(e){
    console.log(e.currentTarget.id)
    console.log(this.data.name)
    wx.navigateTo({
      url: 'xiangqing/xiangqing?title=' + e.currentTarget.id + '&name=' + this.data.name,
    })
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