const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    jindu:null,
    fukuan:null,
    worker:[],
    yuyue: [],
    imgList: []
  },

  onLoad: function(options) {
    var self = this
    console.log(options.title)
    const db = wx.cloud.database()
    db.collection('yuyue').doc(options.title).get({
      success: function(res) {
        console.log(res.data)
        const workerid=res.data.workerid
        console.log(workerid)
        self.setData({
          jindu: res.data.jindu+'%',
          fukuan: res.data.fukuan + '%',
          _id: res.data._id,
          yuyue: res.data,
          imgList: res.data.imgList
        })
        db.collection('worker').where({
          _openid: workerid // 填入当前用户 openid
        }).get({
          success: function (e) {
            console.log(e)
            self.setData({
              worker: e.data[0],
            })
          }
        })
      }
    })

  },
  quxiao(e) {
    var oldnumber=this.data.worker.yuyuenumber
    var newnumber=oldnumber-1
    console.log(oldnumber, newnumber)
    var workerid=this.data.worker._id
    const id = this.data._id
     wx.showModal({
      title: '确定要取消该顶单？',
      success(res) {
        if (res.confirm) {
          db.collection('yuyue').doc(id).remove({
            success: res => {
              wx.cloud.callFunction({
                name: 'yuyue-user-quxiao',
                data: {
                  id: workerid,
                  number: newnumber
                },
                success: res => {
                  wx.showToast({
                    title: '取消成功',
                  });
                  setTimeout(function () {
                    wx.navigateBack({
                      url: '../../dingdan/dingdan'
                    })
                  }, 1500)
                },
                fail: err => {
                  console.error('[云函数] [login] 调用失败', err)
                },
              })
            },
            fail: console.error
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 



    /* 
    console.log(id)
    
 */
  }

})