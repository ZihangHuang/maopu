const { Topic } = require('../proxy')
// const { promiseAll } = require('../common/tools')
const { getListAndCount } = require('./common')
// const { getTopicDetail } = require('./topic')

exports.getNewsList = ctx =>
  getListAndCount(ctx, Topic.getNewsList, Topic.getTopicCount)(
    { isNews: true, deleted: false, hasFocusPic: false },
    { isNews: true, deleted: false, hasFocusPic: false }
  )

/**
 * 获取首页轮播图
 */
exports.getNewsHasFocusPic = async ctx => {
  let res = await Topic.getNewsList(
    { isNews: true, deleted: false, hasFocusPic: true },
    0,
    3
  )
  if (res) {
    return (ctx.body = {
      code: 1,
      msg: 'success',
      data: {
        list: res,
        _pageNo: 1,
        _pageSize: res.length,
        _total: res.length,
        _totalPage: 1
      }
    })
  }

  return (ctx.body = {
    code: 0,
    msg: '暂无数据',
    data: {}
  })
}


exports.addNews = async ctx => {
  let body = ctx.request.body

  let newNews = {
    title: body.title,
    content: body.content,
    author: ctx.userId,
    tab: body.tab
  }
  //焦点图
  if (body.focusPic) newNews.focusPic = body.focusPic

  let res = await Topic.addNews(newNews)
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
