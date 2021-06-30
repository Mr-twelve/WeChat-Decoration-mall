//拼单人数达到，开始等待发货
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('buygoods').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        jindu: 0,
      }
    })
  } catch (e) {
    console.error(e)
  }
}