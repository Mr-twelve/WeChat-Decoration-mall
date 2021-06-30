// 工人设置拼团
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('worker').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        pintuan: event.pintuan,
        pintuanxiangqin: event.pintuanxiangqin
      }
    })
  } catch (e) {
    console.error(e)
  }
}