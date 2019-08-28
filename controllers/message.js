const { Message } = require('../proxy')
const { getListAndCount } = require('./common')

exports.getMessagesByUserId = ctx =>
  getListAndCount(ctx, Message.getMessagesByUserId, Message.getMessagesCount)(
    ctx.request.body.userId,
    ctx.request.body.userId
  )

exports.getUnReadMessagesCount = async ctx => {
  let res = await Message.getUnReadMessagesCount(ctx.request.body.userId)

  if (res) {
    return (ctx.body = {
      code: 1,
      msg: 'success',
      data: res
    })
  }
  return (ctx.body = {
    code: 0,
    msg: '暂无数据',
    data: {}
  })
}