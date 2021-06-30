const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    scrollLeft: 0,
    onLoad: false,
    a: 0,
    TabCur: 0,
    MainCur: 0, //右边列表编号，置顶渲染
    TopCur: 0, //左边导航栏编号，渲染
    Topnum: 0,
    i: 0,
    goods: [],
    worker:[],
    dataindex: [0,0],
    /* tximageTempFileURL: [], */
    top: [{
        id: '0',
        name: '装修材料'
      },
      {
        id: '1',
        name: '装修工匠'
      }
    ],
    list0: app.globalData.list0,
    list1: [
      {
        name: '设计师',
        id: '0',
      },
      {
        name: '木工',
        id: '1',
      },
      {
        name: '基础工人',
        id: '2',
      },
      {
        name: '泥工',
        id: '3',
      },
      {
        name: '水电工',
        id: '4',
      },
      {
        name: '油漆工',
        id: '5',
      },
      ],
    load: true,
    screenHeight: app.globalData.screenHeight
  },
  onShow() {
    var self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    self.gettximgid()
  },
  onLoad() {

  },

  gettximgid(e) {
    var aa = this.data.a
    db.collection('goods').where({
        huodonghave: true,
        index: this.data.dataindex[1]
      }).field({
        huodonghave: true,
        huodong: true,
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
        /* for (var i = 0; i < res.data.length + 1; i++) {
          if (i < res.data.length) {
            wx.cloud.getTempFileURL({
              fileList: [this.data.goods[i].tximage],
              success: res => {
                console.log('temp1', res.fileList[0].tempFileURL)
                this.setData({
                  tximageTempFileURL: this.data.tximageTempFileURL.concat(res.fileList[0].tempFileURL)
                })
              },
            })
          }
          if (i = res.data.length) {
            this.setData({
              a: aa+20,
              tximageTempFileURL: this.data.tximageTempFileURL.reverse()
            })
          }
        } */
        wx.hideLoading()
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      })
      .catch(err => {
        console.error(err)
      })
  },
  getworker(e) {
    var aa = this.data.a
    var self = this
    var name = this.data.list1[parseInt(this.data.dataindex[1])].name
    db.collection('worker').where({
      work: name,
      pintuan:true,
      worker: true
    }).skip(aa)
      .limit(20)
      .get({
        success(e) {
          console.log(e)
          self.setData({
            a: aa + 20,
            worker: self.data.worker.concat(e.data)
          })
        },
        fail: console.error
      })
  },
  topSelect(e) {
    console.log(e)
    this.setData({
      a: 0,
      goods: [],
      worker:[],
      dataindex: [parseInt(e.currentTarget.dataset.id), 0],
      TopCur: e.currentTarget.dataset.id,
      Topnum: e.currentTarget.dataset.id,
      MainCur: 0,
      TabCur: 0,
    }, () => {
      if (e.currentTarget.dataset.id=='0'){
        this.gettximgid()
      }else{
        this.getworker()
      }
    })
  },
  tabSelect(e) {
    this.setData({
      a: 0,
      goods: [],
      worker: [],
      dataindex: [parseInt(this.data.TopCur), parseInt(e.currentTarget.dataset.id)],
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    }, () => {
      if (this.data.TopCur == '0') {
        this.gettximgid()
      } else {
        this.getworker()
      }
    })
  },
  ingoods(e) {
    console.log(e)
    wx.navigateTo({
      url: '../goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  text(e) {
    console.log('this', this.data.index)
  },
  xiangqing(e) {
    console.log(this.data.list1[parseInt(this.data.dataindex[1])].name)
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: 'xiangqing/xiangqing?title=' + e.currentTarget.id + '&name=' + this.data.list1[parseInt(this.data.dataindex[1])].name,
    })
  },

  onPullDownRefresh: function() {
    console.log('下拉')
    this.setData({
      a: 0,
      goods:[],
      worker: [],
    })
    wx.showNavigationBarLoading() //在标题栏中显示加载
    if (e.currentTarget.dataset.id == '0') {
      this.gettximgid()
    } else {
      this.getworker()
    }
  },
  onReachBottom: function() {
    console.log('上拉')
    var goods = this.data.goods.length
    var aa = this.data.a
    console.log(goods)
    console.log(aa)
    if (goods == aa) {
      if (e.currentTarget.dataset.id == '0') {
        this.gettximgid()
      } else {
        this.getworker()
      }
    }
  }
})