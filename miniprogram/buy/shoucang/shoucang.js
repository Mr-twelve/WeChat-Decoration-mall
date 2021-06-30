// miniprogram/pages/shoucang/shoucang.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur:0,
    TabCurhave: ['商品','工匠','文章'],
    seting: false, //设置按钮是否选中
    userid: '',
    shoucang: [{ //收藏列表，默认为空
      id: "",
      name: "",
      number: null,
      price: "",
      tximg: ""
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },
  onShow(e){
var self = this
    db.collection('user').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get().then(res => {
      console.log(res.data[0].gouwuche)
      self.setData({
        //total:sum,
        userid: res.data[0]._id,
        shoucang: res.data[0].shoucang,
        gouwucheworker: res.data[0].gouwucheworker,
        gouwuchetext: res.data[0].gouwuchetext
      }, () => {
      })
    })
  },
  gogoods(e) {
    wx.navigateTo({
      url: '../goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  //删除
  shanchu(e) {
    console.log(e.currentTarget.id)
    var self = this;
    const id = e.currentTarget.id;
    var timegoods = this.data.shoucang;
    wx.showModal({
      title: '确定删除该商品？',
      success(res) {
        if (res.confirm) {
          timegoods.splice(id, 1)
          self.setData({
            shoucang: timegoods
          })
          self.upnewgouwuche()
          console.log('用户点击确定', timegoods)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //更新数据库
  upnewgouwuche(e) {
    db.collection('user').doc(this.data.userid).update({
      // data 传入需要局部更新的数据
      data: {
        shoucang: this.data.shoucang,
        gouwucheworker: this.data.gouwucheworker,
        gouwuchetext: this.data.gouwuchetext
      },
      success(res) { },
      fail: console.error
    })
  },
  //设置按钮
  shezhi(e) {
    const timecheckgoods = this.data.checkgoods
    this.setData({
      timecheckgoods: timecheckgoods,
      seting: true,
    })
  },
  //完成按钮
  wancheng(e) {
    this.setData({
      seting: false,
    })
  },

  //清空购物车
  qingkong(e) {
    var self = this;
    wx.showModal({
      title: '确定删除所有商品？',
      success(res) {
        if (res.confirm) {
          self.setData({
            shoucang: null
          })
          self.upnewgouwuche()
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  gosaomang1(e) {
    var id = e.currentTarget.id
    console.log(e)
    wx.navigateTo({
      url: '../../saomang/saomang1/saomang1?id=' + id,
    })
  },
  xiangqing(e) {
    console.log(this.data.name)
    wx.navigateTo({
      url: 'worker/worker?id=' + e.currentTarget.id,
    })
  },
  shanchuworker(e){
    console.log(e.currentTarget.id)
    var self = this;
    const id = e.currentTarget.id;
    var timegoods = this.data.gouwucheworker;
    wx.showModal({
      title: '确定删除该工匠？',
      success(res) {
        if (res.confirm) {
          timegoods.splice(id, 1)
          self.setData({
            gouwucheworker: timegoods
          })
          self.upnewgouwuche()
          console.log('用户点击确定', timegoods)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  shanchutext(e){
    console.log(e.currentTarget.id)
    var self = this;
    const id = e.currentTarget.id;
    var timegoods = this.data.gouwuchetext;
    wx.showModal({
      title: '确定删除该文章？',
      success(res) {
        if (res.confirm) {
          timegoods.splice(id, 1)
          self.setData({
            gouwuchetext: timegoods
          })
          self.upnewgouwuche()
          console.log('用户点击确定', timegoods)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
})