// components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   * targetDate [Date] 日历要显示的月份的其中一天
   */
  properties: {
    
    targetDate: {
      type: String,
      value: '' //类似 '2019-03-21' 年月日字串
    },
    
    begin: {
      type: String,
      value: '1900-01-01' //年月日字串
    },
    
    deadline: {
      type: String,
      value: '' //年月日字串
    },
    
    mark: {
      type: null, //目前传对象须要这样设置
      // type: Array,
      // optionalTypes: [Object], //虽然这样设置但还是无法成功传入完整的对象
      value: [],
      // observer(newVal, oldVal) {
      //   this.getWeek(new Date())
      // }
    },
    
    format: {
      type: Number,
      value: 1, //0周日开始,1周一开始
    },
    
    isInsert: {
      type: Boolean,
      value: false,
    },
    
    //日历栏是否打开
    isCalendarShow: {
      type: Boolean,
      value: false,
    }
  },
  
  /**
   * 传入数据有变化时处理
   * 无论是外部更新还是组件内部更新值都会触发
   * 进入监听说明已经发生改变了
   * 一定要避免在处理方法里再次改变值,以免进入死循环
   */
  observers: {
    //这里使用箭头函数会导致this变成undefined
    'isCalendarShow': function (isCalendarShow) {
       console.log('isCalendarShow 有变化', arguments)
      this._calShowToggle(isCalendarShow)
    },
    
    'mark': function (mark) {
      let obj = {}
      
      if (mark instanceof Array) {
        for (let item of mark) {
          //用来在渲染中判断哪些日期需要加红点
          //只是需要知道存在这个键就可以,值只要是非假值即可
          obj[item] = 1
        }
      } else {
        obj = mark
      }
      // console.log('mark 有变化', mark, obj)
      this.setData({markObj: obj})
    },
    
    'targetDate': function (targetDateStr) {
      // console.log('targetDateStr 有变化', targetDateStr)
      if (targetDateStr.length < 8) return
      let thatDate = new Date(targetDateStr)
      
      this.setData({selectedYmd: this._getDateKeys(thatDate).ymd})
      this._setCalendarData(thatDate)
    },
    
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    isCalShow: false, //日历栏是否打开,组件内部使用
    isCalShowPlay: false, //设置显示打开日历后,以延时动画的方式显示出来
    markObj: {},
    today: {},
    selectedYmd: '', //当前选择日期
    calendar: {
      weeks: []
    }
  },
  
  ready() {
    let today = new Date(),
        ymd = this._getDateKeys(today).ymd
    
    this.setData({
      today: {
        obj: today,
        ymd
      }
    })
    
    if (!this.data.deadline) {
      //如果用户没设置选择截止日期,那默认是今天
      this.setData({deadline: ymd})
    }
    
    if (this.data.targetDate.length < 8) {
      //如果没有传入指定的选择日期,那默认是今天
      this.setData({
        selectedYmd: ymd, //默认选中今天
      })
      this._setCalendarData(today)
    }
    
    if (this.data.isInsert) {
      //在插入模式下,固定显示日历内容,不可隐藏
      this.setData({
        isCalShow: true,
        isCalShowPlay: true
      })
    }
    // console.log('ready:', this.data);
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    
    /**
     * 监听切换日历显示事件
     */
    onShowToggle() {
      this._calShowToggle()
    },
    
    /**
     * 点击遮罩层关闭日历栏
     * @param e
     */
    onCloseCalendar(e) {
      if (e.target.dataset.id == 'calendarBox') this._calShowToggle(false)
    },
    
    /**
     * 选择日期事件
     * @param e
     * @returns {boolean}
     */
    onSelectDate(e) {
      let {ymd, isAvailable} = e.currentTarget.dataset
      
      if (!isAvailable) return false
      
      this.setData({selectedYmd: ymd})
      this.triggerEvent('getdate', {selected: ymd})
      //选择后随即关闭日历栏
      
    },
    
    /**
     * 返回今天
     */
    onBackToToday() {
      this.setData({ selectedYmd: this.data.today.ymd })
      this._setCalendarData(this.data.today.obj);
    },
    
    /**
     * 切换显示前或后一段时间的日历
     * 现在只能偏置以月为单位的时间
     */
    onCalChange(e) {
      let {type, arrow} = e.currentTarget.dataset,
          {year, month, date} = this.data.calendar,
          offset = arrow == 1 ? 1 : -1,
          targetDate = {}
      
      switch (type) {
        case  'month': {
          targetDate = new Date(year, month + offset, 1)
        }
      }
      
      this._setCalendarData(targetDate)
    },
    
    /**
     * 设置目标日期对应的月格式日历渲染数据
     * 这是整个日历组件的核心
     * @param targetDate
     * @private
     */
    _setCalendarData(targetDate = new Date()) {
      //根据起始天是周日或周一和本月天数,确定月的第一周前补多少天,最后一周后补多少天
      //总的相关天数,其中的第一天日期对象,循环得出所有的日期对象
      let {year, month, date, day, y, m, d, ymd} = this._getDateKeys(targetDate),
          firstDay = new Date(year, month, 1), //该月的第一天的日期对象
          lastDay = new Date(year, month + 1, 0), //该月最后一天的日期对象
          monthDaysCount = lastDay.getDate(), //该月的总天数
          firstDayWeekNum = firstDay.getDay(), //第一天是周几
          lastDayWeekNum = lastDay.getDay(),
          startOffset = 0, //该月第一天离所在周第一天的差距,天数
          endOffset = 0, //该月最后一天离所在周最后一天的差距,天数
          allDaysCount = 0, //日历从第一天到最后一天的总天数
          firstWeekDay = {},  //日历中显示的第一周的第一天日期对象
          allDays = [], //全部相关的一系列日期对象
          calendar = {y, m, d, ymd, day, month, date, year, weeks: []} //渲染数据
      
      if (this.data.format == 1) {
        //周一是开始的第一天,1~7
        startOffset = firstDayWeekNum == 0 ? 6 : firstDayWeekNum - 1
        endOffset = lastDayWeekNum == 0 ? 0 : 7 - lastDayWeekNum //如果当前是周二,那还差5天满一周
      } else {
        //周日是开始,0~6
        startOffset = firstDayWeekNum
        endOffset = lastDayWeekNum == 0 ? 6 : 6 - lastDayWeekNum //如果当前是周二,那还差4天满一周
      }
      
      allDaysCount = startOffset + monthDaysCount + endOffset
      firstWeekDay = new Date(year, month, firstDay.getDate() - startOffset)
      
      //全部相关的日期对象
      for (let i = 0; i < allDaysCount; i++) {
        allDays.push(new Date(firstWeekDay.getFullYear(), firstWeekDay.getMonth(), firstWeekDay.getDate() + i))
      }
      
      //日期渲染数据
      for (let i = 0, idx = -1; i < allDays.length; i++) {
        if (i % 7 == 0) ++idx
        if (!calendar.weeks[idx]) calendar.weeks[idx] = []
        
        calendar.weeks[idx].push(this._getDateKeys(allDays[i]))
      }
      
      this.setData({calendar})
      
      // console.log(calendar); //todo 这里可以查看渲染日历的数据
    },
    
    /**
     * 转换日历栏显示与否,带延迟动画效果
     * 可显性切换
     * @param isShow
     * @private
     */
    _calShowToggle(isShow = undefined) {
      if (this.data.isInsert) return
      
      let self = this,
          isCalShow = isShow === undefined ? !self.data.isCalShow : !!isShow
      
      if (isCalShow) {
        //开启日历栏
        self.setData({
          isCalShow: true
          
        }, () => {
          setTimeout(() => {
            self.setData({
              isCalShowPlay: true
            }, () => {
              self.triggerEvent('cal-show-toggle', {isCalShow: true})
            })
          }, 100)
          
        })
        
      } else {
        //关闭
        self.setData({
          isCalShowPlay: false
        }, () => {
          setTimeout(() => {
            self.setData({
              isCalShow: false
            }, () => {
              self.triggerEvent('cal-show-toggle', {isCalShow: false})
            })
          }, 200)
        })
      }
      
    },
    
    /*
    * 左补位
    * */
    _strLeftPad(str, len, pad = '0') {
      return (Array(len).join(pad) + String(str)).substr(-len)
    },
    
    /**
     * 返回日期对象的各个时间单位值
     * @param targetDate
     * @returns {{year: number, month: number, date: number, day: number, y: string, m: *, d: *, ymd: string}}
     * @private
     */
    _getDateKeys(targetDate = new Date()) {
      let year = targetDate.getFullYear(),
          month = targetDate.getMonth(),
          date = targetDate.getDate(),
          day = targetDate.getDay(),
          y = String(year),
          m = this._strLeftPad(month + 1, 2, '0'),
          d = this._strLeftPad(date, 2, '0'),
          ymd = `${y}-${m}-${d}`
      
      return {year, month, date, day, y, m, d, ymd,}
    },
    
    
  }, //method
})
