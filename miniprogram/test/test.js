const db = wx.cloud.database()
Page({
  data: {
  },
  onLoad(e) {
    const db = wx.cloud.database()
    var self = this
    db.collection('worker').doc('5d262bd45d7348b113faeb2477aee448').get({
      success: function(res) {
        self.setData({
          worker: res.data.workprice
        })
        console.log(res.data.workprice)
      }
    })
  },
})