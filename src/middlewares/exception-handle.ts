import config from '../config';
import { KoaMiddleware } from '../types';

export default (): KoaMiddleware => async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = config.debug ? err.message : 'Server Internal Error';
    ctx.app.emit('error', err);
  }
};
