const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jiage:null,
    TabCur: 0,
    tabname: ['拼团', '信息修改'],
    tabnamexs: '拼团',
    name:null,
    people:null,
    pintuan:false,
    flow: false,
    two: false,
    three:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self=this
    db.collection('goods').doc(options.id).get({
      success: function (res) {
        console.log(res)
        if (res.data.huodong.people==2){
          console.log('2')
          self.setData({
            two:!self.data.true,
          })
        } if (res.data.huodong.people == 3) {
          console.log('3')
          self.setData({
            three: true,
          })
        } if (res.data.huodong.people == 4) {
          console.log('4')
          self.setData({
            flow: true,
          })
        }
        self.setData({
          jiage: res.data.price,
          name:res.data.huodong.price,
          pintuan: res.data.huodonghave,
          id: options.id
        })
      }
    }) 
  },
  pintuanswitch(e){
    this.setData({
      pintuan: !this.data.pintuan
    })
  },
  tuichu(e){
    var id=this.data.id
    db.collection('goods').doc(id).update({
      data: {
        huodonghave: false,
        huodong: {}
      },
      success(res) {
        wx.redirectTo({
          url: '../../shangjia/shangjia',
        })
      },
      fail: console.error
    })
  },
  pintuan(e) {
    var self = this
    var id = this.data.id
    if (e.detail.value.people == '2') {
      var style = '2人团'
    }
    if (e.detail.value.people == '3') {
      var style = '3人团'
    }
    if (e.detail.value.people == '4') {
      var style = '4人团'
    }

    if (e.detail.value.pintuanjiage != null && e.detail.value.pintuanjiage != '') {
      var huodong = {
        style: style,
        people: parseInt(e.detail.value.people),
        price: e.detail.value.pintuanjiage,
      }

      db.collection('goods').doc(id).update({
        data: {
          huodonghave: true,
          huodong: huodong
        },
        success(e) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.redirectTo({
              url: '../../shangjia/shangjia',
            })
          }, 1500)
          
        },
        fail: console.error
      })

    } else {
      wx.showToast({
        title: '请填写拼团价格',
        icon: 'none',
        duration: 1000
      })
    }
    console.log(huodong)
  },
  tabSelect(e) {
    this.setData({
      tabnamexs: this.data.tabname[e.currentTarget.dataset.id],
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  newjiage(e) {
    var self = this
    console.log(e.detail.value.jiage)
    var id = this.data.id
    var jiage = e.detail.value.jiage
    db.collection('goods').doc(id).update({
      data: {
        price: jiage
      },
      success(e) {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../../shangjia/shangjia',
          })
        }, 1500)
      },
      fail: console.error
    })

  },
})