import {
  getUUID,
  getExt
} from "../../../share/utils/utils.js";
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [],
    lists: null,
    Tarbar:0,
    work: [],
    modalName:false,
     checkbox:null, 
    oldcheckbox: [{
      value: '美缝',
      name: '美缝',
      checked: false,
      have: false,
    }, {
      value: '封阳台',
      name: '封阳台',
      checked: false,
        have: false,
    }, {
      value: '开荒打扫',
      name: '开荒打扫',
      checked: false,
        have: false,
    },
    {
      value: '验房师',
      name: '验房师',
      checked: false,
      have: false,
    },
    {
      value: '油漆工',
      name: '油漆工',
      checked: false,
      have: false,
    }, {
      value: '木工',
      name: '木工',
      checked: false,
      have: false,
    }, {
      value: '基础工人',
      name: '基础工人',
      checked: false,
      have: false,
    }, {
      value: '泥工',
      name: '泥工',
      checked: false,
      have: false,
    }, {
      value: '水电工',
      name: '水电工',
      checked: false,
      have: false,
    },
    ],
    name:null,
    id:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self=this
    db.collection('worker').doc(options.id).get({
      success: function (res) {
        self.setData({
          id: res.data._id,
          name: res.data.name
        })
        console.log(res.data)
        var work=res.data.work
        var checkbox = self.data.oldcheckbox
        checkbox.forEach((value,index)=>{
          work.forEach((value2, index2) => {
            if (value.name == value2){
              console.log(index)
              checkbox[index].have=true
            }else{

            }
          })
          if (index == 7) {
            self.setData({
              checkbox: checkbox
            })
          }
        }) 
      }
    })
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
   hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  ChooseCheckbox(e) {
    let items = this.data.checkbox;
    let values = e.currentTarget.dataset.value;
    var work = []
    items[values].checked = !items[values].checked;
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      if (items[i].checked == true) {
        console.log(items[i].name)
        work.push(items[i].name)
      }
    }
    console.log(work)
    this.setData({
      lists: null,
      work: work,
      checkbox: items
    })
  },
  toggleDialog(e) {
    var work = this.data.work
    if (work == "" || work == null) {
      wx.showToast({
        title: '请先选择个人技能',
        icon: 'none',
        duration: 1000
      })
    } else {
      this.setData({
        Tarbar: 1
      });
    }
  },
  gongjia(e) {
    var gongjia = e.detail.value
    var length = Object.keys(gongjia).length;
    console.log(gongjia)
    var kuong = false
    Object.entries(gongjia).forEach(([key, value], index) => {
      if (value == '') {
        kuong = true
      }
      if (length == index + 1) {
        if (kuong == true) {
          wx.showToast({
            title: '请填所有的价格项',
            icon: 'none',
            duration: 1000
          })
        }
        if (kuong == false) {
          this.setData({
            Tarbar: 0,
            lists: gongjia
          })
        }
      }
    });
  },
  fanhui(e) {
    this.setData({
      Tarbar: 0,
    })
  },
  DelImg(e) {
    this.data.imgList.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgList: this.data.imgList
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 8, //默认9
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
  formSubmit(e) {
    console.log(e)
    var self = this
    const fileIDList = [];
    var id = self.data.id
    console.log(id)
    var workprice = self.data.lists
    var work = self.data.work
    var imgList = self.data.imgList.length
    var name = self.data.name
    console.log(workprice)
    console.log(work)
    console.log(imgList)
      if (work != "" && work != []) {
        if (workprice != "" && workprice != null) {
          if (imgList != 0) {
              wx.showLoading({
                title: '认证发布中...',
                mask: true
              })
            self.data.imgList.forEach((value, index) => {
              const cloudPath = "worker/" + "workerjinenglook/" + name + "/" + index + "-add" + getUUID() + ".jpg";
              wx.cloud.uploadFile({
                filePath: value,
                cloudPath: cloudPath,
                success: (res) => {
                  fileIDList.push(res.fileID);
                  console.log('file', fileIDList)
                  if (fileIDList.length == self.data.imgList.length) {
                    wx.cloud.callFunction({
                      // 要调用的云函数名称
                      name: 'worker-add',
                      // 传递给云函数的参数
                      data: {
                        id: id,
                        fileIDList: fileIDList,
                        workprice: workprice,
                        work: work,
                      },
                      success: res => {
                        console.log('成功')
                        wx.hideLoading()
                        wx.showModal({
                          title: '认证提交完成',
                          content: '请耐心等待审核通过，可到个人页面查看',
                          showCancel: false,
                          success(res) {
                            if (res.confirm) {
                              wx.reLaunch({
                                url: '../../geren/geren',
                              })
                            } else if (res.cancel) {
                              console.log('用户点击取消')
                            }
                          }
                        }) 
                      },
                      fail: err => {
                       
                      },
                      complete: () => {
                        
                      }
                    })

                  }
                  }
                })
              })
          } else {
            wx.showToast({
              title: '请添加技能展示',
              icon: 'none',
              duration: 1000
            })
          }
        } else {
          wx.showToast({
            title: '请设置工价',
            icon: 'none',
            duration: 1000
          })
        }
      } else {
        wx.showToast({
          title: '请选择个人技能',
          icon: 'none',
          duration: 1000
        })
      }
  },
  
})
/* 

*/