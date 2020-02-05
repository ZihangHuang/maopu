import mongoose from 'mongoose';

// 用来检查传入的_id是否合法，因为使用不合法的_id进行查询等操作时mongoose会报错
export const isValid = (_id: any): _id is mongoose.Types.ObjectId =>
  mongoose.Types.ObjectId.isValid(_id);

export * from './user';
export * from './topic';
export * from './reply';
export * from './message';

// update返回值：{ n: 2, nModified: 2, ok: 1 }
// 新增返回值：{ __v: 0, _id: 123, ... }
