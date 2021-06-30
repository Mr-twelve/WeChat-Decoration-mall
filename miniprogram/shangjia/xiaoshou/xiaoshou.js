const db = wx.cloud.database()
const app = getApp()
var self = this
Page({
  data: {
    a: 0,
    goodsid: null,
    showmessage: false,
    showDialog: false,
    shangpuid: null,
    goods: [],
    dingdan: [{
      name: "待发货",
    },
    {
      name: "待收货",
    },
    {
      name: "已完成",
    }],
    TabCur: 0,
    scrollLeft: 0
  },
  onLoad: function (options) {
    var self = this
    self.setData({
      shangpuid: options.shangpuid,
    })
    self.shuaxin()
  },
  shuaxin(e) {
    this.setData({
      a: 0,
      goodsid: null,
      showmessage: false,
      showDialog: false,
    })
    this.getgoods()
  },
  getgoods(option) {
    var self = this
    var aa = this.data.a
    var shangpuid = this.data.shangpuid
    db.collection('buygoods').where({
      shangpuid: shangpuid
    }).skip(aa)
      .limit(20)
      .get({
        success(e) {
          console.log(e)
          self.setData({
            a: aa + 20,
            goods: self.data.goods.concat(e.data),
          })
        },
      })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    console.log(this.data.TabCur)
  },
  formSubmit(e) {
    var self = this
    var id = this.data.goodsid
    console.log(id)
    var kuaidi = e.detail.value.speak
    if (kuaidi != null && kuaidi != "") {
      wx.cloud.callFunction({
        name: 'goods-fahuo',
        data: {
          date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
          id: id,
          kuaidi: kuaidi
        },
        success: res => {
          wx.showToast({
            title: '发货完成',
            icon: 'success',
          })
          setTimeout(function () {
            self.shuaxin()
          }, 1500)
          console.log(res)

        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    } else {
      wx.showToast({
        title: '请填写快递单号',
        icon: 'none',
      })
    }
  },
  /**
* 控制 pop 的打开关闭
* 该方法作用有2:
* 1：点击弹窗以外的位置可消失弹窗
* 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
*/
  toggleDialog(e) {
    console.log(e)
    var id = e.currentTarget.id
    var self = this
    self.setData({
      goodsid: id,
      showDialog: !self.data.showDialog
    });
  },


  tomessage(e) {
    var self = this
    var index = parseInt(e.currentTarget.id)
    var message = self.data.goods[index]
    db.collection('shangpu').doc(message.shangpuid).get({
      success: function (res) {
        console.log(res.data)
        console.log('star', message.pingjia.star)
        self.setData({
          slider: message.pingjia.star,
          shangpumessage: res.data,
          message: message,
          showmessage: !self.data.showmessage
        })
      }
    })
    console.log(message)

  },
  hidemessage(e) {
    console.log(this.data.shangpumessage)
    this.setData({
      showmessage: !this.data.showmessage
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