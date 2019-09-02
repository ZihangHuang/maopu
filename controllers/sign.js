const jwt = require('jsonwebtoken')
const { secretOrKey, tokenExpire } = require('../config')
const { User } = require('../proxy')
const { encrypt, check } = require('../common/tools')

exports.login = async ctx => {
  let body = ctx.request.body
  let username = body.username
  let password = body.password
  if (!username) return (ctx.body = {code: -10, msg: '缺少用户名', data: {}})
  if (!password) return (ctx.body = {code: -10, msg: '缺少密码', data: {}})

  let userInfo = await User.getUserByUsername(username)
  if(!userInfo)  return ctx.body = {code: 0, msg: '无此用户', data: {}}

  let isTrue = check(password, userInfo.password)

  if(!isTrue) return ctx.body = {code: -2, msg: '密码错误', data: {}}

  let payload = {
    //username: username,
    userId: userInfo._id
    //expire: new Date().getTime() + tokenExpire * 1000
  }
  let token = jwt.sign(payload, secretOrKey, {
    expiresIn: tokenExpire
  })
  ctx.body = {code: 1, msg: 'success', data: {token}}
}

exports.register = async ctx => {
  let body = ctx.request.body
  if (!body.username) return (ctx.body = {code: -10, msg: '缺少用户名', data: {}})
  if (!body.password) return (ctx.body = {code: -10, msg: '缺少密码', data: {}})

  if(body.username.length < 4) return ctx.body = {code: -2, msg: '用户名不能少于4位', data: {}}
  if(body.password.length < 6) return ctx.body = {code: -2, msg: '密码不能少于6位', data: {}}
  
  let oldUsers = await User.getUserByUsername(body.username, true)
  if(oldUsers && oldUsers.length > 0) {
    return ctx.body = {code: -2, msg: '此用户名已被占用', data: {}}
  }

  let userInfo = {
    nickname: '新用户',
    ...body,
    password: encrypt(body.password),
    level: 1,
    reputation: 1
  }
  let res = await User.addUser(userInfo)
  
  if(res) {
    ctx.body = {code: 1, msg: '注册成功', data: {}}
  }else{
    ctx.body = {code: 0, msg: '注册失败，请稍后再试', data: {}}
  }
}

//鉴权
exports.authentication = async ctx => {
  ctx.body = { code: 1, msg: '验证成功', data: {}}
}
