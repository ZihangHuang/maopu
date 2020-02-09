import Koa from 'koa';
import config from './config';
import bodyParser from 'koa-bodyparser';
import passport from './middlewares/passport';
import { loggerError } from './common/logger';
import requestLog from './middlewares/request-log'; // 请求日志
import exceptionHandle from './middlewares/exception-handle'; // 异常处理
import corsHandle from './middlewares/cors-handle'; // 设置跨域等
import router from './routers';
import './models';

const app = new Koa();

//记录请求
app.use(requestLog());

//异常处理
app.use(exceptionHandle());

//app.keys = ['secret key']
app.use(bodyParser());
// app.use(session({cookie: { secure: false, maxAge: 86400000 }},app))
app.use(passport.initialize());
//app.use(passport.session())

app.on('error', (err: any) => {
  loggerError.error(err);
});

//设置跨域和响应头
app.use(corsHandle());

//路由
app.use(router.routes()).use(router.allowedMethods());

console.log('listening at port:' + config.port);

export default app.listen(config.port);
