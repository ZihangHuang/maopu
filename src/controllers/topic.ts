import * as Topic from '../proxy/topic';
import * as Message from '../proxy/message';
import * as Reply from '../proxy/reply';
import { TopicDocument } from '../models';
import { KoaController, ResBody, KoaControllerReturnBody } from '../types';
import { getListAndCount } from './common';
import { promiseAll } from '../common/tools';

export const getTopicList: KoaController = ctx =>
  getListAndCount<TopicDocument>(
    ctx,
    Topic.getTopicList,
    Topic.getTopicCount,
  )();

export const getTopicDetail: KoaController = async ctx => {
  const body = ctx.request.body;

  let resbody: ResBody;

  if (!body._id) {
    resbody = {
      code: 0,
      msg: '缺少topicId',
      data: {},
    };

    return (ctx.body = resbody);
  }

  const data = await Topic.getTopicFullById(body._id);

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

export const deleteTopic: KoaController = async ctx => {
  const topicId = ctx.request.body.topicId;

  if (!topicId) {
    return (ctx.body = {
      code: 0,
      msg: '缺少topicId',
      data: {},
    });
  }

  const res1 = await Topic.deleteTopic(topicId);

  if (res1 && res1.ok) {
    ctx.body = {
      code: 1,
      msg: '删除成功',
      data: {},
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '删除失败',
      data: {},
    };
  }

  await promiseAll(
    Reply.deleteRepliesByTopicId(topicId)!,
    Message.deleteMessageByTopicId(topicId)!,
  );
};
