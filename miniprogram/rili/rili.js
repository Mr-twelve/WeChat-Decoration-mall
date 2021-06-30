//获取应用实例
const app = getApp()

Page({
  data: {
    isCalendarShow: false,
    calendarMark: [],
  },

  onLoad: function () {

  },

  /**
   * 显示日历栏
   */
  onOpenCalendar() {
    this.setData({
      isCalendarShow: true
    })
  },

  /**
   * 获取选择日期
   */
  onCalendarGetDate(e) {
    console.log('本次选择了:', e.detail.selected);
    var calendarMark = e.detail.selected
    var oldcalendarMark = this.data.calendarMark
    var index = oldcalendarMark.indexOf(calendarMark)
    if (index >= 0) {
      oldcalendarMark.splice(index, 1)
    } else {
      oldcalendarMark.push(calendarMark)
    }
    this.setData({
      calendarMark: oldcalendarMark
    })
  },

})
