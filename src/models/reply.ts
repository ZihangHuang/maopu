import mongoose, { Schema, Document } from 'mongoose';
import { UserDocument } from './user';
import * as tools from '../common/tools';

const ObjectId = Schema.Types.ObjectId;

export interface ReplyDocument extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  topicId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId | UserDocument;
  replyId: mongoose.Types.ObjectId;
  replyAuthor: AnyObject;
  createTime: string;
  contentIsHtml: boolean;
}

const ReplySchema = new Schema({
  content: { type: String },
  topicId: { type: ObjectId },
  author: { type: ObjectId, ref: 'User' },
  replyId: { type: ObjectId }, //二级回复对应的一级回复id,当有replyId时，为二级回复
  replyAuthor: { type: Object }, //二级回复对应的一级回复者信息
  createTime: { type: String, default: tools.getFormatDate() },
  //updateTime: { type: String, default: tools.getFormatDate() },
  contentIsHtml: { type: Boolean, default: true },
});

ReplySchema.index({ topicId: 1 });
ReplySchema.index({ authorId: 1, createTime: -1 });

export const Reply = mongoose.model<ReplyDocument>('Reply', ReplySchema);
