import mongoose from 'mongoose';
export * from './user';
export * from './topic';
export * from './reply';
export * from './message';
import config from '../config';
import { loggerTrace, loggerError } from '../common/logger';

export type ObjectId = mongoose.Types.ObjectId;

const { host, port, database } = config.mongodb;
const uri = `mongodb://${host}:${port}/${database}`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', err => {
  console.log('connect to %s error: ', uri, err.message);
  loggerError.error('connect to %s error: ', uri, err.message);
  process.exit(1);
});

// 打印日志
const traceMQuery = function(
  method: string,
  info: AnyObject,
  query: AnyObject,
): Function {
  return function(err: any, result: AnyObject, millis: number): void {
    if (err) {
      loggerError.error('traceMQuery error:', err);
    }
    const infos: string[] = [];
    infos.push(query._collection.collection.name + '.' + method);
    infos.push(JSON.stringify(info));
    infos.push('\nresult: ' + JSON.stringify(result));
    infos.push(millis + 'ms');

    loggerTrace.debug('mongoose - ', infos.join(' '));
  };
};
mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery);
