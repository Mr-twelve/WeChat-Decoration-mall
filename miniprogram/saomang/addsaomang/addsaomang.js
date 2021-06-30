const db = wx.cloud.database()
Page({
  data: {
    fmimg: null,
    fenlei: null,
    tabpage: 0,
    modalName: null,
    title: null,
    contest: [{
      text: null,
      img: null,
    }],
    checkbox: [{
        value: '设计师',
        name: '设计师',
        checked: false,
      },
      {
        value: '入门',
        name: '入门',
        checked: false,
      }, {
        value: '美缝',
        name: '美缝',
        checked: false,
      }, {
        value: '封阳台',
        name: '封阳台',
        checked: false,
      }, {
        value: '开荒打扫',
        name: '开荒打扫',
        checked: false,
      }, {
        value: '油漆工',
        name: '油漆工',
        checked: false,
      }, {
        value: '木工',
        name: '木工',
        checked: false,
      }, {
        value: '基础工人',
        name: '基础工人',
        checked: false,
      }, {
        value: '泥工',
        name: '泥工',
        checked: false,
      }, {
        value: '水电工',
        name: '水电工',
        checked: false,
      },
      {
        value: '其他',
        name: '其他',
        checked: false,
      }
    ],
  },
  onLoad(e) {
    const db = wx.cloud.database()
    var self = this
    db.collection('viedo').doc('3c4c6d855d6f8a93116b746474cb0809').get({
      success: function(res) {
        self.setData({
          viedo: res.data
        })
      }
    })
  },
  add(e) {
    var newarr = {
      text: null,
      img: null,
    }
    var old = this.data.contest
    old.push(newarr)
    if (this.data.contest.length != 99) {
      this.setData({
        contest: old
      })
    } else {
      wx.showToast({
        title: '不能再长啦',
      })
    }
  },
  yulan(e) {
    this.setData({
      tabpage: 1
    })
  },
  bianji(e) {
    this.setData({
      tabpage: 0
    })
  },
  inputtext(e) {
    console.log(e)
    var index = e.target.id
    var value = e.detail.value
    var text = 'contest[' + index + '].text'
    this.setData({
      [text]: value
    })
  },
  upfmimg(e) {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        
        const tempFilePaths = res.tempFilePaths[0]
        console.log(tempFilePaths)
        self.setData({
          fmimg: tempFilePaths
        })
      }
    })
  },
  upimg(e) {
    var index = e.target.id
    var text = 'contest[' + index + '].img'
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        self.setData({
          [text]: tempFilePaths
        })
      }
    })
  },
  showModal(e) {
    this.setData({
      modalName: 'ChooseModal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ChooseCheckbox(e) {
    this.setData({
      fenlei: e.currentTarget.dataset.value,
      modalName: null
    })
  },
  inputtitle(e) {
    var value = e.detail.value
    this.setData({
      title: value
    })
  },
  fabiao(e) {
    var self = this
    var fmimg = this.data.fmimg
    var title = this.data.title
    var contest = this.data.contest
    var fenlei = this.data.fenlei
    var year = new Date().getFullYear()
    var month = (new Date().getMonth() + 1)
    var date = new Date().getDate()
    var time = new Date().getHours() + '一' + new Date().getMinutes()
    var length = contest.length
    var a = 0
    var newcontest = []
    if (fmimg != null) {
      if (title != null) {
        if (fenlei != null) {
          wx.showLoading({
            mask: true,
            title: '上传中...',
          })
          wx.cloud.uploadFile({
            cloudPath: '知识扫盲/' + fenlei + '/' + title+'[封面]' + Math.floor(Math.random() * 10000)  + '.jpg',
            filePath: fmimg, // 文件路径
            success: take => {
              // get resource ID
              var fenmianimg = take.fileID
              contest.forEach((value, index) => {
                if (value.img != null) {
                  var cloudPath = '知识扫盲/' + fenlei + '/' + title + Math.floor(Math.random() * 10000) + '一' + index + '.jpg'
                  wx.cloud.uploadFile({
                    cloudPath: cloudPath,
                    filePath: value.img, // 文件路径
                    success: res => {
                      var newarr = {
                        text: value.text,
                        img: res.fileID,
                      }
                      newcontest.push(newarr)
                      console.log(newcontest)
                      a++
                      if (parseInt(length) == a) {
                        var year = new Date().getFullYear()
                        var month = (new Date().getMonth() + 1)
                        var date = new Date().getDate()
                        var time = new Date().getHours() + ':' + new Date().getMinutes()
                        db.collection('saomang').add({
                          data: {
                            fenmianimg: fenmianimg,
                            title: title,
                            newcontest: newcontest,
                            fenlei: fenlei,
                            year: year,
                            month: month,
                            date: date,
                            time: time,
                          },
                          success: function (res) {
                            wx.hideLoading()
                            wx.showToast({
                              title: '成功',
                              icon: 'success',
                              duration: 2000
                            })
                            setTimeout(function () {
                              wx.redirectTo({
                                url: '../../saomang/saomang'
                              })
                            }, 1500)
                            console.log(res)
                          },
                          fail: console.error
                        })
                      }
                    },
                    fail: err => { }
                  })
                } else {
                  var newarr = {
                    text: value.text,
                    img: null,
                  }
                  newcontest.push(newarr)
                  a++
                  if (parseInt(length) == a) {
                    console.log(newcontest)
                    var year = new Date().getFullYear()
                    var month = (new Date().getMonth() + 1)
                    var date = new Date().getDate()
                    var time = new Date().getHours() + ':' + new Date().getMinutes()
                    console.log(contest)
                    db.collection('saomang').add({
                      data: {
                        fenmianimg: fenmianimg,
                        title: title,
                        newcontest: newcontest,
                        fenlei: fenlei,
                        year: year,
                        month: month,
                        date: date,
                        time: time,
                      },
                      success: function (res) {
                        wx.hideLoading()
                        wx.showToast({
                          title: '成功',
                          icon: 'success',
                          duration: 2000
                        })
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '../../saomang/saomang'
                          })
                        }, 1500)
                        console.log(res)
                      },
                      fail: console.error
                    })
                  }
                }
              })
            },
            fail: err => {
              // handle error
            }
          })
        } else {
          wx.showToast({
            title: '请选择分类',
            icon: 'none',
          })
        }
      } else {
        wx.showToast({
          title: '请输入标题',
          icon: 'none',
        })
      }
    } else {
      wx.showToast({
        title: '请上传封面',
        icon: 'none',
      })
    }
  },

})