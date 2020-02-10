import { KoaController, KoaControllerReturnBody } from '../types';
import { getListAndCount } from './common';
import { ReplyDocument } from '../models';
import * as Reply from '../proxy/reply';

export const addReply: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;
  const res = await Reply.addReply(
    body.content,
    body.topicId,
    ctx.userId!,
    body.replyId,
    body.replyAuthor,
  );

  if (res) {
    return (ctx.body = {
      code: 1,
      msg: '回复成功',
      data: res,
    });
  }
  return (ctx.body = {
    code: 0,
    msg: '回复失败',
    data: {},
  });
};

export const getRepliesByTopicId: KoaController = ctx =>
  getListAndCount<ReplyDocument>(
    ctx,
    Reply.getRepliesByTopicId,
    Reply.getReplyCountByTopicId,
  )(ctx.request.body.topicId, ctx.request.body.topicId);

export const deleteReply: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;

  if (!body.replyId) {
    return (ctx.body = {
      code: 0,
      msg: '缺少replyId',
      data: {},
    });
  }

  const res = await Reply.deleteReply(body.replyId);

  if (res) {
    return (ctx.body = {
      code: 1,
      msg: '删除成功',
      data: {},
    });
  }

  return (ctx.body = {
    code: 0,
    msg: '删除失败',
    data: {},
  });
};
