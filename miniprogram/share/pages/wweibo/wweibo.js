// pages/wweibo/wweibo.js
import {
  getUUID,
  getExt
} from "../../utils/utils.js";

const app = getApp();
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: null,
    tempImages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const type = options.type;

    const pages = getCurrentPages();

    const indexPage = pages[0];
    const tempImages = indexPage.data.tempImages;
    const tempVideo = indexPage.data.tempVideo;





    this.setData({
      tempImages: tempImages,
      type: type,
      tempVideo: tempVideo
    })

    /* console.log(tempImages) */

    this.initImageSize();
  },

  /* 初始化图片的尺寸 */
  initImageSize: function () {
    const windowWidth = wx.getSystemInfoSync().windowWidth;
    const containerWidth = windowWidth - 60;
    const imageSize = (containerWidth - 5 * 3) / 3;
    this.setData({
      imageSize: imageSize
    })
  },

  /* 打开位置页面 */
  openLocationPage: function () {
    const that = this;
    wx.chooseLocation({
      success: res => {
        if (res.name) {
          delete res["errMsg"];
          that.setData({
            location: res
          })
        }
      }
    })
  },

  /* 获取位置信息的事件 */
  onLocationTap: function (event) {
    const that = this; /* 使用到that的地方必须定义that */
    wx.getSetting({
      success: res => {
        const isLocation = res.authSetting['scope.userLocation'];
        /* console.log(isLocation) */
        if (isLocation) {
          that.openLocationPage();
        } else {
          wx.authorize({
            scope: "scope.userLocation",
            success: (res) => {
              that.openLocationPage();
            }
          });
        }
      }
    })
  },

  /* 发布事件 */
  publicWeibo: function (weibo) {
    wx.cloud.callFunction({
      name: "wweibo",
      data: weibo,
      success: res => {
        const _id = res.result._id;
        if (_id) {
          wx.hideLoading();
          wx.showToast({
            title: '发送成功',
          });
          setTimeout(function () {
            wx.navigateBack({})
          }, 900)
        } else {
          wx.showToast({
            title: res.result.errmsg,
          })
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },

  /* 提交按钮的事件 */
  onSubmitEvent: function (event) {
    const that = this;
    const content = event.detail.value.content;
    const location = this.data.location;
    const author = app.globalData.userInfo;
    const systemInfo = wx.getSystemInfoSync();
    let model = systemInfo.model;
    /* js中的正则表达式，“。”代表任意字符，“*”任意多个字符 */
    const device = model.replace(/<.*>/, "");
    const weibo = {
      content: content,
      location: location,
      author: author,
      device: device
    }
    wx.showLoading({
      title: '正在发表中...',
    });
    //1.上传图片到云服务器
    const fileIDList = [];

    //////////////////////////////
    if (that.data.tempImages != undefined) {
      that.data.tempImages.forEach((value, index) => {
        /* 如果没有这个文件夹，写出来路径以后云存储会自己建立文件夹 */
        const cloudPath = that.getCloudPath(value);
        wx.cloud.uploadFile({
          filePath: value,
          cloudPath: cloudPath,
          success: (res) => {
            fileIDList.push(res.fileID);
            if (fileIDList.length == that.data.tempImages.length) {
              //接下来的事情就是发布
              weibo.images = fileIDList;
              that.publicWeibo(weibo)
            }
          }
        })
      });
    } else if (that.data.tempVideo) {
      const cloudPath = that.getCloudPath(that.data.tempVideo);
      wx.cloud.uploadFile({
        filePath: that.data.tempVideo,
        cloudPath: cloudPath,
        success: res => {
          const fileID = res.fileID;
          weibo.video = fileID;
          that.publicWeibo(weibo);
        }
      })
    } else {
      that.publicWeibo(weibo);
    }
    /////////////////////////////
  },

  /* 添加图片的事件 */
  onAddImageTap: function (event) {
    const that = this;
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        const tempImages = res.tempFilePaths
        const oldImages = that.data.tempImages
        const newImages = oldImages.concat(tempImages)
        that.setData({
          tempImages: newImages
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  /* 删除图片的事件 */
  onRemoveBtnTap: function (event) {
    const index = event.target.dataset.index;
    const tempImages = this.data.tempImages;
    tempImages.splice(index, 1);
    this.setData({
      tempImages: tempImages
    })
  },

  /* 获取上传到云端的文件的名称 */
  getCloudPath: function (fileName) {
    const tody = new Date();
    const year = tody.getFullYear();
    const month = tody.getMonth() + 1;
    const day = tody.getDate();
    const cloudPath = "CaiJi/weibos/" + year + "/" + month + "/" + day + "/" + getUUID() + "." + getExt(fileName);
    return cloudPath;
  },

  /* 图片预览 */
  onImageTap: function (event) {
    const that = this;
    const index = event.target.dataset.index;
    const current = that.data.tempImages[index];
    wx.previewImage({
      // current: 'String', // 当前显示图片的链接，不填则默认为 urls 的第一张
      urls: that.data.tempImages,
      current: current
    })
  }
})