// miniprogram/shuoming/shuoming.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onBindTap: function () {
    wx.reLaunch({
      url: '../yuyue/yuyue',
      success: function (res) {
        // success
      }
    })
  }
})