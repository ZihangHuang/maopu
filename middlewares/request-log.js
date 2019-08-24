const { loggerTrace } = require('../common/logger')

//const ignore = /^\/(public)/

module.exports = () => async (ctx, next) => {
  //if(ignore.test(ctx.url)) return next()

  let date = new Date()
  loggerTrace.info('request - Started', ctx.url, ctx.method, ctx.ip)

  await next()

  let duration = (new Date()) - date
  loggerTrace.info('request - Completed', ctx.url, ctx.response.status, '(' + duration + 'ms)')
}