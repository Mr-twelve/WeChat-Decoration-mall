App({
  onLaunch: function () {
    var self=this
    //云开发初始化
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 此处请填入环境 ID, 环境 ID 可打开云控制台查看
        env: 'test-xchgb',
        traceUser: true,
      })
    }

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)


    if (self.globalData.openid != null) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
          self.globalData.openid = res.result.openid
          const db = wx.cloud.database()
          db.collection('userinfo').where({
            _openid: res.result.openid // 填入当前用户 openid
          }).get({
            success: function (res) {
              if (res.data.length != 0) {
                self.globalData.ifuserinfor = false
              } else {
                self.setData({
                  ifuserinfor : true,
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
      const db = wx.cloud.database()
      db.collection('userinfo').where({
        _openid: self.globalData.openid // 填入当前用户 openid
      }).get({
        success: function (res) {
          if (res.data.length != 0) {
            self.globalData.ifuserinfor = false
          } else {
            self.setData({
              userinfor: true
            })
          }
        }
      })
      console.log('1zz', self.globalData.openid)
    }
 // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              self.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (self.userInfoReadyCallback) {
                self.userInfoReadyCallback(res)
              }
            }
          })
        } else {}
      }
    })
    // 获取手机系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        console.log(e)
        self.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        self.globalData.Custom = custom;
        self.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    ifuserinfor:false,
    openid: '',
    userInfo: null,
    //商品列表分类
    list0: [{
        name: '门窗',
        id: '0',
      },
      {
        name: '软装修',
        id: '1',
      },
      {
        name: '墙地砖',
        id: '2',
      },
      {
        name: '洁具类',
        id: '3',
      },
      {
        name: '地板',
        id: '4',
      },
      {
        name: '橱柜',
        id: '5',
      },
      {
        name: '灯具',
        id: '6',
      },
      {
        name: '吊顶',
        id: '7',
      },
      {
        name: '墙面类',
        id: '8',
      },
      {
        name: '板材类',
        id: '9',
      },
      {
        name: '水电管材',
        id: '10',
      },
      {
        name: '工具',
        id: '11',
      },
      {
        name: '地面类',
        id: '12',
      },
    ],
    ColorList: [{
      title: '嫣红',
      name: 'red',
      color: '#e54d42'
    },
    {
      title: '桔橙',
      name: 'orange',
      color: '#f37b1d'
    },
    {
      title: '明黄',
      name: 'yellow',
      color: '#fbbd08'
    },
    {
      title: '橄榄',
      name: 'olive',
      color: '#8dc63f'
    },
    {
      title: '森绿',
      name: 'green',
      color: '#39b54a'
    },
    {
      title: '天青',
      name: 'cyan',
      color: '#1cbbb4'
    },
    {
      title: '海蓝',
      name: 'blue',
      color: '#0081ff'
    },
    {
      title: '姹紫',
      name: 'purple',
      color: '#6739b6'
    },
    {
      title: '木槿',
      name: 'mauve',
      color: '#9c26b0'
    },
    {
      title: '桃粉',
      name: 'pink',
      color: '#e03997'
    },
    {
      title: '棕褐',
      name: 'brown',
      color: '#a5673f'
    },
    {
      title: '玄灰',
      name: 'grey',
      color: '#8799a3'
    },
    {
      title: '草灰',
      name: 'gray',
      color: '#aaaaaa'
    },
    {
      title: '墨黑',
      name: 'black',
      color: '#333333'
    },
    {
      title: '雅白',
      name: 'white',
      color: '#ffffff'
    },
    ]
  }

})