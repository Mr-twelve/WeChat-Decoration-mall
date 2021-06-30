//工人等级更改
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('worker').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        workerdengji: event.dengji
      }
    })
  } catch (e) {
    console.error(e)
  }
}