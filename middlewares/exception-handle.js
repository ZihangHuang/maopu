const config = require('../config')

module.exports = () => async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = config.debug ? err.message : 'Server Internal Error'
    ctx.app.emit('error', err)
  }
}