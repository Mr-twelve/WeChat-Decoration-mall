const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    showqitaxiangbaojia:false,
    qitaxiangbaojia: null,
    jindu: null,
    fukuan: null,
    workerquxiao: null,
    yuyuenumber: null,
    workerid: null,
    showDialog: false,
    id: null,
    yuyue: [],
    imgList: []
  },

  onLoad: function (options) {
    this.setData({
      title: options.title,
      yuyuenumber: options.yuyuenumber,
      workerid: options.workerid,
    })
    this.shuaxin()
  },
  shuaxin(e) {
    var self = this
    var title = self.data.title
    db.collection('yuyue').doc(title).get({
      success: function (res) {
        console.log(res.data)
        self.setData({
          showDialog: false,
          jindu: res.data.jindu + '%',
          fukuan: res.data.fukuan + '%',
          id: res.data._id,
          yuyue: res.data,
          imgList: res.data.imgList
        })
      }
    })
  },
  quxiao(e) {
    const workerquxiao = this.data.workerquxiao
    const id = this.data.id
    wx.cloud.callFunction({
      name: 'yuyue-worker-quxiao',
      data: {
        workerquxiao: workerquxiao,
        id: id,
      },
      success: res => {
        wx.showToast({
          title: '取消成功',
        });
        setTimeout(function () {
          self.shuaxin()
        }, 1500)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      },
    })

  },
  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  toggleDialog(e) {
    console.log(e.currentTarget.id)
    this.setData({
      showDialog: !this.data.showDialog
    });
  },
  hideqitaxiangbaojia(e) {
    console.log(e.currentTarget.id)
    this.setData({
      showqitaxiangbaojia: false
    });
  },
  //取消弹窗确定取消
  formSubmit(e) {
    console.log(e.detail.value.workerquxiao)
    if (e.detail.value.workerquxiao != null && e.detail.value.workerquxiao != "") {
      this.setData({
        workerquxiao: e.detail.value.workerquxiao,
        showDialog: !this.data.showDialog
      });
      this.quxiao()
    } else {
      //添加信息不完整
      wx.showToast({
        title: '请填写备注',
      })
    }
  },
  qitaxiangbaojia(e) {
    console.log(e.detail.value.qitaxiangbaojia)
    if (e.detail.value.qitaxiangbaojia != null && e.detail.value.qitaxiangbaojia != "") {
      this.setData({
        qitaxiangbaojia: e.detail.value.qitaxiangbaojia,
        showqitaxiangbaojia: false
      });
      this.jidedanqitaxiang()
    } else {
      //添加信息不完整
      wx.showToast({
        title: '请填写报价',
      })
    }
  },
  jidedanqitaxiang(e){
    var self = this
    const id = this.data.id
    var qitaxiangprice = this.data.qitaxiangbaojia
    wx.cloud.callFunction({
      name: 'yuyue-worker-jiedan-qita',
      data: {
        id: id,
        qitaxiangprice: qitaxiangprice
      },
      success: res => {
        wx.showToast({
          title: '接单成功',
        });
        setTimeout(function () {
          self.shuaxin()
        }, 1500)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      },
    })
  },
  jiedan(e) {
    var self = this
    const id = this.data.id
    if (this.data.yuyue.ifqitaxiang==true){
      self.setData({
        showqitaxiangbaojia:true
      })
    }else{
      wx.cloud.callFunction({
        name: 'yuyue-worker-jiedan',
        data: {
          id: id,
        },
        success: res => {
          wx.showToast({
            title: '接单成功',
          });
          setTimeout(function () {
            self.shuaxin()
          }, 1500)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        },
      })
    }
    
  },
  yiban(e) {
    var self = this
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '是否确定施工完成50%',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'yuyue-worker-yiban',
            data: {
              id: id,
            },
            success: res => {
              wx.showToast({
                title: '进度完成50%',
              });
              setTimeout(function () {
                self.shuaxin()
              }, 1000)
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  wancheng(e) {
    var self = this
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '是否确定施工完成100%',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'yuyue-worker-wancheng',
            data: {
              id: id,
            },
            success: res => {
              wx.showToast({
                title: '进度完成100%',
              });
              setTimeout(function () {
                self.shuaxin()
              }, 1000)
            },
            fail: err => {
              console.error('[云函数] [login] 调用失败', err)
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})