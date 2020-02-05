import { User, ObjectId } from '../models';
import { isValid } from './index';

export type UserFindAll = ReturnType<typeof User.find>;
export type UserFindOne = ReturnType<typeof User.findOne>;
export type UserFind = UserFindAll | UserFindOne;

/**
 * 根据用户名查找用户
 */
export function getUserByUsername(username: string, isAll: true): UserFindAll;
export function getUserByUsername(username: string, isAll?: false): UserFindOne;
export function getUserByUsername(
  username: string,
  isAll?: boolean,
): UserFindAll | UserFindOne {
  return isAll
    ? User.find({ username: username })
    : User.findOne({ username: username });
}
/**
 * 根据用户ID，查找用户
 */
export function getUserById(_id: ObjectId, isAll: true): UserFindAll;
export function getUserById(_id: ObjectId, isAll?: false): UserFindOne;
export function getUserById(
  _id: ObjectId,
  isAll?: boolean,
): UserFind | undefined {
  if (!isValid(_id)) return;
  //不查询出密码
  return isAll
    ? User.find({ _id }, { password: 0 })
    : User.findOne({ _id }, { password: 0 });
}

/**
 * 根据用户ID列表，获取一组用户
 */
export const getUsersByIds = (ids: ObjectId[]): UserFindAll =>
  User.find({ _id: { $in: ids } }, { password: 0 });

/**
 * 创建用户
 */
export interface UserAddData {
  username: string;
  password: string;
  [x: string]: any;
}
export const addUser = (userInfo: UserAddData) => {
  const user = new User(userInfo);
  return user.save();
};

/**
 * 修改用户
 */

export interface UserUpdateData {
  _id: ObjectId;
  [x: string]: any;
}
export const updateUser = (userInfo: UserUpdateData) => {
  if (userInfo._id) {
    const _id = userInfo._id;

    if (!isValid(_id)) return;

    delete userInfo._id;
    return User.updateOne({ _id }, { $set: userInfo });
  }
};
