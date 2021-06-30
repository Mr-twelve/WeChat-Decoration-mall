const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a: 0,
    worker: [],
    goods: [],
    saomang: [],
    sousuoname: '综合',
    sousuolist: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  /*   sousuo(e) {
      console.log(e.detail.value)
      this.setData({
        value: e.detail.value
      })
      this.getsousuoxxx()
    }, */
  formSubmit(e) {
    this.setData({
      a: 0,
      worker: [],
      goods: [],
      saomang: [],
      value: e.detail.value.sousuoname
    })
    this.getsousuoxxx()
  },
  getsousuoxxx(e) {
    var name = this.data.sousuoname
    if (name == '综合') {
      this.getzh()
    }
    if (name == '工匠') {
      this.getgr()
    }
    if (name == '商品') {
      this.getsp()
    }
    if (name == '文章') {
      this.getwz()
    }
  },
  getzh(e) {
    this.getgr()
    this.getsp()
    this.getwz()
  },
  getgr(e) {
    var input = this.data.value
    if (input != '') {
      console.log(input)
      const db = wx.cloud.database()
      var that = this
      var aa = this.data.a
      db.collection('worker').where({
          name: db.RegExp({
            regexp: input,
            options: 'ims',
          })
        })
        .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(20) // 限制返回数量为 10 条
        .get({
          success: res => {
            console.log(res)
            that.setData({
              goods: [],
              saomang: [],
              worker: this.data.worker.concat(res.data),
              a: aa + 20,
            })
          }
        })
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新}
    }
  },
  getsp(e) {
    var input = this.data.value
    if (input != '') {
      const db = wx.cloud.database()
      var that = this
      var aa = this.data.a
      db.collection('goods').where({
          name: db.RegExp({
            regexp: input,
            options: 'ims',
          })
        })
        .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(20) // 限制返回数量为 10 条
        .get({
          success: res => {
            console.log(res)
            that.setData({
              worker: [],
              saomang: [],
              goods: this.data.goods.concat(res.data),
              a: aa + 20,
            })
          }
        })
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新 }
    }
  },
  getwz(e) {
    var input = this.data.value
    if (input != '') {
      const db = wx.cloud.database()
      var that = this
      var aa = this.data.a
      db.collection('saomang').where({
          title: db.RegExp({
            regexp: input,
            options: 'ims',
          })
        })
        .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(20) // 限制返回数量为 10 条
        .get({
          success: res => {
            console.log(res)
            that.setData({
              worker: [],
              goods: [],
              saomang: this.data.saomang.concat(res.data),
              a: aa + 20,
            })
          }
        })
      wx.hideLoading()
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  },
  sousuolist(e) {
    this.setData({
      sousuolist: !this.data.sousuolist
    })
  },
  sousuozh(e) {
    this.setData({
      a: 0,
      worker: [],
      goods: [],
      saomang: [],
      sousuoname: '综合',
      sousuolist: false
    })
  },
  sousuogr(e) {
    this.setData({
      a: 0,
      worker: [],
      goods: [],
      saomang: [],
      sousuoname: '工匠',
      sousuolist: false
    })
  },
  sousuosp(e) {
    this.setData({
      a: 0,
      worker: [],
      goods: [],
      saomang: [],
      sousuoname: '商品',
      sousuolist: false
    })
  },
  sousuowz(e) {
    this.setData({
      a: 0,
      worker: [],
      goods: [],
      saomang: [],
      sousuoname: '文章',
      sousuolist: false
    })
  },
  onPullDownRefresh: function() {
    console.log('下拉')
    this.setData({
      worker: [],
      goods: [],
      saomang: [],
      a: 0,
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getsousuoxxx()
  },
  onReachBottom: function() {
    console.log('上拉')
    var worker = this.data.worker.length
    var goods = this.data.goods.length
    var saomang = this.data.saomang.length
    var aa = this.data.a
    console.log(aa)
    if (worker == aa || goods == aa || saomang == aa) {
      this.getsousuoxxx()
    }
  },

  gosaomang1(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../saomang/saomang1/saomang1?id=' + id,
    })
  },
  ingoods(e) {
    console.log(e)
    wx.navigateTo({
      url: '../buy/goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  xiangqing(e) {
    console.log(this.data.name)
    wx.navigateTo({
      url: '../home/buyworker/xiangqing/xiangqing?title=' + e.currentTarget.id + '&name=' + this.data.name,
    })
  },

})