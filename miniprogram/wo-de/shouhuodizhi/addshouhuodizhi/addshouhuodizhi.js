const app = getApp()
const db = wx.cloud.database()
var shouhuodizhi = null
var id = null
Page({

  data: {
    id: '',
    shouhuodizhi: null,
    userid: null,
    region: ['广东省', '广州市', '海珠区'],
  },

  onLoad: function(options) {
    console.log(options.take)
    this.setData({
      id: options.take
    })

  },
  RegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit(e) {
    var location = e.detail.value.location
    var name = e.detail.value.name
    var tell = e.detail.value.tell
    if (name != "") {
      if (tell.length == 11) {
        if (location != ""){
          var shouhuodizhi0 = [{
            location: e.detail.value.location,
            name: e.detail.value.name,
            tell: e.detail.value.tell,
            region: this.data.region
          }]
          var self = this
          db.collection('user').doc(self.data.id).get({
            success: function (res) {
              var shouhuodizhi = res.data.shouhuodizhi
              if (shouhuodizhi == null) {
                var newshouhuodizhi = shouhuodizhi0
              } else {
                var newshouhuodizhi = shouhuodizhi0.concat(shouhuodizhi)
              }
              console.log(shouhuodizhi)
              console.log(newshouhuodizhi)
              db.collection('user').doc(self.data.id).update({
                data: {
                  shouhuodizhi: newshouhuodizhi

                },
                success: function (res) {
                  wx.showToast({
                    title: '已保存新地址',
                    icon: 'sucess',
                    duration: 2000,
                    complete(res) {
                      setTimeout(function () {
                        //要延时执行的代码
                        wx.navigateBack({
                          url: '../../shouhuodizhi/shouhuodizhi'
                        })
                      }, 1500) //延迟时间
                    }
                  }),
                    console.log(res)
                },
                fail: console.error
              })
            }
          })

        } else {
          wx.showToast({
            title: '请输入详细地址',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1000
        })
      }
    }else{
      wx.showToast({
        title: '请填写名字',
        icon: 'none',
        duration: 1000
      })
    }
  }
})