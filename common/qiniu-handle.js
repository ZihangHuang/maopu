const qiniu = require('qiniu')
const { accessKey, secretKey, bucket } = require('../config').qiniu

let mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

exports.uploadToken = key => {
  let options = {}
  if(key) {
    options.scope = bucket + ':' + key
  }else {
    options.scope = bucket
  }
  
  let putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}