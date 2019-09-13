const { Topic } = require('../proxy')
// const { promiseAll } = require('../common/tools')
const { getListAndCount } = require('./common')


exports.getTopicList = ctx =>
  getListAndCount(ctx, Topic.getTopicList, Topic.getTopicCount)()

exports.getTopicDetail = async ctx => {
  let body = ctx.request.body
  let data = await Topic.getTopicFullById(body._id)
  
  if (!data) {
    return (ctx.body = {
      code: 0,
      msg: '暂无数据',
      data: {}
    })
  }

  return (ctx.body = {
    code: 1,
    msg: 'success',
    data: data
  })
}

exports.addTopic = async ctx => {
  let body = ctx.request.body

  let newTopic = {
    title: body.title,
    content: body.content,
    author: ctx.userId,
    tab: body.tab
  }
  let res = await Topic.addTopic(newTopic)
  if (res) {
    return (ctx.body = {
      code: 1,
      msg: '发布成功',
      data: {}
    })
  }
  return (ctx.body = {
    code: 0,
    msg: '发布失败',
    data: {}
  })
}
