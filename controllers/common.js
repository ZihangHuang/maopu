const { promiseAll } = require('../common/tools')


/**
 * 封装获取某个数据列表及长度
 * @param  {Object} ctx      [koa的ctx对象]
 * @param  {Function} getList  [获取数据列表方法]
 * @param  {Function} getCount [获取数据长度方法]
 * @return {[Function]}
 * @param {Any} query [过滤值等，传给getList第1个参数]
 * @param {Any} query [过滤值等，传给getCount第1个参数]
 */
exports.getListAndCount = (ctx, getList, getCount) => {
  let body = ctx.request.body
  let pageNo = body.pageNo || 1
  let pageSize = body.pageSize || 10
  let skip = (pageNo - 1) * pageSize

  return async (query1, query2) => {
    let datas = await promiseAll(getList(query1, skip, pageSize), getCount(query2))

    if (datas.length < 2) {
      return (ctx.body = {
        code: 0,
        msg: '暂无数据',
        data: {}
      })
    }
    
    return (ctx.body = {
      code: 1,
      msg: 'success',
      data: {
        list: datas[0],
        _pageNo: pageNo,
        _pageSize: pageSize,
        _total: datas[1],
        _totalPage: Math.ceil(datas[1] / pageSize)
      }
    })
  }
}
