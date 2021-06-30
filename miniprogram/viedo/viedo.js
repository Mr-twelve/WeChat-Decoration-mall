const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addvie: false,
    vedio:[],
    a:0,
    name:'0',
    oldindex:null,
    lookall: false,
    TabCur: 0,
    scrollLeft: 0,
    list: ['', '美缝', '封阳台', '开荒打扫', '油漆工', '木工', '基础工人', '泥工', '水电工', '设计师', '其他'],
  },
  onLoad: function(options) {
    var self=this
    db.collection('worker').where({
      worker:true,
      _openid: app.globalData.openid
    }).get({
      success: function (res) {
        console.log(res.data)
        if(res.data.length==1){
          self.setData({
            addvie: true
          })
        }
      }
    })
  },
  onShow(e) {
    this.setData({
      a: 0,
      vedio: []
    })
    this.getviedo()
  },
  getviedo(e) {
    var self=this
    var aa = this.data.a
    var name = this.data.name
    var oldvedio = this.data.vedio
    oldvedio.reverse()
    console.log(name)
    if (name=='0'){
      db.collection('viedo').where({})
        .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(10) // 限制返回数量为 10 条
        .get()
        .then(res => {
          var newvedio = oldvedio.concat(res.data)
          newvedio.reverse()
          self.setData({
            a: aa + 10,
            vedio: newvedio
          })
          wx.hideLoading()
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        })
        .catch(err => {
          console.error(err)
        })
    }else{
      var newname = self.data.list[parseInt(name)]
      console.log(newname)
      db.collection('viedo').where({
        fenlei: newname
      })
        .skip(aa) // 跳过结果集中的前 10 条，从第 11 条开始返回
        .limit(10) // 限制返回数量为 10 条
        .get()
        .then(res => {
          self.setData({
            a: aa + 10,
            vedio: self.data.vedio.concat(res.data)
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
  chakan(e) {
    console.log(e.currentTarget.id)
    var index = e.currentTarget.id
    var vedio = 'vedio[' + index+'].lookall'
     this.setData({
       [vedio]: !this.data.vedio[index].lookall
    }) 
  },
  addviedo(e) {
    wx.navigateTo({
      url: 'addviedo/addviedo',
    })
  },
  tabSelect(e) {
    console.log(e)
    this.setData({
      vedio: [],
      a: 0,
      name: e.currentTarget.dataset.id,
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.getviedo()
  },
  onPullDownRefresh: function () {
    console.log('下拉')
    this.setData({
      a: 0,
      vedio: []
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getviedo()
  },
  onReachBottom: function () {
    console.log('上拉')
    var vedio = this.data.vedio.length
    var aa = this.data.a
    console.log(vedio)
    console.log(aa)
    if (vedio == aa) {
      this.getviedo()
    }
  },
  //搜索
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
    this.sousuo();
  },
  sousuo(e) {
    var input = this.data.inputVal
    const db = wx.cloud.database()
    var that = this
    db.collection('viedo').where({
      title: db.RegExp({
        regexp: input,
        options: 'ims',
      })
    }).get({
      success: res => {
        console.log(res)
        that.setData({
          vedio: res.data,
          a: 0,
        })
      }
    })
  },
  quanjusousuo(e){
    wx.navigateTo({
      url: '/sousuo/sousuo',
    })
  },
  lookvideo(e){
    var oldindex = this.data.oldindex
    if (oldindex==null){
      var index = e.currentTarget.id
      var vedio = 'vedio[' + index + '].lookvideo'
      this.setData({
        oldindex: index,
        [vedio]: true,
      }) 
    }else{
      var index = e.currentTarget.id
      var vedio = 'vedio[' + index + '].lookvideo'
      var oldvedio = 'vedio[' + oldindex + '].lookvideo'
      this.setData({
        oldindex: index,
        [vedio]: true,
        [oldvedio]: false
      }) 
    }
  },
  lookwork(e){
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: 'lookwork/lookwork?openid=' + e.currentTarget.id,
    })
  }
})