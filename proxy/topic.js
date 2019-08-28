const models = require('../models')
const Topic = models.Topic
const isValid = require('./index').isValid
// const userProxy = require('./user')
// const replyProxy = require('./reply')
// const tools = require('../common/tools')

/**
 * 根据帖子ID获取帖子详情
 * - topic, 帖子
 * - author, 作者
 * @param {String} id 帖子ID
 */
exports.getTopicFullById = async _id => {
  if(!isValid(_id)) return

  return await Topic.findOne({ _id }).populate('author', {
    password: 0
  })
}

/**
 * 获取帖子的数量
 */
exports.getTopicCount = (query = { deleted: false }) => Topic.countDocuments(query)

/**
 * 获取帖子列表
 * @param  {Object} query    [查询条件]
 * @param  {Number} skip     [第几条]
 * @param  {Number} pageSize [每页条数]
 * @return {[Array]}
 */
exports.getTopicList = async (query = { deleted: false }, skip = 0, pageSize = 10) => {
  let topics = await Topic.find(query).populate('author', {
    _id: 1,
    username: 1,
    nickname: 1,
    avatar: 1
  }).skip(skip).limit(pageSize)

  if (!topics.length === 0) return

  topics.forEach((v, i) => {
    if(v.deleted) {
      topics.splice(i, 1)
    }
  })
  return topics
}

/**
 * 创建帖子
 * @param {Object} topicInfo 帖子信息
 * @return { Promise } 结果
 */
exports.addTopic = topicInfo => {
  let topic = new Topic(topicInfo)
  return topic.save()
}

/**
 * 修改帖子
 * @param {Object} topicInfo 帖子信息
 * @return { Promise } 结果
 */
exports.updateTopic = topicInfo => {
  if(!isValid(topicInfo._id)) return
  
  const _id = topicInfo._id
  delete topicInfo._id
  return Topic.updateOne({ _id }, { $set: topicInfo })
}

/**
 * 删除帖子
 * @param {Number} 帖子id
 * @return { Promise } 结果
 */
exports.removeTopic = _id => {
  if(!isValid(_id)) return

  return Topic.updateOne({ _id }, { $set: { deleted: true } })
}