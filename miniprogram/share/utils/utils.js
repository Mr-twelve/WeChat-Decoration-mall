function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getExt(filePath) {
  //获取最后一个.的位置
  var index = filePath.lastIndexOf(".");
  //获取后缀
  var ext = filePath.substr(index + 1);
  return ext;
}

export {
  getUUID,
  getExt
}