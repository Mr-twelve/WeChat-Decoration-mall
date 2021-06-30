const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    a:0,
    goods:[],
    shangpuid:null,
    shangpu:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shangpuid:options.id
    })
    this.shuaxin()
  },
  shuaxin(e){
    var self=this
    var shangpuid = self.data.shangpuid
    db.collection('shangpu').doc(shangpuid).get({
      success: function (res) {
        self.setData({
          shangpu:res.data,
          a: 0,
          goods: [],
        })
      }
    })
    self.getgoods()
    
  },
  getgoods(e){
    var self = this
    var shangpuid = self.data.shangpuid
    var aa = this.data.a
    db.collection('goods').where({
      shangpuid: shangpuid
    }).skip(aa)
      .limit(20)
      .get({
        success: function (res) {
          self.setData({
            a: aa + 20,
            goods: self.data.goods.concat(res.data)
          })
        }
      })
  },
  ingoods(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../buy/goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  onPullDownRefresh: function () {
    console.log('下拉')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.shuaxin()
  },
  onReachBottom: function () {
    console.log('上拉')
    var goods = this.data.goods.length
    var aa = this.data.a
    console.log(goods)
    console.log(aa)
    if (goods == aa) {
      this.getgoods()
    }
  }
})