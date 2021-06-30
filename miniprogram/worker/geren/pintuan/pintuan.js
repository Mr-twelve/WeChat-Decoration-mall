const db = wx.cloud.database()
Page({
  data: {
    work:null,
    homework: ['设计师', '木工', '基础工人', '泥工', '水电工', '油漆工',]
  },

  onLoad: function (options) {
    var self=this
    var homework = this.data.homework
    db.collection('worker').doc(options.id).get({
      success: function (res) {
        console.log(res.data)
        var work = res.data.work
        var newwork=[]
        for (var i = 0; i < work.length+1;i++){
          if (homework.includes(work[i])){
            var addwork={
              number:null,
              name: work[i],
              yesno:false
            }
            newwork.push(addwork)
          }
          if (i == work.length){
            self.setData({
              id: options.id,
              work: newwork,
              pintuan: res.data.pintuan,
              worker: res.data
            })
          }
        }
      }
    })
  },
  pintuan(e){
    var work = 'work[' + parseInt(e.currentTarget.id)+'].yesno'
    this.setData({
      [work]: !this.data.work[parseInt(e.currentTarget.id)].yesno
    })
  },
  pintuanswitch(e){
    this.setData({
      pintuan: !this.data.pintuan
    })
  },
  formSubmit(e){
    console.log(e.detail.value)
    var id=this.data.id
    var pintuan = this.data.pintuan
    var gongjia = e.detail.value
    var length = Object.keys(gongjia).length;
    console.log(gongjia)
    var kuong = false
    Object.entries(gongjia).forEach(([key, value], index) => {
      if (value == '') {
        kuong = true
      }
      if (length == index + 1) {
        if (kuong == true) {
          wx.showToast({
            title: '请填所有的价格项',
            icon: 'none',
            duration: 1000
          })
        }
        if (kuong == false) {
          wx.showModal({
            title: '提示',
            content: '是否确定保存？',
            success(res) {
              if (res.confirm) {
                console.log(pintuan)
                console.log(id)
                console.log(gongjia)
                /* db.collection('worker').doc(id).update({
                  // data 传入需要局部更新的数据
                  data: {
                    pintuan: pintuan,
                    pintuanxiangqin: gongjia
                  },
                  success: console.log,
                  fail: console.error
                }) */
                 wx.cloud.callFunction({
                  name: 'worker-pintuan',
                  data: {
                    pintuan: pintuan,
                    id: id,
                    pintuanxiangqin: gongjia
                  },
                  success: res => {
                    wx.navigateTo({
                      url: '../../geren/geren',
                    })
                  },
                  fail: err => {
                  },
                  complete: () => {
                  }
                }) 
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    });
  },
  tuichu(e){
    var self = this
    var id = this.data.id
    wx.cloud.callFunction({
      name: 'worker-pintuan',
      data: {
        id: id,
        pintuan: false,
        pintuanxiangqin: {}
      },
      success: res => {
        wx.navigateTo({
          url: '../../geren/geren',
        })
      },
      fail: err => {
      },
      complete: () => {
      }
    }) 
  }
})