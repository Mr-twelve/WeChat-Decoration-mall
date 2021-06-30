const app = getApp()
const db = wx.cloud.database()
var user=[]
var id=null
Page({

  data: {
    user:[],
  },

  onLoad(e) {
    
  },
  onShow(e){
    var self = this
    db.collection('user').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success(res) {
        console.log(res.data)
        user = res.data[0]
        id = res.data[0]._id
        console.log(user)
        console.log(id)
      },
      complete(res) {
        self.setData({
          user: user
        })
      }
    })
  },
 add(e){
   wx.navigateTo({
     url: 'addshouhuodizhi/addshouhuodizhi?take='+id,
   })
 },
 shanchu(e){
   var self=this
   console.log(e.target.id)
   var id=this.data.user._id
   var newshouhuodizhi=this.data.user.shouhuodizhi
   newshouhuodizhi.splice(e.target.id, 1)
   console.log(newshouhuodizhi)
   db.collection('user').doc(id).update({
     // data 传入需要局部更新的数据
     data: {
       // 表示将 done 字段置为 true
       shouhuodizhi: newshouhuodizhi
     },
     success: function (res) {
       self.onShow()
         console.log(res)
     },
     fail: console.error
   })
 },
  moren(e){
    var self = this
    var index = e.target.id
    var id = this.data.user._id
    var newshouhuodizhi = this.data.user.shouhuodizhi
    var tou = newshouhuodizhi[index]
    newshouhuodizhi.splice(index, 1)
    newshouhuodizhi.unshift(tou)
    console.log(newshouhuodizhi)
    db.collection('user').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        shouhuodizhi: newshouhuodizhi
      },
      success: function (res) {
        self.onShow()
          console.log(res)
      },
      fail: console.error
    })
  },
  xiugai(e){
    var id = this.data.user._id
    var index = e.target.id
    wx.navigateTo({
      url: 'xiugai/xiugai?id=' + id+'&&index='+index,
    })
  }
})