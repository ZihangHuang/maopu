import { Topic, TopicDocument, ObjectId } from '../models';
import { isValid } from './index';

export type TopicQuery = Partial<TopicDocument>;

/**
 * 根据帖子ID获取帖子详情
 * - topic, 帖子
 * - author, 作者
 * @param id 帖子ID
 */
export const getTopicFullById = (_id: ObjectId) => {
  if (!isValid(_id)) return;

  return Topic.findOne({ _id }).populate('author', {
    password: 0,
  });
};

/**
 * 获取帖子的数量
 */
export const getTopicCount = (query: TopicQuery = { deleted: false }) =>
  Topic.countDocuments(query);

/**
 * 获取帖子列表
 * @param query    [查询条件]
 * @param skip     [第几条]
 * @param pageSize [每页条数]
 */
export const getTopicList = async (
  query: TopicQuery = { isNews: false, deleted: false },
  skip = 0,
  pageSize = 10,
) => {
  const topics = await Topic.find(query)
    .populate('author', {
      _id: 1,
      username: 1,
      nickname: 1,
      avatar: 1,
    })
    .skip(skip)
    .limit(pageSize);

  return topics;
};

/**
 * 获取新闻列表
 */
export const getNewsList = async (
  query: TopicQuery = { isNews: true, deleted: false },
  skip = 0,
  pageSize = 10,
) => {
  const topics = await Topic.find(query, {
    content: 0,
  })
    .skip(skip)
    .limit(pageSize);

  if (topics.length === 0) return;

  return topics;
};

/**
 * 创建帖子
 */
export interface TopicAddData {
  title: string;
  content: string;
  author: ObjectId;
  [x: string]: any;
}

export const addTopic = (topicInfo: TopicAddData) => {
  const topic = new Topic(topicInfo);
  return topic.save();
};

/**
 * 创建新闻
 */
export const addNews = (topicInfo: TopicAddData) => {
  topicInfo.isNews = true;
  if (topicInfo.focusPic) topicInfo.hasFocusPic = true;

  const topic = new Topic(topicInfo);
  return topic.save();
};

/**
 * 修改帖子
 */
export interface TopicInfo {
  _id: ObjectId;
  [x: string]: any;
}
export const updateTopic = (topicInfo: TopicInfo) => {
  if (!isValid(topicInfo._id)) return;

  const _id = topicInfo._id;
  delete topicInfo._id;
  return Topic.updateOne({ _id }, { $set: topicInfo });
};

export const deleteTopic = (_id: ObjectId) => {
  if (!isValid(_id)) return;

  return Topic.deleteOne({ _id });
};
