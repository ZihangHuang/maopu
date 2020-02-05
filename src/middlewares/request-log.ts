import { loggerTrace } from '../common/logger';
import { KoaMiddleware } from '../types';

//const ignore = /^\/(public)/

export default (): KoaMiddleware => async (ctx, next) => {
  //if(ignore.test(ctx.url)) return next()

  const date = new Date();
  loggerTrace.info('request - Started', ctx.url, ctx.method, ctx.ip);

  await next();

  const duration = new Date().getTime() - date.getTime();
  loggerTrace.info(
    'request - Completed',
    ctx.url,
    ctx.response.status,
    '(' + duration + 'ms)',
  );
};
