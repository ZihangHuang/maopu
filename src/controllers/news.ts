import * as Topic from '../proxy/topic';
import { TopicDocument } from '../models';
import { KoaController, KoaControllerReturnBody } from '../types';
import { getListAndCount } from './common';

export const getNewsList: KoaController = ctx =>
  getListAndCount<TopicDocument>(
    ctx,
    Topic.getNewsList,
    Topic.getTopicCount,
  )(
    { isNews: true, deleted: false, hasFocusPic: false },
    { isNews: true, deleted: false, hasFocusPic: false },
  );

/**
 * 获取首页轮播图
 */
export const getNewsHasFocusPic: KoaControllerReturnBody = async ctx => {
  const res = await Topic.getNewsList(
    { isNews: true, deleted: false, hasFocusPic: true },
    0,
    3,
  );
  if (res) {
    return (ctx.body = {
      code: 1,
      msg: 'success',
      data: {
        list: res,
        _pageNo: 1,
        _pageSize: res.length,
        _total: res.length,
        _totalPage: 1,
      },
    });
  }

  return (ctx.body = {
    code: 0,
    msg: '暂无数据',
    data: {},
  });
};

export const addNews: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;

  if (!body.title) {
    return (ctx.body = {
      code: 0,
      msg: '缺少title',
      data: {},
    });
  } else if (!body.content) {
    return (ctx.body = {
      code: 0,
      msg: '缺少title',
      data: {},
    });
  } else if (!body.tab) {
    return (ctx.body = {
      code: 0,
      msg: '缺少tab',
      data: {},
    });
  }

  const newNews: Topic.TopicAddData = {
    title: body.title,
    content: body.content,
    author: ctx.userId!,
    tab: body.tab,
  };
  //焦点图
  if (body.focusPic) newNews.focusPic = body.focusPic;

  const res = await Topic.addNews(newNews);
  if (res) {
    return (ctx.body = {
      code: 1,
      msg: '发布成功',
      data: {},
    });
  }
  return (ctx.body = {
    code: 0,
    msg: '发布失败',
    data: {},
  });
};
