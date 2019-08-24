const mongoose = require('mongoose')
// const BaseModel = require('./base-model')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const tools = require('../common/tools')

const ReplySchema = new Schema({
  content: { type: String },
  topicId: { type: ObjectId },
  author: { type: ObjectId, ref: 'User' },
  replyId: { type: ObjectId }, //当有replyId时，为二级回复
  replyAuthor: { type: Object }, //二级回复对应的一级回复者信息
  createTime: { type: String, default: tools.setFormatDate(new Date()) },
  //updateTime: { type: String, default: tools.setFormatDate(new Date()) },
  contentIsHtml: { type: Boolean },
  //ups: [ObjectId],
})

//ReplySchema.plugin(BaseModel)
ReplySchema.index({ topicId: 1 })
ReplySchema.index({ authorId: 1, createTime: -1 })

module.exports = mongoose.model('Reply', ReplySchema)
