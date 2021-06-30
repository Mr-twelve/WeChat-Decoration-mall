Page({

  data: {
    worker:null
  },

  onLoad: function (options) {
    var self=this
    const db = wx.cloud.database()
    db.collection('worker').doc(options.id).get({
      success: function (res) {
        self.setData({
          worker:res.data.workprice
        })
        console.log(self.data.worker)
      }
    })
  },
})