const Message = require('../models').Message
const isValid = require('./index').isValid
// const userProxy = require('./user')
const topicProxy = require('./topic')
const replyProxy = require('./reply')

/**
 * 根据用户ID，获取未读消息的数量
 * @param {String} id 用户ID
 * @return {Promise} 获取消息数量
 */
exports.getUnReadMessagesCount = userId => {
  if (!isValid(userId)) return

  return Message.countDocuments({ userId, hasRead: false })
}

/**
 * 根据用户ID，获取所有消息的数量
 * @param {String} id 用户ID
 * @return {Promise} 获取消息数量
 */
exports.getMessagesCount = userId => {
  if (!isValid(userId)) return

  return Message.countDocuments({ userId })
}

/**
 * 根据用户ID，获取消息
 * @param {String} id 用户ID
 * @return {Object}
 */
exports.getMessagesByUserId = async (userId, skip = 0, pageSize = 10) => {
  if (!isValid(userId)) return

  let messages = await Message.find({ userId }, '', { sort: 'create_at' })
    .populate('topic', {
      _id: 1,
      title: 1
    })
    .populate({
      path: 'reply',
      populate: {
        path: 'author',
        select: {
          _id: 1,
          username: 1,
          nickname: 1,
          avatar: 1
        }
      }
    })
    .skip(skip)
    .limit(pageSize).lean() //lean()转换成普通js对象，才可以修改赋值


  if (!messages.length === 0) return
  
  for(let i = 0, len = messages.length; i < len; i++) {
    let type = messages[i].type //消息类型
    if(type === 'reply2') { //type是reply2说明存储的是二级回复
      let reply1Id = messages[i].reply.replyId //获取二级回复对应的一级回复id
      let reply1 = await replyProxy.getReplyById(reply1Id) //一级回复信息
      messages[i].reply1 = reply1
    }
  }

  return messages
}

/**
 * 根据消息Id获取消息
 * @param {String} id 消息ID
 * @return {Promise}
 */
exports.getMessageById = _id => {
  if (!isValid(_id)) return

  //TODO
  return Message.findOne({ _id })
}

/**
 * 新增消息
 * @param  {Boolean} type          [消息类型]
 * @param  {ObjectId} topicId       [主题id]
 * @param  {ObjectId} replyId       [回复id]
 * @param  {ObjectId} replyAuthorId [可选,二级回复时对应的一级回复者id, 当二级回复时设定该值]
 */
exports.addMessage = async (type, topicId, replyId, replyAuthorId) => {
  var message = new Message()
  message.type = type
  message.topic = topicId
  message.reply = replyId

  let userId

  if (type === 'reply') {
    //如果是一级回复，userId为帖子的
    let topic = await topicProxy.getTopicFullById(topicId)
    userId = topic.author._id
  } else if (type === 'reply2') {
    userId = replyAuthorId
  }

  message.userId = userId

  return message.save()
}

//设置所有消息为已读
exports.setMessagesToHasRead = userId => {
  if (!isValid(userId)) return
  return Message.updateMany({ userId }, { hasRead: true })
}
