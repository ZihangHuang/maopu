import log4js from 'log4js';
import path from 'path';

log4js.configure({
  appenders: {
    trace: {
      type: 'dateFile',
      filename: path.resolve(__dirname, '../../logs/trace'),
      maxLogSize: 1024 * 1024,
      backup: 3,
      category: 'trace',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    error: {
      type: 'dateFile',
      filename: path.resolve(__dirname, '../../logs/error'),
      maxLogSize: 1024 * 1024,
      backup: 3,
      category: 'error',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
  },
  categories: {
    default: { appenders: ['trace'], level: 'trace' },
    error: { appenders: ['error'], level: 'error' },
  },
});

export const loggerTrace = log4js.getLogger('trace');

export const loggerError = log4js.getLogger('error');
