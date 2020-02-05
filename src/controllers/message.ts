import { getListAndCount } from './common';
import * as Message from '../proxy/message';
import { MessageDocument } from '../models';
import { KoaControllerReturnBody } from '../types';

export const getMessagesByUserId: KoaControllerReturnBody = ctx =>
  getListAndCount<MessageDocument>(
    ctx,
    Message.getMessagesByUserId,
    Message.getMessagesCount,
  )(ctx.request.body.userId, ctx.request.body.userId);

export const getUnReadMessagesCount: KoaControllerReturnBody = async ctx => {
  const res = await Message.getUnReadMessagesCount(ctx.request.body.userId);

  return (ctx.body = {
    code: 1,
    msg: 'success',
    data: {
      count: res,
    },
  });
};

/**
 * 设置所有消息为已读
 */
export const setMessagesToHasRead: KoaControllerReturnBody = async ctx => {
  const res = await Message.setMessagesToHasRead(ctx.request.body.userId);

  if (res) {
    if (res.nModified > 0) {
      return (ctx.body = {
        code: 1,
        msg: 'success',
        data: {},
      });
    } else {
      return (ctx.body = {
        code: 0,
        msg: '当前无未读消息',
        data: {},
      });
    }
  }
  return (ctx.body = {
    code: 0,
    msg: '设置失败',
    data: {},
  });
};
