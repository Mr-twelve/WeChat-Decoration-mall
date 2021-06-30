//用户预约数据加入工人数据库
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('worker').doc(event.workerid).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        yuyuenumber: event.number
      }
    })
  } catch (e) {
    console.error(e)
  }
}