// miniprogram/pages/add/add.js
const app = getApp();
const db = wx.cloud.database();
var fileID = [];
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shangpuname: null,
    shangpulocation:null,
    shangpu: null,
    goodsnumber: 0,
    goodsnumber1: 0,
    price: "", //表单商品价格
    name: "", //表单商品名字
    describe: "", //表单商品描述
    imgnumber: 0, //图片数量
    fileID: [],
    txfileID: "",
    imgList: [],
    tximgList: [],
    textareaAValue: '',
    pagenumber: true,
    picker: [
      '门窗', '软装饰', '墙地砖', '洁具类', '地板', '橱柜', '灯具', '吊顶', '墙面类', '板材类', '水电管材', '工具', '地面类'
    ],
    multiIndex: null, //表单商品类型
  },
  onLoad(e) {
    console.log(e)
    var shangpuid = e.shangpuid
    var shangpulocation=e.shangpulocation
    var shangpuname=e.shangpuname
    db.collection('goodsnumber').get().then(res => {
      this.setData({
        shangpuname: shangpuname,
        shangpulocation: shangpulocation,
        shangpuid: shangpuid,
        goodsnumber: res.data[0].goodsnumber,
        goodsnumber1: res.data[0].goodsnumber + Math.floor(Math.random() * 1000) * 0.001
      })
      console.log(this.data.goodsnumber)

      console.log(this.data.goodsnumber1)

    })

  },
  /////////////////////双列选择器//////////////////////////
  PickerChange(e) {
    console.log(parseInt(e.detail.value));
    this.setData({
      multiIndex: parseInt(e.detail.value)
    })
  },
  ////////////////////////////////////////////////////////////////
  textareaAInput(e) {
    console.log(e.detail.value)
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  //页面0提交表单获取基本信息
  formSubmit(e) {
    //console.log(e.detail.value)
    const price = e.detail.value.价格
    const name = e.detail.value.名称
    const describe = this.data.textareaAValue
    if (name != "") {
      if (price != "") {
        if (describe != "") {
          this.setData({
            pagenumber: false,
            price: price,
            name: name,
            describe: describe
          })
        } else {
          wx.showToast({
            title: '请填写商品描述',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '请填写商品价格',
          icon: 'none',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '请填写商品名称',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //选择头像图片并上传
  Choosetx(e) {
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        console.log(res.tempFilePaths)
        var tx = res.tempFilePaths
        //'Text/'上传到存储Text文件中
        var time = util.formatTime(new Date());
        wx.cloud.uploadFile({
          cloudPath: 'Text/' + 'tximage/' + this.data.name + '[头像]' + time + '[' + this.data.goodsnumber + ']',
          filePath: res.tempFilePaths[0],
          success: res => {
            console.log('[tximg上传文件] 成功：', res)
            this.setData({
              tximgList: tx,
              txfileID: res.fileID
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '头像上传失败',
              mask: true,
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }
    });
  },
  //预览头像
  ViewtxImage(e) {
    console.log(e)
    wx.previewImage({
      urls: [e.currentTarget.dataset.url],
    });
  },
  //预览图片
  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  //头像重置
  tximgcz() {
    wx.cloud.deleteFile({
      fileList: [this.data.txfileID],
      success: res => {
        this.setData({
          txfileID: "",
        })
      },
      fail: console.error
    })
  },
  //选择图片并调用上传方法
  ChooseImage() {
    wx.chooseImage({
      count: 9, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        this.setData({
          imgList: this.data.imgList.concat(res.tempFilePaths)
        })
        this.upimage()
      }
    });
  },
  //上传图片
  upimage(e) {
    wx.showToast({
      icon: 'loading',
      title: '上传中...',
      mask: true,
      duration: 2000
    })
    var imgnumber = this.data.imgnumber
    let imgList = this.data.imgList
    var time = util.formatTime(new Date());
    if (imgnumber < imgList.length) {
      const filePath = this.data.imgList[imgnumber]
      const cloudPath = 'Text/' + this.data.name + '[' + imgnumber + ']' + time + '[' + this.data.goodsnumber + ']'
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          /* console.log('执行次数:', imgnumber)
          console.log('[img上传文件] 成功：', res) */
          this.setData({
            imgnumber: imgnumber + 1,
            fileID: this.data.fileID.concat(res.fileID)
          })
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
            mask: true,
          })
        },
        complete: res => {
          this.upimage()
        }
      })
    } else {
      wx.hideLoading()
    }
  },
  //图片重置
  imgcz() {
    wx.cloud.deleteFile({
      fileList: this.data.fileID,
      success: res => {
        this.setData({
          fileID: "",
          imgList: [],
          imgnumber: 0,
        })
      },
      fail: console.error
    })
  },
  //提交所有信息并上传
  tijiao(e) {
    var shangpuid = this.data.shangpuid
    var shangpuname=this.data.shangpuname
    var shangpulocation=this.data.shangpulocation
    var goodsnumber = this.data.goodsnumber1
    var index = this.data.multiIndex
    var price = this.data.price
    var tximage = this.data.txfileID
    var image = this.data.fileID
    var name = this.data.name
    var describe = this.data.describe

    if (tximage != [] && tximage != "" && tximage != null) {
      if (image != [] && image != "" && image != null) {
        wx.showToast({
          icon: 'loading',
          title: '上传中...',
          mask: true,
        })
        db.collection('goods').add({
          data: {
            shangjia:true,
            huodonghave:false,
            huodong:{},
            huodongxiangqin:[],
            shangpulocation: shangpulocation,
            shangpuname: shangpuname,
            shangpuid: shangpuid,
            pingjia: [],
            goodsnumber: goodsnumber,
            index: index,
            price: price,
            tximage: tximage,
            image: image,
            name: name,
            describe: describe,
            totall:0
          },
          success: res => {
            console.log('up', res)
            db.collection('goodsnumber').doc('9afd9b6a5d2155ad026a18050d0e1be4').update({
              data: {
                // 表示将 done 字段置为 true
                goodsnumber: this.data.goodsnumber + 1
              }
            })
            wx.showToast({
              title: '新增记录成功',
              icon: 'success',
              duration: 1000,
              mask: true,
              success: function() {
                console.log('haha');
                setTimeout(function() {
                  //要延时执行的代码
                  wx.navigateBack({
                    url: '../addshangpin/addshangpin'
                  })
                }, 1000) //延迟时间
              }
            })

          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败',
              mask: true,
            })
            console.error('[数据库] [新增记录] 失败：', err)
          },
          complete: res => {

          }
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请添加商品图片',
          mask: true,
        })
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请添加商品头像',
        mask: true,
      })
    }


  },


})