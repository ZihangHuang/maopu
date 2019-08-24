exports.index = async ctx => {
  if (ctx.req.user) {
    let username = ctx.req.user.username
    ctx.body = {
      content: '我是index',
      user: username
    }
  } else {
    ctx.body = 'token error'
  }
}
