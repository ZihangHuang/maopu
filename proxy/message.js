const Message = require('../models').Message
const isValid = require('./index').isValid
// const userProxy = require('./user')
// const topicProxy = require('./topic')
// const replyProxy = require('./reply')

/**
 * 根据用户ID，获取未读消息的数量
 * @param {String} id 用户ID
 * @return {Promise} 获取消息数量
 */
exports.getMessagesCount = userId => {
  if(!isValid(userId)) return

  return Message.count({ userId: userId, hasRead: false })
}

/**
 * 根据消息Id获取消息
 * @param {String} id 消息ID
 * @return {Promise}
 */
exports.getMessageById = _id => {
  if(!isValid(_id)) return
    
  //TODO
  return Message.findOne({ _id })
}

exports.addMessage = function(type, userId, authorId, topicId, replyId) {
  var message = new Message()
  message.type = type
  message.userId = userId
  message.authorId = authorId
  message.topicId = topicId
  message.replyId = replyId

  return message.save()
}
