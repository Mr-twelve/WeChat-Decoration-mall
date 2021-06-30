//用户取消预约，yuyuenumber-1
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('worker').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        yuyuenumber: event.number,
      }
    })
  } catch (e) {
    console.error(e)
  }
}