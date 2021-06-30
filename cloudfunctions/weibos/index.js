// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID;

  const start = event.start;
  let promise = db.collection("Cai-weibo");
  if (start > 0) {
    promise = promise.skip(start);
  }
  const weiboRes = await promise.limit(10).orderBy("create_time", "desc").get()
  const weibos = weiboRes.data;
  if (weibos.length > 0) {
    weibos.forEach((weibo, index) => {
      weibo.isPraised = false;
      if (weibo.praises && weibo.praises.length > 0) {
        weibo.praises.forEach((praise, index) => {
          if (praise == openId) {
            weibo.isPraised = true;
          }
        })
      }
    })
  }
  return {
    weibos
  }
}