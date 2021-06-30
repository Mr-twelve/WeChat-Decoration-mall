const db = wx.cloud.database()
const app = getApp()


Page({
  data: {
    show: false,
    shangpu: [],
    TabCur: 0,
    scrollLeft: 0,
    dingdan: [{
      name: "待审核",
    },
    {
      name: "已审核",
    }],
  },

  onLoad: function (options) {
    this.shuaxin()
  },
  shuaxin(e){
    var self = this
    db.collection('shangpu').where({})
      .get({
        success: function (res) {
          console.log(res.data)
          self.setData({
            show: false,
            shangpu: res.data
          })
        },
        fail: console.error
      })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  yes(e) {
    var self=this
    console.log(e.currentTarget.id)
    const id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '是否给予该商铺通过审核',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'shangpu-true',
            data: {
              id: id
            },
            success: res => {
              console.log(res)
              self.shuaxin()
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        } else if (res.cancel) { }
      }
    })
  },
  quxiao(e) {
    var self=this
    console.log(e.currentTarget.id)
    const id = e.currentTarget.id
     wx.showModal({
      title: '提示',
      content: '是否取消该商铺的认证',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'shangpu-quxiao',
            data: {
              id: id,
            },
            success: res => {
              console.log(res)
              self.shuaxin()
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        } else if (res.cancel) { }
      }
    }) 
  },
  chakanshangpu(e){
    console.log(e.currentTarget.id)
    wx.navigateTo({
      url: '../lookshangpu/lookshangpu?id=' + e.currentTarget.id,
    })
  },
  lookyyzz(e){
    console.log(e.currentTarget.id)
    var look1 = this.data.shangpu[e.currentTarget.id].imgjyxkz
    var look2 = this.data.shangpu[e.currentTarget.id].imgyyzz
    var lookimg = [look1, look2]
    wx.previewImage({
      current: look1, 
      urls: lookimg
    })
  }
})