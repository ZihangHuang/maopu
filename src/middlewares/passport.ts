import passport from 'koa-passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import config from '../config';
import { KoaMiddleware, JwtPayload } from '../types';

const secretOrKey = config.secretOrKey;

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey,
};

// 用于鉴权
passport.use(
  new JwtStrategy(opts, function(jwtPayload: JwtPayload, done) {
    // console.log('JwtStrategy', jwtPayload)
    done(null, jwtPayload, {}); // 可以在passport.authenticate的第三个参数传入回调接收这个三个参数
  }),
);

export default passport;

export const jwtAuthentication: KoaMiddleware = async (ctx, next) => {
  // 自定义处理函数，不然默认返回401状态码
  const payload: JwtPayload = await new Promise(resolve => {
    passport.authenticate('jwt', { session: false }, (err, payload, info) => {
      if (err) throw err;
      resolve(payload);
    })(ctx, next);
  });

  if (!payload) {
    ctx.body = { code: -1, msg: '未登录', data: {} };
    return;
  }
  //ctx.username = payload.username
  ctx.userId = payload.userId;
  await next();
};
