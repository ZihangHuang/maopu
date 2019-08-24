const allowHeaders = 'Origin, X-Requested-With, Content-Type, Accept, Access-Token, Authorization'

module.exports = () => async (ctx, next) => {
  // ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
  // ctx.set('Access-Control-Allow-Credentials', true)
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Content-Type', 'application/json; charset=utf-8')
  ctx.set('Access-Control-Allow-Headers', allowHeaders)

  //预检请求
  if (ctx.method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
    ctx.set('Access-Control-Max-Age', 3600 * 24)
    // 当为预检时，直接返回204,代表空响应体
    ctx.status = 204
    ctx.body = ''
  } else {
    await next() // 如果请求类型为非预检请求，则进入下一个中间件
  }
}
