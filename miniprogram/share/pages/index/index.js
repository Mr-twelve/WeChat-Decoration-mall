const appInst = getApp();
const db = wx.cloud.database()

Page({
  /* 页面的初始数据 */
  data: {
    images: [1, 2, 3, 4, 5, 6, 7, 8],
    hasmore: true,
    weibos: [],
    mask: false
  },

  /* 生命周期函数--页面监听函数 */
  onLoad: function (options) {
    const taht = this;
  },

  onShow: function (event) {
    this.loadWeibos()
  },

  // 下拉刷新，上拉加载更多
  // [1,2,3,4,1,2,3,4] []
  loadWeibos: function (start = 0) {
    const that = this;
    wx.cloud.callFunction({
      name: "weibos",
      data: {
        start: start
      }
    }).then(res => {
      console.log("----------");
      console.log(res);
      console.log("----------");
      const weibos = res.result.weibos;
      let hasmore = true;
        hasmore = false
      let newWeibos = [];
      if (start > 0) {
        newWeibos = that.data.weibos.concat(weibos);
      } else {
        newWeibos = weibos;
      }
      // console.log(newWeibos[0]);
      that.setData({
        weibos: newWeibos,
        hasmore: hasmore
      });
      success: {
        wx.stopPullDownRefresh()
      }
    })
  },
  /*   wx.startPullDownRefresh() */

  onPullDownRefresh: function (event) {
    this.loadWeibos(0);
  },

  onReachBottom: function (event) {
    this.loadWeibos(this.data.weibos.length);
  },



  onWriteWeiboTap: function (event) {
    const that = this;
      wx.showActionSheet({
        itemList: ['文字', '照片'],
        itemColor: '#000000',
        success: (res) => {
          const tapIndex = res.tapIndex;
          if (tapIndex == 0) {
            wx.navigateTo({
              url: '../wweibo/wweibo?type=' + tapIndex
            })
          } else if (tapIndex == 1) {
            wx.chooseImage({
              success: function (res) {
                const tempImages = res.tempFilePaths;

                that.setData({
                  tempImages: tempImages
                })
                wx.navigateTo({
                  url: '../wweibo/wweibo?type=' + tapIndex
                })
              },
            })
          }
        }
      })
  },



})