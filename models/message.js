const mongoose = require('mongoose')
// const BaseModel = require('./base-model')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const tools = require('../common/tools')
/*
 * type:
 * reply: xx 回复了你的话题
 * reply2: xx 在话题中回复了你
 * follow: xx 关注了你
 * at: xx ＠了你
 */

const MessageSchema = new Schema({
  type: { type: String },
  userId: { type: ObjectId }, //此消息归属者的用户id
  // authorId: { type: ObjectId }, //帖子作者id
  topic: { type: ObjectId, ref: 'Topic' }, //帖子信息
  reply: { type: ObjectId, ref: 'Reply' }, //回复
  hasRead: { type: Boolean, default: false },
  createTime: { type: String, default: tools.setFormatDate(new Date()) },
})
// MessageSchema.plugin(BaseModel)
MessageSchema.index({ masterId: 1, hasRead: -1, createTime: -1 })

module.exports = mongoose.model('Message', MessageSchema)
