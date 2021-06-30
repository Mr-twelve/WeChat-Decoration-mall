// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

const got = require("got");

const request = require("request-promise");

const APPID = "wx4bad47ca1e7fb97f"
const APPSECRET = "9a7db7d1ba68d5d9998fc205c06b9b44"

const TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + APPID + "&secret=" + APPSECRET

const CHECK_URL = "https://api.weixin.qq.com/wxa/msg_sec_check?access_token="

/////////////图片检测/////////////
const PICTURE_URL = "https://api.weixin.qq.com/wxa/img_sec_check?access_token="
/////////////图片检测/////////////

// 云函数入口函数
exports.main = async (event, context) => {
  const content = event.content;
  const author = event.author;
  const location = event.location;
  const images = event.images;
  const video = event.video;
  const device = event.device;

  const tokenResp = await got(TOKEN_URL);
  const tokenBody = JSON.parse(tokenResp.body);
  const token = tokenBody.access_token;
  ///////////incorrect header check错误解决办法///////////////////
  const checkResp = await request.post({
    uri: CHECK_URL + token,
    body: {
      content: content
    },
    json: true
  });
  console.log("==========");
  console.log(checkResp);
  console.log("==========");
  const errcode = checkResp.errcode;
  ///////////incorrect header check错误解决办法///////////////////



  if (errcode == 0) {
    return await db.collection("Cai-weibo").add({
      data: {
        content: content,
        location: location,
        author: author,
        images: images,
        video: video,
        create_time: db.serverDate(),
        device: device
      }
    })
  } else {
    return {
      "errcode": 1,
      "errmsg": "您的文字含有敏感词汇，请修改发布"
    }
  }
}