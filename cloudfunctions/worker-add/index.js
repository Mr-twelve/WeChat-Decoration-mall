const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async(event, context) => {
  try {
    console.log(event)
    return await db.collection('worker').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        addworker: false,
        addwork: event.work,
        addworkerjinenglook: event.fileIDList,
        addworkprice: event.workprice,
      }
    })
  } catch (e) {
    console.error(e)
  }
}