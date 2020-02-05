import moment from 'moment';
import crypto from 'crypto';
import { Query } from 'mongoose';

moment.locale('en-us');

export function setFormatDate(date: Date | string, fromNow?: boolean): string {
  const rDate = moment(date);
  if (fromNow) {
    return rDate.fromNow();
  } else {
    return rDate.format('YYYY-MM-DD HH:mm');
  }
}

export function getFormatDate(fromNow?: boolean): string {
  if (fromNow) {
    return moment().fromNow();
  } else {
    return moment().format('YYYY-MM-DD HH:mm');
  }
}

export function encrypt(val: string): string {
  return crypto
    .createHash('sha256')
    .update(val)
    .digest('hex');
}

export function check(val: string, encryptVal: string): boolean {
  return encrypt(val) === encryptVal;
}

export function getRandom(n: number): string {
  let rnd = '';
  for (let i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10);
  return rnd;
}

export function promiseAll<T = any>(
  ...promises: Array<Promise<T> | Query<T>>
): Promise<T[]> {
  return Promise.all(promises);
}
