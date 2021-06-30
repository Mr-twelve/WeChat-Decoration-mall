const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    db.collection('worker').where({
      _openid: options.openid
    }).get({
      success: function (res) {
        worker:res.data[0]
      }
    })
    db.collection('viedo').where({
      _openid: options.openid
    }).get({
      success: function (res) {
        self.setData({
          viedo:res.data
        })
        console.log(res.data)
      }
    })
  },

})