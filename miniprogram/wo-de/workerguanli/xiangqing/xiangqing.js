const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    options:null,
    isCalendarShow: false,    //日历显示
    calendarMark: [],         //日历内容
    dengji: ['专业','大师','宗师'],
    show: false,
    worker:[],
    id:null,
  },
  onLoad: function (options) {
    this.setData({
      options: options.title
    })
    this.shuaxin()
  },
  shuaxin(e){
    var options = this.data.options
    var self = this
    db.collection('worker').doc(options).get({
      success: function (res) {
        console.log(res.data)
        self.setData({
          isCalendarShow: false,    //日历显示
          calendarMark: res.data.worktime,
          worker: res.data,
          id: res.data._id
        })
      },
      complete: function (e) {
        console.log(self.data.id)
      }
    })
  },
  yes(e){
    var self=this
    const id=this.data.id
    wx.showModal({
      title: '提示',
      content: '是否给予该工人通过审核',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'worker-true',
            data: {
              id:id
            },
            success: res => {
              console.log(res)
              wx.navigateBack({
                url: '../../workerguanli/workerguanli'
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })    
        } else if (res.cancel) { }
      }
    })
  },
  addyes(e) {
    var self = this
    const id = this.data.id
    var worker = this.data.worker
    var newwork = worker.work.concat(worker.addwork)
    var newworkerjinenglook = worker.workerjinenglook.concat(worker.addworkerjinenglook)
    var newworkprice = Object.assign({},worker.workprice, worker.addworkprice)
     wx.showModal({
      title: '提示',
      content: '是否给予该工人通过审核',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'worker-add-true',
            data: {
              id: id,
              newwork: newwork,
              newworkerjinenglook: newworkerjinenglook,
              newworkprice: newworkprice
            },
            success: res => {
              console.log(res)
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000,
                complete(res){
                  wx.navigateBack({
                    url: '../../workerguanli/workerguanli'
                  })
                }
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        } else if (res.cancel) { }
      }
    }) 
  },
  showModal(e) {
    this.setData({
      show: true
    })
  },
  hideModal(e) {
    this.setData({
      show: false
    })
  },
  radioChange(e){
    var self=this
    console.log(e.detail.value)
    this.hideModal()
    const dengji = e.detail.value
    const id = this.data.id
     wx.showModal({
      title: '提示',
       content: '是否给予该工人[' + dengji +']等级',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'worker-dengji',
            data: {
              id: id,
              dengji: dengji
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
    const id = this.data.id
    wx.showModal({
      title: '提示',
      content: '是否取消该工人的认证',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'worker-quxiao',
            data: {
              id: id,
            },
            success: res => {
              console.log(res)
              wx.navigateBack({
                url: '../../workerguanli/workerguanli'
              })
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            }
          })
        } else if (res.cancel) { }
      }
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


  gongjiachakan(e) {
    var id = e.currentTarget.id
    console.log(id)
    wx.navigateTo({
      url: '../../../workerprice/workerprice?id=' + id,
    })
  },
  ViewImagesfz(e){
    wx.previewImage({
      urls: [this.data.worker.sfzzimg, this.data.worker.sfzfimg],
      current: e.currentTarget.id
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.worker.workerjinenglook,
      current: this.data.worker.workerjinenglook[e.currentTarget.id]
    });
  },
})