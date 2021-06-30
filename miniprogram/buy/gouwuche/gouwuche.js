// miniprogram/pages/gouwuche/gouwuche.js
const app = getApp()
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timecheckgoods: null, //临时存储选中商品 
    checkgoods: [99], //选中商品 【99】为初始全选
    quanxuan0: false, //下方全选按钮是否选中状态
    quanxuan: false, //商品选择按钮是否选择状态
    seting: false, //设置按钮是否选中
    goods:[],
    /* goods: [{ //商品列表，默认为空
      id: "",
      name: "未有商品加入购物车",
      number: 0,
      price: "",
      tximg: ""
    }], */
    userid: null, //user数据库_id
    total: 0, //选中商品总价
  },
  onLoad: function (options) {
    db.collection('user').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get().then(res => {
      console.log(res.data[0].gouwuche)
      this.setData({
        //total:sum,
        userid: res.data[0]._id,
        goods: res.data[0].gouwuche
      }, () => {
        
      })

    })
  },
  //设置按钮
  shezhi(e) {
    const timecheckgoods = this.data.checkgoods
    this.setData({
      timecheckgoods: timecheckgoods,
      seting: true,
      quanxuan0: null,
      quanxuan: null,
      total: 0,
    })
  },
  //完成按钮
  wancheng(e) {
    this.setData({
      seting: false,
      quanxuan0: null,
      quanxuan: null,
      total: 0,
    })
  },
  //删除按钮
  shanchu(e) {
    console.log(e.currentTarget.id)
    var self = this;
    const id = e.currentTarget.id;
    var timegoods = this.data.goods;
    wx.showModal({
      title: '确定删除该商品？',
      success(res) {
        if (res.confirm) {
          timegoods.splice(id, 1)
          self.setData({
            goods: timegoods
          })
          self.upnewgouwuche()
          console.log('用户点击确定', timegoods)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
            goods: null
          })
          self.upnewgouwuche()
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //跳转到该商品详情页面
  gogoods(e) {
    wx.navigateTo({
      url: '../goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  //商品数量减
  lose(e) {
    console.log(e.currentTarget.id)
    const gouwu = 'goods[' + e.currentTarget.id + '].number'
    const number = this.data.goods[e.currentTarget.id].number - 1
    if (number < 0) { } else {
      this.setData({
        [gouwu]: number
      })
      if (this.data.quanxuan0 == true) {
        this.total()
      } else {
        this.total1()
      }
      this.upnewgouwuche()
    }
  },
  //商品数量加
  add(e) {
    console.log(e.currentTarget.id)
    const gouwu = 'goods[' + e.currentTarget.id + '].number'
    const number = this.data.goods[e.currentTarget.id].number + 1
    console.log(gouwu)
    console.log(number)
    this.setData({
      [gouwu]: number
    })
    if (this.data.quanxuan0 == true) {
      this.total()
    } else {
      this.total1()
    }
    this.upnewgouwuche()
  },
  //更新数据库（数量的变化）
  upnewgouwuche(e) {
    var self=this
    db.collection('user').doc(self.data.userid).update({
      // data 传入需要局部更新的数据
      data: {
        gouwuche: self.data.goods
      },
      success(res) { },
      fail: console.error
    })
  },
  //求所有商品的和
  total(e) {
    const gouwu = this.data.goods
    var sum = 0
    for (var i = 0; i < this.data.goods.length; i++) {
      sum = gouwu[i].number * gouwu[i].price + sum
    }
    this.setData({
      total: sum,
    })
  },
  //求选中商品的和
  total1(e) {
    const gouwu = this.data.goods
    const checkgoods = this.data.checkgoods
    var sum = 0
    if (checkgoods.length == 0) {
      this.setData({
        total: 0,
      })
    } else {
      for (var i = 0; i < checkgoods.length; i++) {
        sum += gouwu[checkgoods[i]].number * gouwu[checkgoods[i]].price
        this.setData({
          total: sum,
        })
      }
    }

  },
  //商品是否选中
  checkboxChange(e) {
    var checkgoods = e.detail.value
    for (var n = 0; n < checkgoods.length; n++) {
      checkgoods[n] = parseInt(checkgoods[n])
    }
    if (checkgoods.length < this.data.goods.length) {
      this.setData({
        checkgoods: checkgoods,
        quanxuan0: null
      })
    } else {
      this.setData({
        checkgoods: checkgoods,
        quanxuan0: true
      })
    }
    console.log(this.data.checkgoods)
    if (this.data.quanxuan0 == true) {
      console.log('if')
      this.total()
    } else {
      console.log('else')
      this.total1()
    }

  },
  //全选
  quanxuan(e) {
    if (this.data.quanxuan0 == true) {
      console.log('if')
      this.setData({
        total: 0,
        quanxuan: null,
        quanxuan0: null
      })
    } else {
      console.log('else')
      this.total()
      this.setData({
        quanxuan: true,
        quanxuan0: true
      })
    }
    console.log(this.data.quanxuan)
  },
  //结算
  jiesuan(e) {
    console.log(this.data.goods)
  },
})