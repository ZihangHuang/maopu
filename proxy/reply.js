// const mongoose = require('mongoose')
// const ObjectId = mongoose.Types.ObjectId
const models = require('../models')
const Reply = models.Reply
const Topic = models.Topic
// const userProxy = require('./user')
// const topicProxy = require('./topic')
const messageProxy = require('./message')
const isValid = require('./index').isValid
const tools = require('../common/tools')

/**
 * 根据回复ID，获取回复
 * @param {ObjectId} id 回复ID
 * @return { Promise<Object> }
 */
const getReplyById = (_id, all) => {
  if (!isValid(_id)) return

  if (all) {
    return Reply.findOne({ _id }).populate('author')
  } else {
    return Reply.findOne({ _id }).populate('author', {
      _id: 1,
      username: 1,
      nickname: 1,
      avatar: 1
    })
  }
}
exports.getReplyById = getReplyById

/**
 * 根据帖子ID，获取回复
 * @param {ObjectId} id 回复ID
 * @return { Promise<Array> }
 */
exports.getRepliesByTopicId = async (topicId, skip = 0, pageSize = 10) => {
  if (!isValid(topicId)) return

  let replies = await Reply.find({ topicId }, '', { sort: 'create_at' })
    .populate('author', {
      _id: 1,
      username: 1,
      nickname: 1,
      avatar: 1
    })
    .skip(skip)
    .limit(pageSize)
  if (!replies.length === 0) return

  return replies
}

/**
 * 根据帖子ID，获取回复的数量
 */
exports.getReplyCountByTopicId = topicId => Reply.countDocuments({ topicId })

/**
 * 创建并保存一条回复信息
 * @param {String} content 回复内容
 * @param {ObjectId} topicId 帖子ID
 * @param {ObjectId} authorId 回复作者ID
 * @param {ObjectId} [replyId] 回复ID，当二级回复时设定该值
 * @param {Object} [replyAuthor] 二级回复对应的一级回复者信息，当二级回复时设定该值
 * @return { Promise<Object> }
 */
exports.addReply = async function(
  content,
  topicId,
  authorId,
  replyId,
  replyAuthor
) {
  let data = {
    // _id: new ObjectId(),
    content: content,
    topicId: topicId,
    author: authorId
  }
  //是否是二级回复
  if (replyId) {
    data.replyId = replyId
  }

  if (replyAuthor) {
    data.replyAuthor = replyAuthor
  }

  let reply = new Reply(data)

  let res = await reply.save()
  if (!res) return

  let res2 = await Topic.updateOne(
    { _id: topicId },
    {
      $set: {
        lastReply: res._id,
        lastReplyTime: tools.setFormatDate(new Date())
      },
      $inc: {
        replyCount: 1
      }
    }
  )
  //{ n: 1, nModified: 1, ok: 1 }
  if (!res2.ok) return

  //添加消息
  let type, res3
  //二级回复id则传入对应的一级回复者id
  if (replyId && replyAuthor) {
    type = 'reply2'
    res3 = await messageProxy.addMessage(
      type,
      topicId,
      res._id,
      replyAuthor._id
    )
  } else {
    type = 'reply'
    res3 = await messageProxy.addMessage(type, topicId, res._id)
  }

  if (!res3) return

  return getReplyById(res._id)
}

/**
 * 删除回复
 * @param {ObjectId} 回复id
 * @return { Promise<Object> }
 */
exports.removeReply = async _id => {
  if (!isValid(_id)) return

  let reply = await Reply.findOne({ _id })
  if (!reply) return

  let topicId = reply.topicId
  //let res = await Reply.updateOne({ _id }, { $set: { deleted: true } })
  let res = reply.remove()
  if (!res) return

  let res2 = await tools.promiseAll(
    Topic.updateOne(
      { _id: topicId },
      {
        $set: {
          lastReplyTime: tools.setFormatDate(new Date())
        },
        $inc: {
          replyCount: -1
        }
      }
    ),
    messageProxy.removeMessageByReplyId(_id)
  )

  if(res2.length < 2) return

  return { ok: 1 }
}
