const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    onLoad:false,
    a: 0,
    TabCur: 0,
    MainCur: 0, //右边列表编号，置顶渲染
    TopCur: 0, //左边导航栏编号，渲染
    Topnum: 0,
    i: 0,
    goods: [],
    dataindex: 0,
    list0: app.globalData.list0,
    list1: app.globalData.list1,
    load: true,
    screenHeight: app.globalData.screenHeight
  },
onShow(){
  var self = this
  wx.showLoading({
    title: '加载中...',
    mask: true
  });
  this.setData({
    goods: [],
    a:0,
  })
  self.gettximgid()
},
  onLoad() {

  },

  gettximgid(e) {
    var aa = this.data.a
    db.collection('goods').where({
        index: this.data.dataindex
      }).field({
        huodonghave:true,
        huodong:true,
        shangpuname: true,
        shangpulocation: true,
        shangpuid: true,
        index: true,
        tximage: true,
        name: true,
        price: true,
      })
      .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(20) // 限制返回数量为 10 条
      .get()
      .then(res => {
        this.setData({
          a: aa + 20,
          goods: this.data.goods.concat(res.data)
        })
        wx.hideLoading()
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
      .catch(err => {
        console.error(err)
      })
  },
  tabSelect(e) {
    this.setData({
      a: 0,
      goods: [],
      dataindex: parseInt(e.currentTarget.dataset.id),
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
    }, () => {
      this.gettximgid()
    })
  },
  ingoods(e) {
    console.log(e)
    wx.navigateTo({
      url: 'goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  text(e) {

    console.log('this', this.data.index)

  },


  onPullDownRefresh: function() {
    console.log('下拉')
    this.setData({
      goods: [],
      a: 0,
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
      this.gettximgid()
  },
  onReachBottom: function () {
    console.log('上拉')
    var goods = this.data.goods.length
    var aa = this.data.a
    console.log(goods)
    console.log(aa)
    if (goods == aa) {
      this.gettximgid()
    }
  }
})