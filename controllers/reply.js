const { Reply } = require('../proxy')
const { getListAndCount } = require('./common')

exports.addReply = async ctx => {
  let body = ctx.request.body
  let res = await Reply.addReply(
    body.content,
    body.topicId,
    ctx.userId,
    body.replyId,
    body.replyAuthor
  )

  if (res) {
    return (ctx.body = {
      code: 1,
      msg: '回复成功',
      data: res
    })
  }
  return (ctx.body = {
    code: 0,
    msg: '回复失败',
    data: {}
  })
}

exports.getRepliesByTopicId = ctx =>
  getListAndCount(ctx, Reply.getRepliesByTopicId, Reply.getReplyCountByTopicId)(
    ctx.request.body.topicId,
    ctx.request.body.topicId
  )

exports.deleteReply = async ctx => {
  let body = ctx.request.body
  let res = await Reply.removeReply(body.replyId)

  if (res) {
    return (ctx.body = {
      code: 1,
      msg: '删除成功',
      data: {}
    })
  }
  return (ctx.body = {
    code: 0,
    msg: '删除失败',
    data: {}
  })
}