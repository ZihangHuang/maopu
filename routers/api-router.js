const Router = require('koa-router')

let router = new Router()

router.get('/', ctx => {
  ctx.body = 'api'
})

router.get('/123', ctx => {
  ctx.body = 'api123'
})

module.exports = router
