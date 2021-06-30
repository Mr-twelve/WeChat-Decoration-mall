// 商铺注销删除商铺
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('goods').where({
      _openid: event.id
    }).remove()
  } catch (e) {
    console.error(e)
  }
}