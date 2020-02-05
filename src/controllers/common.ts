import { promiseAll } from '../common/tools';
import {
  Context,
  GetListProxy,
  GetCountProxy,
  ResBody,
  ResBodyList,
} from '../types';

export type getListCb = (
  query1?: any,
  query2?: any,
) => Promise<ResBody | ResBodyList>;

/**
 * 封装获取某个数据列表及长度
 * @param ctx      [koa的ctx对象]
 * @param getList  [获取数据列表方法]
 * @param getCount [获取数据长度方法]
 * @return
 * @param query [过滤值等，传给getList第1个参数]
 * @param query [过滤值等，传给getCount第1个参数]
 */
export const getListAndCount = <T>(
  ctx: Context,
  getList: GetListProxy,
  getCount: GetCountProxy,
): getListCb => {
  const body = ctx.request.body;
  const pageNo = body.pageNo || 1;
  const pageSize = body.pageSize || 10;
  const skip = (pageNo - 1) * pageSize;

  return async (query1?: any, query2?: any) => {
    const datas = await promiseAll<T[] | number | undefined>(
      getList(query1, skip, pageSize),
      getCount(query2) as any,
    );

    if (datas.length > 1 && Array.isArray(datas[0])) {
      const resbody: ResBodyList = {
        code: 1,
        msg: 'success',
        data: {
          list: datas[0],
          _pageNo: pageNo,
          _pageSize: pageSize,
          _total: datas[1] as number,
          _totalPage: Math.ceil((datas[1] as number) / pageSize),
        },
      };

      return (ctx.body = resbody);
    }

    const resbody: ResBody = {
      code: 0,
      msg: '暂无数据',
      data: {},
    };
    return (ctx.body = resbody);
  };
};
