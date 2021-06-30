//用户预约拼团人数达到
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('yuyue').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        jindu:0
      }
    })
  } catch (e) {
    console.error(e)
  }
}