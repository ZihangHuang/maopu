import mongoose, { Schema, Document } from 'mongoose';
import { ReplyDocument } from './reply';
import { TopicDocument } from './topic';
import * as tools from '../common/tools';

const ObjectId = Schema.Types.ObjectId;

/*
 * type:
 * reply: xx 回复了你的话题
 * reply2: xx 在话题中回复了你
 * follow: xx 关注了你
 * at: xx ＠了你
 */
export type MessageType = 'reply' | 'reply2' | 'follow' | 'at';

export interface MessageDocument extends Document {
  _id: mongoose.Types.ObjectId;
  type: MessageType;
  userId: mongoose.Types.ObjectId;
  topic: mongoose.Types.ObjectId | TopicDocument;
  reply: mongoose.Types.ObjectId | ReplyDocument;
  hasRead: string;
  createTime: string;
  reply1?: ReplyDocument;
}

const MessageSchema = new Schema({
  type: { type: String },
  userId: { type: ObjectId }, //此消息归属者的用户id
  // authorId: { type: ObjectId }, //帖子作者id
  topic: { type: ObjectId, ref: 'Topic' }, //帖子信息
  reply: { type: ObjectId, ref: 'Reply' }, //回复
  hasRead: { type: Boolean, default: false },
  createTime: { type: String, default: tools.getFormatDate() },
});
// MessageSchema.plugin(BaseModel)
MessageSchema.index({ hasRead: -1, createTime: -1 });

export const Message = mongoose.model<MessageDocument>(
  'Message',
  MessageSchema,
);
