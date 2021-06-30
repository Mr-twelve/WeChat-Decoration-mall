const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    peoplestyle:999,
    twoImageSize: null,
    threeImageSize: null,
    TabCur: 0,
    scrollLeft: 0,
    tab: ["工人详情", "用户评价"],
    isCalendarShow: false,
    pingjia: null,
    calendarMark: [],
    name: null,
    showDialog: false,
    worker: [],
    id: null,
  },
  onShow(e){
    this.setData({
      peoplestyle: 999
    })
  },
  onLoad: function (options) {
    var self = this
    db.collection('worker').doc(options.title).get({
      success: function (res) {
        console.log(res.data)
        db.collection('yuyue-tishi').doc('1e1b3423-601d-458b-92b9-4333ec0b6b29').get({
          success: function (take) {
            Object.entries(res.data.pintuanxiangqin).forEach(([key, value], index) => {
              if (key == options.name){
                console.log(value)
                self.setData({
                  pintuanstyle:value
                })
              }
            })
            self.setData({
              stylename: options.name,
              ticheng: take.data.ticheng,
              pingjia: res.data.userspeak,
              calendarMark: res.data.worktime,
              name: res.data.work,
              worker: res.data,
              id: res.data._id
            })
          }
        })
      },
    })
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const weiboWidth = windowWidth - 40;
    const twoImageSize = (weiboWidth - 2.5) / 2;
    const threeImageSize = (weiboWidth - 2.5 * 2) / 3;
    this.setData({
      twoImageSize: twoImageSize,
      threeImageSize: threeImageSize
    })
  },
  buy(e) {
    var self=this
    const openid = app.globalData.openid
    console.log(openid)
    db.collection('user').where({
      _openid: openid
    })
      .get({
        success: function (res) {
          if (res.data.length == 0) {
            console.log('tiaozhuan')
            wx.showModal({
              content: '初次使用请注册相关信息,若已注册过请点击取消',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../../wo-de/adduserinfor/adduserinfor?xiangxi=' + true,
                  })
                } else if (res.cancel) {

                }
              }
            })
          } else {
            console.log('go')
            self.setData({
              showDialog: !self.data.showDialog,
            })
          }
        }
      })
  },
  jvjue(e) {
    this.buy()
  },
  jieshou(e) {
    var peoplestyle = this.data.peoplestyle
    var name = this.data.name
    var id = this.data.id
    var ticheng = this.data.ticheng
    const take = {
      name: name,
      id: this.data.id
    }
    wx.navigateTo({
      url: 'yuyue/yuyue?name=' + name + '&id=' + id + '&ticheng=' + ticheng + '&stylename=' + this.data.stylename + '&peoplestyle=' + peoplestyle +'&pintuanstyle=' + this.data.pintuanstyle,
    })
    this.setData({
      showDialog: !this.data.showDialog,
    })
  },
  /**
   * 显示日历栏
   */
  onOpenCalendar() {
    this.setData({
      isCalendarShow: true
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  chanyupindan(e){
    console.log(e.currentTarget.id)
    this.setData({
      peoplestyle: parseInt(e.currentTarget.id)
    }, () => { this.buy() })
  }

})