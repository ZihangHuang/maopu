const { uploadToken } = require('../common/qiniu-handle')
const { domain } = require('../config').qiniu

exports.getQiniuToken = async ctx => {
  let body = ctx.request.body
  let token = uploadToken(body.key)
  if(token) {
    ctx.body = {
      code: 1,
      msg: 'success',
      data: {
        token,
        domain
      }
    }
  }else{
    ctx.body = {
      code: 0,
      msg: '获取qiniuToken失败',
      data: {}
    }
  }
}
