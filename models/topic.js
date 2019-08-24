const mongoose = require('mongoose')
const BaseModel = require('./base-model')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const tools = require('../common/tools')
// const config = require('../config')
// const _ = require('lodash')

const tabs = {
  news: '新闻',
  street: '步行街',
  default: '话题圈'
}

const TopicSchema = new Schema({
  title: { type: String },
  content: { type: String },
  author: { type: ObjectId, ref:  'User'},
  top: { type: Boolean, default: false }, // 置顶帖
  good: { type: Boolean, default: false }, // 精华帖
  lock: { type: Boolean, default: false }, // 被锁定主题
  visitCount: { type: Number, default: 0 },
  collectCount: { type: Number, default: 0 },
  createTime: { type: String, default: tools.setFormatDate(new Date()) },
  updateTime: { type: String, default: tools.setFormatDate(new Date()) },
  replyCount: { type: Number, default: 0 },
  lastReply: { type: ObjectId, ref: 'Reply' }, //最后一个回复
  lastReplyTime: { type: String },
  contentIsHtml: { type: Boolean, default: false},
  tab: { type: String },
  deleted: { type: Boolean, default: false }
})

TopicSchema.plugin(BaseModel)
TopicSchema.index({ createTime: -1 })
TopicSchema.index({ top: -1, lastReplyTime: -1 })
TopicSchema.index({ authorId: 1, createTime: -1 })

TopicSchema.virtual('tabName').get(function() {
  let tab = this.tab
  for(let key in tabs) {
    if(tab === key) {
      return tabs[key]
    }
  }
  return '话题圈'
})

module.exports = mongoose.model('Topic', TopicSchema)
