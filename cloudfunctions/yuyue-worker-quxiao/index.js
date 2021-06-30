//工人否决用户的预约，fukuan改为-1
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('yuyue').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        fukuan:-1,
        workerquxiao: event.workerquxiao
      }
    })
  } catch (e) {
    console.error(e)
  }
}