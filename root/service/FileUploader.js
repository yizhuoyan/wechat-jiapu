const RECENT_PHOTO_DIR ="recent-photo/";
function FileUploader() { }
/**
 * 上传文件近照
 * @param {String} filePath 本地近照路径
 */
FileUploader.prototype.uploadRecentPhoto = function (filePath) {
 // console.log(filePath);
  if (filePath.startsWith("cloud://")){
    return Promise.resolve(filePath);
  }
  return new Promise(function(ok, fail) {
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: RECENT_PHOTO_DIR + String.uuid(),
      // 指定要上传的文件的小程序临时文件路径
      filePath: filePath,
      // 成功回调
      success: res => {
        console.trace('上传近照成功');
        ok(res.fileID);
      },
      fail: err => {
        console.err.log(err);
        fail(err);
      }
    });
  });

};
FileUploader.prototype.deleteFile = function(fileId){
  wx.cloud.deleteFile({
    fileList: [fileId]
  }).then(res => {
    
    console.log(res.fileList)
  }).catch(error => {
    // handle error
  })
} 
module.exports = FileUploader;