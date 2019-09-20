module.exports = {
  // debug 为 true 时，用于本地调试
  debug: true,

  port: 8889,

  secretOrKey: 'my secret',
  tokenExpire: 3600 * 3, //单位秒
  
  mongodb: {
    host: '127.0.0.1',
    port: '27017',
    database: 'maopu_dev'
  },

  //七牛
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    domain: ''
  }
}
