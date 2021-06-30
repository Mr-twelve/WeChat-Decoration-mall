//快递发货
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('buygoods').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        date1: event.date,
        jindu: 1,
        kuaidi: event.kuaidi
      }
    })
  } catch (e) {
    console.error(e)
  }
}