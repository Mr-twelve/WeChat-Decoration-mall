

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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /* bindtap事件 跳转到具体的动画页面 */
  onBindTap1:function(){
    wx.navigateTo({
      url: 'jichurengong/jichurengong',
    })
  },
  onBindTap2: function () {
    wx.navigateTo({
      url: 'shuidiangong/shuidiangong',
    })
  },
  onBindTap3: function () {
    wx.navigateTo({
      url: 'nigong/nigong',
    })
  },
  onBindTap4: function () {
    wx.navigateTo({
      url: 'mugong/mugong',
    })
  },
  onBindTap5: function () {
    wx.navigateTo({
      url: 'youqigong/youqigong',
    })
  }
})