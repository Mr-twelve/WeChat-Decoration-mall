//活动拼单
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('goods').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        huodongxiangqin: event.newhuodongxiangqin
      }
    })
  } catch (e) {
    console.error(e)
  }
}