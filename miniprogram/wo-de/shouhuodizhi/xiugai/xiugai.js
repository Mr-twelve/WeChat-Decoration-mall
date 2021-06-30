const app = getApp()
const db = wx.cloud.database()
var id = null
var shouhuodizhi = null
var index = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var self = this
    id = options.id
    index = parseInt(options.index)
    db.collection('user').doc(id).get({
      success: function(res) {
        console.log(res)
        console.log(res.data.shouhuodizhi)
        shouhuodizhi = res.data.shouhuodizhi[index]
      },
      complete(res) {
        console.log(id)
        console.log(index)
        console.log(shouhuodizhi)
        self.setData({
          id: id,
          shouhuodizhi: shouhuodizhi,
          index: index,
          region: shouhuodizhi.region
        })
      }
    })
  },
  onShow(e) {

  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit(e) {
    var location = e.detail.value.location
    var name = e.detail.value.name
    var tell = e.detail.value.tell
    var index=this.data.index
    var id=this.data.id
    if (name != "") {
      if (tell.length == 11) {
        if (location != "") {
          var shouhuodizhi0 = {
            location: e.detail.value.location,
            name: e.detail.value.name,
            tell: e.detail.value.tell,
            region: this.data.region
          }
          var self = this
          db.collection('user').doc(id).get({
            success: function (res) {
              var shouhuodizhi = res.data.shouhuodizhi
              /* if (shouhuodizhi == null) {
                var newshouhuodizhi = shouhuodizhi0
              } else {
                var newshouhuodizhi = shouhuodizhi0.concat(shouhuodizhi)
              } */
              shouhuodizhi.splice(index, 1, shouhuodizhi0)
              console.log(shouhuodizhi)

              db.collection('user').doc(id).update({
                data: {
                  shouhuodizhi: shouhuodizhi

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
    } else {
      wx.showToast({
        title: '请填写名字',
        icon: 'none',
        duration: 1000
      })
    }
  }
})