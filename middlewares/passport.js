const passport = require('koa-passport')
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt
const { secretOrKey } = require('../config')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretOrKey

// 用于鉴权
passport.use(
  new JwtStrategy(opts, function(jwt_payload, done) {
    //console.log('JwtStrategy', jwt_payload)
    done(null, jwt_payload, {}) //可以在passport.authenticate的第三个参数传入回调接收这个三个参数
  })
)
exports = module.exports = passport

// 导出中间件
exports.isJwtAuthenticated = async (ctx, next) => {
  // 自定义处理函数，不然默认返回401状态码
  let payload = await new Promise(resolve => {
    passport.authenticate('jwt', { session: false }, (err, payload, info) => {
      if (err) throw err
      resolve(payload)
    })(ctx, next)
  })

  if (!payload) {
    ctx.body = { code: -1, msg: '未登录', data: {} }
    return
  }
  //ctx.username = payload.username
  ctx.userId = payload.userId
  await next()
}
