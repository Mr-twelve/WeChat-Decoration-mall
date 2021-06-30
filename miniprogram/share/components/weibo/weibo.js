// components/weibo/weibo.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detailurl: {
      type: String,
      value: null
    },
    weibo: {
      type: Object,
      value: {}
    },
    handle: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onImageTap: function (event) {
      const dataset = event.target.dataset;
      const index = dataset.index;
      const images = this.data.weibo.images;
      const current = images[index];
      wx.previewImage({
        current: current, // 当前显示图片的链接，不填则默认为 urls 的第一张
        urls: images
      })
    }
  },

  lifetimes: {
    attached: function () {
      const windowWidth = wx.getSystemInfoSync().windowWidth;
      const weiboWidth = windowWidth - 40;
      const twoImageSize = (weiboWidth - 2.5) / 2;
      const threeImageSize = (weiboWidth - 2.5 * 2) / 3;
      this.setData({
        twoImageSize: twoImageSize,
        threeImageSize: threeImageSize
      })
    }
  }
})