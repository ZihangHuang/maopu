import mongoose, { Schema, Document } from 'mongoose';
import BaseModel from './base-model';
import { ReplyDocument } from './reply';
import { UserDocument } from './user';
import * as tools from '../common/tools';

const ObjectId = Schema.Types.ObjectId;

export interface TopicDocument extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  content: string;
  isNews: boolean;
  hasFocusPic: boolean;
  focusPic: string;
  author: mongoose.Types.ObjectId | UserDocument;
  top: boolean;
  good: boolean;
  lock: boolean;
  visitCount: number;
  collectCount: number;
  createTime: string;
  updateTime: string;
  replyCount: number;
  lastReply: mongoose.Types.ObjectId | ReplyDocument;
  lastReplyTime: string;
  tab: string;
  deleted: boolean;
}

const tabs: StringObject = {
  street: '步行街',
  default: '话题圈',
};

const TopicSchema = new Schema({
  title: { type: String },
  content: { type: String },
  isNews: { type: Boolean, default: false }, //是否是新闻，默认false，即是普通帖子
  hasFocusPic: { type: Boolean, default: false }, //是否有焦点图，新闻才是true
  focusPic: { type: String }, //焦点图，当是新闻时可以设置
  author: { type: ObjectId, ref: 'User' },
  top: { type: Boolean, default: false }, // 置顶帖
  good: { type: Boolean, default: false }, // 精华帖
  lock: { type: Boolean, default: false }, // 被锁定
  visitCount: { type: Number, default: 0 },
  collectCount: { type: Number, default: 0 },
  createTime: { type: String, default: tools.getFormatDate() },
  updateTime: { type: String, default: tools.getFormatDate() },
  replyCount: { type: Number, default: 0 },
  lastReply: { type: ObjectId, ref: 'Reply' }, //最后一个回复
  lastReplyTime: { type: String },
  tab: { type: String },
  deleted: { type: Boolean, default: false },
});

TopicSchema.plugin(BaseModel, {});
TopicSchema.index({ isNews: 1 });
TopicSchema.index({ top: -1 });
TopicSchema.index({ createTime: -1, lastReplyTime: -1 });
TopicSchema.index({ authorId: 1, createTime: -1 });

TopicSchema.virtual('tabName').get(function(this: TopicDocument) {
  const tab = this.tab;
  for (const key in tabs) {
    if (tab === key) {
      return tabs[key];
    }
  }
  return '话题圈';
});

export const Topic = mongoose.model<TopicDocument>('Topic', TopicSchema);
