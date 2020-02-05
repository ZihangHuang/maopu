import { Next } from 'koa';
import { Query } from 'mongoose';
export { Next } from 'koa';
import mongodb from 'mongodb';
import { RouterContext } from 'koa-router';
import { ObjectId } from '../models';

export interface JwtPayload {
  userId?: ObjectId;
  username?: string;
  expire?: number;
}

export type Context = RouterContext & JwtPayload;

export type KoaMiddleware = (ctx: Context, next: Next) => Promise<any>;

export type KoaController = (ctx: Context, next?: Next) => any;
export type KoaControllerReturnBody = (
  ctx: Context,
  next?: Next,
) => Promise<ResBody | ResBodyList>;

export interface GetListProxy {
  (query?: any, skip?: number, pageSize?: number): Promise<any[] | undefined>;
}

export interface GetCountProxy {
  (query: any): Query<number> | undefined;
}

export interface ResBody {
  code: number;
  msg: string;
  data: any;
}

export interface ResBodyList extends ResBody {
  data: {
    list: any[];
    _pageNo: number;
    _pageSize: number;
    _total: number;
    _totalPage: number;
  };
}

// mongodb
export type RemoveResult = mongodb.DeleteWriteOpResultObject['result'] & {
  deletedCount?: number;
};

// global type
declare global {
  interface AnyObject {
    [x: string]: any;
  }

  interface StringObject {
    [x: string]: string;
  }
}
