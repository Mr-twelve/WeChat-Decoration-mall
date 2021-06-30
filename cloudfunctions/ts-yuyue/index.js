const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    const addResult = await cloud.openapi.templateMessage.addTemplate({
      id: 'AT0104',
      keywordIdList: [3, 4]
    })
    const templateId = addResult.templateId //新增的模版id

    const result = await cloud.openapi.templateMessage.send({
      touser: 'oJYjN4iW9P5BSQ1un9pAZE0KpjGQ',
      data: {
        keyword1: {
          value: '339208499'
        },
        keyword2: {
          value: '2015年01月05日 12:30'
        }
      },
      templateId,
      formId: event.formId,
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}