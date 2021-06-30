const db = wx.cloud.database()
Page({
  data: {
    a: 0,
    TabCur: 0,
    name: '设计师',
    scrollLeft: 0,
    saomang: [],
    list: ['设计师','入门',  '美缝', '封阳台', '开荒打扫', '油漆工', '木工', '基础工人', '泥工', '水电工',  '其他'],
  },
  onShow(e) {
    this.setData({
      a: 0,
      saomang: []
    })
    this.getsaomang()
  },
  getsaomang(e) {
    var self = this
    var aa = this.data.a
    var fenlei = this.data.name
    var oldsaomang = this.data.saomang
    oldsaomang.reverse()
    if (fenlei == '') {
      db.collection('saomang').where({

        })
        .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(20) // 限制返回数量为 10 条
        .get()
        .then(res => {
          var newsaomang = oldsaomang.concat(res.data)
          newsaomang.reverse()
          self.setData({
            a: aa + 20,
            saomang: newsaomang
          })
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        })
        .catch(err => {
          console.error(err)
        })
    } else {
      db.collection('saomang').where({
          fenlei: fenlei
        })
        .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(20) // 限制返回数量为 10 条
        .get()
        .then(res => {
          var newsaomang = oldsaomang.concat(res.data)
          newsaomang.reverse()
          self.setData({
            a: aa + 20,
            saomang: newsaomang
          })
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  tabSelect(e) {
    console.log(this.data.list[e.currentTarget.dataset.id])
    this.setData({
      saomang: [],
      a: 0,
      name: this.data.list[e.currentTarget.dataset.id],
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.getsaomang()
  },
  addsaomang(e) {
    wx.navigateTo({
      url: 'addsaomang/addsaomang',
    })
  },
  onPullDownRefresh: function() {
    console.log('下拉')
    this.setData({
      a: 0,
      saomang: []
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getsaomang()
  },
  onReachBottom: function() {
    console.log('上拉')
    var saomang = this.data.saomang.length
    var aa = this.data.a
    console.log(saomang)
    console.log(aa)
    if (saomang == aa) {
      this.getsaomang()
    }
  },
  //搜索
  inputTyping: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
    this.sousuo();
  },
  sousuo(e) {
    var input = this.data.inputVal
    const db = wx.cloud.database()
    var that = this
    db.collection('saomang').where({
      title: db.RegExp({
        regexp: input,
        options: 'ims',
      })
    }).get({
      success: res => {
        console.log(res)
        that.setData({
          saomang: res.data,
          a: 0,
        })
      }
    })
  },
  gosaomang1(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: 'saomang1/saomang1?id=' + id,
    })
  },
  quanjusousuo(e) {
    wx.navigateTo({
      url: '/sousuo/sousuo',
    })
  },
})