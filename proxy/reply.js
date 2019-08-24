// const mongoose = require('mongoose')
// const ObjectId = mongoose.Types.ObjectId
const models = require('../models')
const Reply = models.Reply
const Topic = models.Topic
// const userProxy = require('./user')
// const topicProxy = require('./topic')
const isValid = require('./index').isValid
const tools = require('../common/tools')

/**
 * 根据回复ID，获取回复
 * @param {String} id 回复ID
 * @return {Object}
 */
const getReplyById = _id => {
  if(!isValid(_id)) return
  
  return Reply.findOne({ _id }).populate('author')
}
exports.getReplyById = getReplyById

/**
 * 根据帖子ID，获取回复
 * @param {String} id 回复ID
 * @return {Object}
 */
exports.getRepliesByTopicId = async (topicId, skip = 0, pageSize = 10) => {
  if(!isValid(topicId)) return

  let replies = await Reply.find({ topicId }, '', {sort: 'create_at'}).populate('author', {
    _id: 1,
    username: 1,
    nickname: 1,
    avatar: 1
  }).skip(skip).limit(pageSize)
  if (!replies.length === 0) return

  return replies
}

/**
 * 根据帖子ID，获取回复的数量
 */
exports.getReplyCountByTopicId = (topicId) => Reply.countDocuments({ topicId })

/**
 * 创建并保存一条回复信息
 * @param {String} content 回复内容
 * @param {String} topicId 帖子ID
 * @param {String} authorId 回复作者ID
 * @param {String} [replyId] 回复ID，当二级回复时设定该值
 * @param {String} [replyAuthor] 二级回复对应的一级回复者信息，当二级回复时设定该值
 */
exports.addReply = async function(content, topicId, authorId, replyId, replyAuthor) {
  let data = {
    // _id: new ObjectId(),
    content: content,
    topicId: topicId,
    author: authorId,
    createTime: tools.setFormatDate(new Date())
  }
  if (replyId) {
    data.replyId = replyId
  }

  if (replyAuthor) {
    data.replyAuthor = replyAuthor
  }

  let reply = new Reply(data)

  let res = await reply.save()
  if(!res) return

  let res2 = await Topic.updateOne({_id: topicId}, {
    '$set': {
      lastReplyTime: tools.setFormatDate(new Date()),
    },
    '$inc': {
      replyCount: 1
    }
  })
  //{ n: 1, nModified: 1, ok: 1 }
  if(res2.ok) return getReplyById(res._id)
}

/**
 * 删除回复
 * @param {Number} 回复id
 * @return { Object } 结果
 */
exports.removeReply = async _id => {
  if(!isValid(_id)) return

  let reply = await Reply.findOne({ _id })
  if(!reply) return

  let topicId = reply.topicId
  //let res = await Reply.updateOne({ _id }, { $set: { deleted: true } })
  let res = reply.remove()
  if(!res) return
    
  let res2 = await Topic.updateOne({_id: topicId}, {
    '$set': {
      lastReplyTime: tools.setFormatDate(new Date()),
    },
    '$inc': {
      replyCount: -1
    }
  })

  return res2
}