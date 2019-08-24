const Router = require('koa-router')

let web_router = require('./web-router')
let api_router = require('./api-router')

let router = new Router()

router.use(web_router.routes()).use(web_router.allowedMethods())
router.use('/api', api_router.routes()).use(api_router.allowedMethods())

router.all('404', '*', ctx => {
  ctx.status = 404
  ctx.body = '404'
})

module.exports = router

/**
 * 正确的响应信息：{code: 1, msg: 'success', data: {}}
 * 数据库返回null(没有查到该数据，或者因此而添加失败等)：{ code: 0, msg: '无此数据', data: {} }
 * 未登录：{ code: -1, msg: '未登录', data: {} }
 * 一般错误的响应信息：{code: -2, msg: '密码错误', data: {}}
 * 请求参数不正确或者缺少：{code: -10, msg: '缺少……', data: {}}
 */