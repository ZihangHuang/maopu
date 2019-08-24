const Koa = require('koa')
const config = require('./config')
const bodyParser = require('koa-bodyparser')
// const querystring = require('querystring');
//const session = require('koa-session')
const passport = require('./middlewares/passport')
const { loggerError } = require('./common/logger')
const requestLog = require('./middlewares/request-log') //请求日志
const exceptionHandle = require('./middlewares/exception-handle') //异常处理
const headerHandle = require('./middlewares/header-handle') //设置跨域等
require('./models')

const app = new Koa()

//app.keys = ['secret key']
app.use(bodyParser())
// app.use(session({cookie: { secure: false, maxAge: 86400000 }},app))
app.use(passport.initialize())
//app.use(passport.session())

//记录请求
app.use(requestLog())

//异常处理
app.use(exceptionHandle())
app.on('error', err => {
  loggerError.error(err)
})

//设置跨域和响应头
app.use(headerHandle())

//路由
let router = require('./routers')
app.use(router.routes()).use(router.allowedMethods())

app.listen(config.port)

console.log('listening at port:' + config.port)
