export interface IMongodbConfig {
  host: string;
  port: string;
  database: string;
}

export interface IQiniuConfig {
  accessKey: string;
  secretKey: string;
  bucket: string;
  domain: string;
}

export interface IConfig {
  debug: boolean;
  port: number;
  secretOrKey: string;
  tokenExpire: number;
  mongodb: IMongodbConfig;
  qiniu: IQiniuConfig;
}

const config: IConfig = {
  // debug 为 true 时，用于本地调试
  debug: true,

  port: 8889,

  secretOrKey: 'my secret',
  tokenExpire: 3600 * 3, //单位秒

  mongodb: {
    host: '127.0.0.1',
    port: '27017',
    database: 'maopu_dev',
  },

  //七牛
  qiniu: {
    accessKey: '',
    secretKey: '',
    bucket: '',
    domain: '',
  },
};

export default config;
