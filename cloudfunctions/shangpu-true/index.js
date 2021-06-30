//审核工人认证通过
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('shangpu').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        renzheng: true,
      }
    })
  } catch (e) {
    console.error(e)
  }
}