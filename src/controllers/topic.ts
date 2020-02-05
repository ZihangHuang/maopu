import * as Topic from '../proxy/topic';
import { TopicDocument } from '../models';
import { KoaController, ResBody, KoaControllerReturnBody } from '../types';
import { getListAndCount } from './common';

export const getTopicList: KoaController = ctx =>
  getListAndCount<TopicDocument>(
    ctx,
    Topic.getTopicList,
    Topic.getTopicCount,
  )();

export const getTopicDetail: KoaController = async ctx => {
  const body = ctx.request.body;
  const data = await Topic.getTopicFullById(body._id);

  let resbody: ResBody;

  if (!data) {
    resbody = {
      code: 0,
      msg: '暂无数据',
      data: {},
    };
  } else {
    resbody = {
      code: 1,
      msg: 'success',
      data: data,
    };
  }

  return (ctx.body = resbody);
};

export const addTopic: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;

  const newTopic = {
    title: body.title,
    content: body.content,
    author: ctx.userId!,
    tab: body.tab,
  };
  const res = await Topic.addTopic(newTopic);
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
