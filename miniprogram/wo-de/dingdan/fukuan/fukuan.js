const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
  },

  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
  },
  wancheng(e){
    var id = this.data.id
     db.collection('yuyue').doc(id).update({
      data: {
        fukuan: 50,
        time1: new Date().getFullYear() + '-' + parseInt(new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
      },
       success: res => {
         wx.showToast({
           title: '付款成功',
         });
         setTimeout(function () {
           wx.navigateBack({
             url: '../../dingdan/dingdan'
           })
         }, 1500)
       },
      fail: console.error
    }) 
  }

})