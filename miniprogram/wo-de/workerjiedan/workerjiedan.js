const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    dingdan: [{
      name: "未接单",
    },
    {
      name: "已接单",
    },
    {
      name: "已完成",
    }],
    yuyue: [],
    yuyuenumber:null,
    worker_id:null,
    TabCur: 0,
    scrollLeft: 0
  },
  onLoad(e) {
    this.shuaxin()
  },
  onShow(e) {
    this.shuaxin()
  },
  shuaxin(e){
    var self = this
    db.collection('yuyue').where({
      workerid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function (res) {
        console.log(res.data)
        self.setData({
          yuyue: res.data
        })
        console.log(self.data.yuyue)
      }
    })
    db.collection('worker').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function (ress) {
        console.log(ress.data)
        self.setData({
          yuyuenumber: ress.data[0].yuyuenumber,
          worker_id: ress.data[0]._id
        })
        console.log(self.data.yuyue)
      }
    })
  },
  chakan(e) {
    var yuyuenumber = this.data.yuyuenumber
    var workerid = this.data.worker_id
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: 'chakan/chakan?title=' + e.currentTarget.id + '&workerid=' + workerid + '&yuyuenumber=' + yuyuenumber,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    console.log(this.data.TabCur)
  }
})