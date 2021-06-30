//worker number+1
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('goodsnumber').doc('7594ba71-600e-461f-8394-10f7d241bc64').update({
      // data 传入需要局部更新的数据
      data: {
        workernumber:event.workernumber
      }
    })
  } catch (e) {
    console.error(e)
  }
}