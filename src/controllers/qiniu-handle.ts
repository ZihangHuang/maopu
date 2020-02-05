import { uploadToken } from '../common/qiniu-handle';
import config from '../config';
import { KoaControllerReturnBody } from '../types';

const { domain } = config.qiniu;

export const getQiniuToken: KoaControllerReturnBody = async ctx => {
  const body = ctx.request.body;
  const token = uploadToken(body.key);
  if (token) {
    return (ctx.body = {
      code: 1,
      msg: 'success',
      data: {
        token,
        domain,
      },
    });
  }
  return (ctx.body = {
    code: 0,
    msg: '获取qiniuToken失败',
    data: {},
  });
};
