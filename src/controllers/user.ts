import * as User from '../proxy/user';
import { encrypt } from '../common/tools';
import { KoaControllerReturnBody } from '../types';

export const getUser: KoaControllerReturnBody = async ctx => {
  const userInfo = await User.getUserById(ctx.userId!);
  if (userInfo) {
    return (ctx.body = {
      code: 1,
      msg: 'success',
      data: userInfo,
    });
  } else {
    return (ctx.body = {
      code: 0,
      msg: '暂无此用户信息',
      data: {},
    });
  }
};

export const updateUser: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;
  const username = body.username;
  const password = body.password;
  const _id = ctx.userId;
  if (!_id) return (ctx.body = { code: -1, msg: '未登录', data: {} });
  if (!username) return (ctx.body = { code: -10, msg: '缺少用户名', data: {} });
  if (!password) return (ctx.body = { code: -10, msg: '缺少密码', data: {} });

  body._id = _id;
  body.password = encrypt(body.password);

  const res = await User.updateUser(body);

  if (res && res.ok) {
    return (ctx.body = {
      code: 1,
      msg: '修改成功',
      data: {},
    });
  } else {
    //undefined
    return (ctx.body = {
      code: 0,
      msg: '修改失败或无此用户',
      data: {},
    });
  }
};
