//用户对工人评价
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  console.log(event)
  try {
    return await db.collection('worker').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        userspeak: event.pingjia,
        star: parseInt(event.sum)
      }
    })
  } catch (e) {
    console.error(e)
  }
}