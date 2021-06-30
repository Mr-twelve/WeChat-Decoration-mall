import {
  getUUID,
  getExt
} from "../../share/utils/utils.js";
const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    a:0,
    shangpumessage: [],
    message:null,
    showmessage:false,
    username:null,
    slider: null,//星星
    buygoodsname:null,
    imgList: [],
    usertximg:null,
    buygoodsid:null,
    id:null,
    showpingjia:false,
    buy:null,
    dingdan: [{
      name: "待发货",
    },
    {
      name: "待收货",
    },
    {
      name: "已完成",
    }],
    TabCur: 0,
    scrollLeft: 0
  },
  onLoad: function (options) {
    this.shuaxin()
  },
  shuaxin(e){
    var self = this
    db.collection('buygoods').where({
      _openid: app.globalData.openid // 填入当前用户 openid
    }).get({
      success(e) {
        self.setData({
          goods: e.data,
///////////////////////////////////////////////
          a:20,
          shangpumessage:[],
          message: null,
          showmessage: false,
          username: null,
          slider: 5,//星星
          buygoodsname: null,
          imgList: [],
          usertximg: null,
          buygoodsid: null,
          id: null,
          showpingjia: false,
          buy: null,
        })
      },
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    console.log(this.data.TabCur)
  },
  qianshou(e){
    var self=this
    var id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '确定签收该商品？',
      success(res) {
        if (res.confirm) {
          db.collection('buygoods').doc(id).update({
            // data 传入需要局部更新的数据
            data: {
              date2: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
              jindu: 2
            },
            success: res => {
              wx.showToast({
                title: '签收成功',
                icon: 'success',
              })
              setTimeout(function () {
                self.shuaxin()
              }, 1000)
              console.log(res)

            },
            fail: console.error
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  pingjia(e){
    console.log(app.globalData.userInfo)
    var usertximg = app.globalData.userInfo.avatarUrl
    var username = app.globalData.userInfo.nickName
    var self=this
    var id = e.currentTarget.id
    console.log(id)
    db.collection('buygoods').doc(id).get({
      success: function (res) {
        self.setData({
          username: username,
          buygoodsname:res.data.name,
          usertximg: usertximg,
          ifpingjia:res.data.ifpingjia+1,
          buygoodsid:res.data._id,
          id: res.data.goodsid,
          showpingjia: !self.data.showpingjia
        })
      }
    })
    
  },
  pingjia1(e){
    var self=this
    var username = this.data.username
    var fileIDList=[]
    var star = this.data.slider
    var buygoodsname = this.data.buygoodsname
    var usertximg = this.data.usertximg
    var id = this.data.id
    var ifpingjia = this.data.ifpingjia
    var buygoodsid = this.data.buygoodsid
    var imgList = this.data.imgList
     wx.showLoading({
      title: '图片上传中',
      mask: true
    }) 
    console.log(buygoodsname)
    imgList.forEach((value, index) => {
       const cloudPath = "goods/" + "pingjia/" + index + "-" + getUUID() + ".jpg";
      wx.cloud.uploadFile({
        filePath: value,
        cloudPath: cloudPath,
        success: (res) => {
          fileIDList.push(res.fileID);
          console.log('file', fileIDList)
          if (fileIDList.length == imgList.length) {
            
              var newpingjia = {
                name: username,
                star: star,
                fileIDList: fileIDList,
                date: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
                usertximg: usertximg,
                user: app.globalData.openid,
                pingjia: e.detail.value.pingjia
              }
              db.collection('goods').doc(id).get({
                success: function (resss) {
                  console.log(res)
                  console.log(resss)
                  var oldpingjia = resss.data.pingjia
                  oldpingjia.push(newpingjia)
                  var newnewpingjia = oldpingjia.reverse()
                  console.log(newnewpingjia)
                  wx.cloud.callFunction({
                    name: 'goods-pingjia',
                    data: {
                      id: id,
                      pingjia: newnewpingjia,
                    },
                    success: res => {
                      console.log(newpingjia)
                      console.log(buygoodsid)
                      console.log(ifpingjia)
                      db.collection('buygoods').doc(buygoodsid).update({
                        // data 传入需要局部更新的数据
                        data: {
                          pingjia: newpingjia,
                          ifpingjia: ifpingjia
                        },
                        success: res => {
                          wx.showToast({
                            title: '评价成功',
                            icon: 'success',
                          })
                          setTimeout(function () {
                            self.shuaxin()
                          }, 1000)
                          console.log(res)
                        },
                        fail: console.error
                      })
                    },
                    fail: err => {
                    },
                    complete: () => {
                    }
                  })
                }
              })
            
          }
        }
      }) 
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 3, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  //星星
  bindchange(e) {
    this.setData({
      slider: e.detail.value
    })
  },
  hipingjia(e){
    this.setData({
      showpingjia: !this.data.showpingjia
    })
  },
  ingoods(e) {
    console.log(e)
    wx.navigateTo({
      url: '../../buy/goods/goods?goods_id=' + e.currentTarget.id,
    })
  },
  tomessage(e){
    var self=this
    var index = parseInt(e.currentTarget.id)
    var message=self.data.goods[index]
    db.collection('shangpu').doc(message.shangpuid).get({
      success: function (res) {
        console.log(res.data)
        console.log('star', message.pingjia.star)
        self.setData({
          slider:message.pingjia.star,
          shangpumessage: res.data,
          message: message,
          showmessage: !self.data.showmessage
        })
      }
    })
    console.log(message)
    
  },
  hidemessage(e){
    console.log(this.data.shangpumessage)
    this.setData({
      showmessage: !this.data.showmessage
    })
  },
  onReachBottom: function () {
    console.log('上拉')
    var name = this.data.name
    var goods = this.data.goods.length
    var aa = this.data.a
    console.log(goods)
    console.log(aa)
    if (goods == aa) {
      var self = this
      db.collection('buygoods').where({
        _openid: app.globalData.openid // 填入当前用户 openid
      }).skip(aa)
        .limit(20)
        .get({
        success(e) {
          self.setData({
            goods: self.data.goods.concat(e.data),
            ///////////////////////////////////////////////
            a: aa+20,
          })
        },
      })
    }
  }
})
