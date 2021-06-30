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
    yuyuenumber: null,
    worker_id: null,
    TabCur: 0,
    scrollLeft: 0
  },
  onLoad(e) {
    /* wx.showLoading({
      title: '加载中...',
    }) */
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.shuaxin()
        db.collection('worker').where({
          _openid: res.result.openid // 填入当前用户 openid
        }).get({
          success: function (res) {
            if (res.data.length != 0) {
              
            } else {
              wx.navigateTo({
                url: 'addworker/addworker',
                success: function(res) {},
                fail: function(res) {},
                complete: function(res) {},
              })
            }
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  onShow(e) {
      this.shuaxin()
  },
  shuaxin(e) {
    var self = this
    db.collection('yuyue').where({
      workerid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function (res) {
        self.setData({
          yuyue: res.data
        })
      }
    })
    db.collection('worker').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success: function (ress) {
        self.setData({
          yuyuenumber: ress.data[0].yuyuenumber,
          worker_id: ress.data[0]._id
        })
      }
    })
    wx.hideLoading()
  },
  chakan(e) {
    var yuyuenumber = this.data.yuyuenumber
    var workerid = this.data.worker_id
    wx.navigateTo({
      url: 'chakan/chakan?title=' + e.currentTarget.id + '&workerid=' + workerid + '&yuyuenumber=' + yuyuenumber,
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  user(e) {
    wx.redirectTo({
      url: 'geren/geren',
    })
  }
})
