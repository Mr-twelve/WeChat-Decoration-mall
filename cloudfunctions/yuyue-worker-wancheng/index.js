//工人施工一半,jindu改为50
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('yuyue').doc(event.id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        jindu: 100,
        time2: new Date().getFullYear() + '-' + parseInt(new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes(),
      }
    })
  } catch (e) {
    console.error(e)
  }
}