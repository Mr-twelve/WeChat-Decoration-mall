//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database()

////////////////////////////////////////////



////////////////////////////////////////////
Page({
  onPullDownRefresh() {
    wx.stopPullDownRefresh()
  },
  data: {
    userinfor: app.globalData.ifuserinfor,
    name: '',
    jichuworker: false,
    showDialog: false,
    saomang1: {
      img: "cloud://test-xchgb.7465-test-xchgb/CaiJi/pictures/扫盲/扫盲2.jpg",
      title: "装修知识墙固扫盲",
      txt: "墙固就是墙面固化胶，是界面剂的代替品。墙固具有优异的渗透性，能充分浸润基材表面，使基层密实，提高光滑界面的附着力，是一种绿色环保，高性能的界面处理材料。"
    },
    saomang2: {
      img: "cloud://test-xchgb.7465-test-xchgb/CaiJi/pictures/扫盲/扫盲1.jpg",
      title: "装修知识地面保护扫盲",
      txt: "地面保护，是装修时不可或缺的。地面保护使地面拥有防水防滑防潮还有减震之类的特性，可以很好的保护地面不受损失。"
    },
    video: [],
    url: [],
    //页面按钮需要app。wxss支持
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    motto: 'HI，这里是石头后端开发！',
    name: '拾贰丶',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    iconList: [
      /* {
            icon: 'icon',
            color: 'red',
            badge: 120,
            name: '墙固',
            id: 1
          }, {
            icon: 'cardboardfill',
            color: 'orange',
            badge: 1,
            name: '地固',
            id: 2
          },  {
            icon: 'btn',
            color: 'yellow',
            badge: 0,
            name: '地面保护',
            id: 3
          }, 
       {
        icon: 'taoxiaopu',
        color: 'cyan',
        badge: 0,
        name: '封阳台',
        id: 5
      }, {
        icon: 'clothesfill',
        color: 'blue',
        badge: 0,
        name: '开荒打扫',
        id: 6
      },*/ {
        icon: 'friendfill',
        color: 'red',
        badge: 0,
        name: '设计师',
        id: 7
      }, 
      {
        icon: 'filter',
        color: 'brown',
        badge: 0,
        name: '木工',
        id: 8
      }, {
        icon: 'repairfill',
        color: 'purple',
        badge: 0,
        name: '基础工人',
        id: 9
      }, {
        icon: 'footprint',
        color: 'grey',
        badge: 0,
        name: '泥工',
        id: 10
      }, {
        icon: 'flashbuyfill',
        color: 'yellow',
        badge: 0,
        name: '水电工',
        id: 11
      }, {
        icon: 'paintfill',
        color: 'pink',
        badge: 0,
        name: '油漆工',
        id: 12
      }, {
        icon: 'sort',
        color: 'olive',
        badge: 22,
        name: '美缝',
        id: 13
      },{
        icon: 'btn',
        color: 'red',
        badge: 0,
        name: '其他项',
        id: 14
      }
    ],
    gridCol: 10,
    skin: false,
    /* 首页的视频数据 */
    videoPlay: null,
    vedio_data: [{
        title: '动画展示1',
        url: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/动画-video/2744de230051a4cf53bccef1fc5b855a.mp4',
        img: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/pictures/动画展示封面图片/timg.jpg',
      },
      {
        title: '动画展示2',
        url: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/动画-video/2744de230051a4cf53bccef1fc5b855a.mp4',
        img: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/pictures/swiper-pictures/轮播1.jpg',
      },
      {
        title: '动画展示3',
        url: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/动画-video/2744de230051a4cf53bccef1fc5b855a.mp4',
        img: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/pictures/swiper-pictures/轮播2.jpg',
      },
      {
        title: '动画展示4',
        url: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/动画-video/2744de230051a4cf53bccef1fc5b855a.mp4',
        img: 'cloud://test-xchgb.7465-test-xchgb-1259365888/CaiJi/pictures/swiper-pictures/轮播3.jpg',
      }
    ]
  },


  onLoad: function() {
    var self = this
    db.collection('Cai-pictures').doc('swiper-pictures').get({
      success: function(res) {
        self.setData({
          url: res.data.url
        })
      }
    })

    /* db.collection('Cai-video').doc('装修动画（首页）').get({
      success: function(res) {
        self.setData({
          video: res.data.video
        })
      }
    }) */
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.openid != null) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          app.globalData.openid = res.result.openid
          db.collection('userinfo').where({
            _openid: res.result.openid // 填入当前用户 openid
          }).get({
            success: function(res) {
              if (res.data.length != 0) {
                self.setData({
                  userinfor: false
                })
              } else {
                self.setData({
                  userinfor: true
                })
              }
            }
          })
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    } else {
      db.collection('userinfo').where({
        _openid: app.globalData.openid // 填入当前用户 openid
      }).get({
        success: function(res) {
          if (res.data.length != 0) {
            self.setData({
              userinfor: false
            })
          } else {
            self.setData({
              userinfor: true
            })
          }
        }
      })
      console.log('1zz', app.globalData.openid)
    }

    db.collection('saomang')
      .aggregate()
      .sample({
        size: 2
      })
      .end()
      .then(res => {
        console.log(res)
        self.setData({
          saomang: res.list
        })
      })
  },
  onShow(e) {
    var self = this
    db.collection('yuyue-tishi').doc('ea8190f9-2cd4-436f-83d5-c3e1a34a8ab1').get({
      success: function(res) {
        self.setData({
          yuyuetishi: res.data
        })

      }
    })
  },
  onBindTap: function() {
    var name = this.data.name
    console.log(name)
    wx.navigateTo({
      /* url: '../yuyue/yuyue?take='+name, */
      url: 'buyworker/buyworker?take=' + name,
      success: red => {
        this.setData({
          showDialog: !this.data.showDialog
        });
      }
      // 通过id判断是点击哪个按钮跳转的，然后通过id判断页面要显示的内容 
      // id在data——iconlist数组里有 
    })
  },



  /* 首页动画展示加封面 */
  // 点击cover播放，其它视频结束
  videoPlay: function(e) {
    var _index = e.currentTarget.id
    this.setData({
      _index: _index
    })
    //停止正在播放的视频
    var videoContextPrev = wx.createVideoContext(this.data._index)
    videoContextPrev.stop();

    setTimeout(function() {
      //将点击视频进行播放
      var videoContext = wx.createVideoContext(_index)
      videoContext.play();
    }, 500)
  },

  onMore: function() {
    wx.navigateTo({
      url: '../saomang/saomang'
    })
  },

  onMoreVideo: function() {
    wx.navigateTo({
      url: 'dong-hua/donghua'
    })
  },


  /**
   * 控制 pop 的打开关闭
   * 该方法作用有2:
   * 1：点击弹窗以外的位置可消失弹窗
   * 2：用到弹出或者关闭弹窗的业务逻辑时都可调用
   */
  toggleDialog(e) {
    console.log(e.currentTarget.id)
    if (e.currentTarget.id == '基础工人') {
      this.setData({
        name: e.currentTarget.id,
        jichuworker: true
      });
    }
    if (e.currentTarget.id == '其他项') {
      this.qitaxiang()
    } else {
      this.setData({
        name: e.currentTarget.id,
        showDialog: true
      });
    }
  },
  qitaxiang(e) {
    wx.navigateTo({
      url: 'qitaxiang/qitaxiang',
    })
  },
  jichuworker(e) {
    this.setData({
      jichuworker: false,
      showDialog: true
    });
  },
  hidetanc(e) {
    console.log('hide')
    this.setData({
      showDialog: false,
      jichuworker: false
    });
  },
  //获取用户信息并上传数据库
  onInfo: function(event) {
    var self = this
    console.log(event.detail.userInfo)
    var userInfo = event.detail.userInfo
    app.globalData.userInfoxxi = event.detail.userInfo
    db.collection('userinfo').add({
      // data 字段表示需新增的 JSON 数据
      data: userInfo,
      success: function(res) {
        self.setData({
          userinfor: false
        })
      },
      fail: console.error
    })
    if (event.detail.userInfo) {
      app.globalData.userInfo = event.detail.userInfo
      const openid = app.globalData.openid
      db.collection('user').where({
        _openid: openid
      })
        .get({
          success: function (res) {
            console.log(res)
            if (res.data.length == 0) {
              db.collection('user').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  gouwucheworker: null, //购物车
                  gouwuchetext: null, //购物车
                  message: false,
                  name: event.detail.userInfo.nickName,
                  tell: null,
                  xingbie: null, //性别 
                  shouhuodizhi: null, //收货地址
                  morenshouhuodizhi: null, //默认收货地址
                  buy: null, //购买  
                  yuyue: null, //预约服务
                  buygo: null, //购买后发货
                  buyyes: null, //已确定收货
                  gouwuche: null, //购物车
                  shoucang: null, //收藏
                },
                success: function (res) {

                },
                fail: console.error
              })
            } else {

            }
          }
        })
    } else {

    }
  },
  inputTyping(e){
    wx.navigateTo({
      url: '/sousuo/sousuo',
    })
  },
  gosaomang1(e) {
    var id = e.currentTarget.id
    wx.navigateTo({
      url: '../saomang/saomang1/saomang1?id=' + id,
    })
  },
})