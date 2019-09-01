const { Message } = require('../proxy')
const { getListAndCount } = require('./common')

exports.getMessagesByUserId = ctx =>
  getListAndCount(ctx, Message.getMessagesByUserId, Message.getMessagesCount)(
    ctx.request.body.userId,
    ctx.request.body.userId
  )

exports.getUnReadMessagesCount = async ctx => {
  let res = await Message.getUnReadMessagesCount(ctx.request.body.userId)

  return (ctx.body = {
    code: 1,
    msg: 'success',
    data: {
      count: res
    }
  })
}

//设置所有消息为已读
exports.setMessagesToHasRead = async ctx => {
  let res = await Message.setMessagesToHasRead(ctx.request.body.userId)

  if (res) {
    if (res.nModified > 0) {
      return (ctx.body = {
        code: 1,
        msg: 'success',
        data: {}
      })
    } else {
      return (ctx.body = {
        code: 0,
        msg: '当前无未读消息',
        data: {}
      })
    }
  }
  return (ctx.body = {
    code: 0,
    msg: '设置失败',
    data: {}
  })
}
