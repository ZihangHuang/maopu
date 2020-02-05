import mongoose, { Schema, Document } from 'mongoose';
import BaseModel from './base-model';
import * as tools from '../common/tools';

export interface UserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  nickname: string;
  email: string;
  avatar: string;
  level: number;
  reputation: number;
  signature: string;
  createTime: string;
  updateTime: string;
  isBlock: boolean;
}

const UserSchema = new Schema<UserDocument>(
  {
    nickname: String,
    username: String,
    password: String,
    email: String,
    avatar: String,
    level: {
      //等级
      type: Number,
      default: 1,
    },
    reputation: {
      //声望
      type: Number,
      default: 0,
    },
    signature: String, //个性签名
    createTime: { type: String, default: tools.getFormatDate() },
    updateTime: { type: String, default: tools.getFormatDate() },
    isBlock: { type: Boolean, default: false },
    // createTime: {
    //   type: Date,
    //   default: Date.now,
    //   get: v => tools.setFormatDate(v)
    // },
    // updateTime: {
    //   type: Date,
    //   default: Date.now,
    //   get: v => tools.setFormatDate(v)
    // }
  },
  // {
  //   timestamps: true //自动创建字段`createdAt` and `updatedAt`，并且update时自动更新updatedAt
  // }
);

UserSchema.plugin(BaseModel, { index: true });

export const User = mongoose.model<UserDocument>('User', UserSchema);
