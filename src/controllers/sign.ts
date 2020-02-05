import jwt from 'jsonwebtoken';
import * as User from '../proxy/user';
import config from '../config';
import { encrypt, check } from '../common/tools';
import { KoaControllerReturnBody } from '../types';

const { secretOrKey, tokenExpire } = config;

export const login: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;
  const username = body.username;
  const password = body.password;
  if (!username) return (ctx.body = { code: -10, msg: '缺少用户名', data: {} });
  if (!password) return (ctx.body = { code: -10, msg: '缺少密码', data: {} });

  const userInfo = await User.getUserByUsername(username);
  if (!userInfo) return (ctx.body = { code: 0, msg: '无此用户', data: {} });

  const isTrue = check(password, userInfo.password);

  if (!isTrue) return (ctx.body = { code: -2, msg: '密码错误', data: {} });

  const payload = {
    //username: username,
    userId: userInfo._id,
    //expire: new Date().getTime() + tokenExpire * 1000
  };
  const token = jwt.sign(payload, secretOrKey, {
    expiresIn: tokenExpire,
  });
  return (ctx.body = { code: 1, msg: 'success', data: { token } });
};

export const register: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;
  if (!body.username)
    return (ctx.body = { code: -10, msg: '缺少用户名', data: {} });
  if (!body.password)
    return (ctx.body = { code: -10, msg: '缺少密码', data: {} });

  if (body.username.length < 4)
    return (ctx.body = { code: -2, msg: '用户名不能少于4位', data: {} });
  if (body.password.length < 6)
    return (ctx.body = { code: -2, msg: '密码不能少于6位', data: {} });

  const oldUsers = await User.getUserByUsername(body.username, true);
  if (oldUsers && oldUsers.length > 0) {
    return (ctx.body = { code: -2, msg: '此用户名已被占用', data: {} });
  }

  const userInfo = {
    nickname: '新用户',
    ...body,
    password: encrypt(body.password),
    level: 1,
    reputation: 1,
  };
  const res = await User.addUser(userInfo);

  if (res) {
    return (ctx.body = { code: 1, msg: '注册成功', data: {} });
  } else {
    return (ctx.body = { code: 0, msg: '注册失败，请稍后再试', data: {} });
  }
};

//鉴权
export const authentication: KoaControllerReturnBody = async ctx => {
  return (ctx.body = { code: 1, msg: '验证成功', data: {} });
};
