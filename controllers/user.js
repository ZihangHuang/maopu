const { User } = require('../proxy')
const { encrypt } = require('../common/tools')

exports.getUser = async ctx => {
  let userInfo = await User.getUserById(ctx.userId)
  if (userInfo) {
    ctx.body = {
      code: 1,
      msg: 'success',
      data: userInfo
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '暂无此用户信息',
      data: {}
    }
  }
}

exports.updateUser = async ctx => {
  let body = ctx.request.body
  let username = body.username
  let password = body.password
  let _id = ctx.userId
  if (!_id) return (ctx.body = { code: -1, msg: '未登录', data: {} })
  if (!username)
    return (ctx.body = { code: -10, msg: '缺少用户名', data: {} })
  if (!password) return (ctx.body = { code: -10, msg: '缺少密码', data: {} })
  
  body._id = _id
  body.password = encrypt(body.password)

  let res = await User.updateUser(body)

  if (res && res.ok) {
    ctx.body = {
      code: 1,
      msg: '修改成功',
      data: {}
    }
  }else { //undefined
    ctx.body = {
      code: 0,
      msg: '修改失败或无此用户',
      data: {}
    }
  }
}
