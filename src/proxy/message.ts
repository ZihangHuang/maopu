import {
  Message,
  MessageDocument,
  ReplyDocument,
  UserDocument,
  ObjectId,
  MessageType,
} from '../models';
import { isValid } from './index';
import * as topicProxy from './topic';
import * as replyProxy from './reply';

/**
 * 根据用户ID，获取未读消息的数量
 * @param id 用户ID
 */
export const getUnReadMessagesCount = (userId: ObjectId) => {
  if (!isValid(userId)) return;

  return Message.countDocuments({ userId, hasRead: false });
};

/**
 * 根据用户ID，获取所有消息的数量
 * @param id 用户ID
 */
export const getMessagesCount = (userId: ObjectId) => {
  if (!isValid(userId)) return;

  return Message.countDocuments({ userId });
};

/**
 * 根据用户ID，获取消息
 * @param id 用户ID
 */
export const getMessagesByUserId = async (
  userId: ObjectId,
  skip = 0,
  pageSize = 10,
): Promise<MessageDocument[] | undefined> => {
  if (!isValid(userId)) return;

  const messages: MessageDocument[] = await Message.find({ userId }, '', {
    sort: 'create_at',
  })
    .populate('topic', {
      _id: 1,
      title: 1,
    })
    .populate({
      path: 'reply',
      populate: {
        path: 'author',
        select: {
          _id: 1,
          username: 1,
          nickname: 1,
          avatar: 1,
        },
      },
    })
    .skip(skip)
    .limit(pageSize)
    .lean(); //lean()转换成普通js对象，才可以修改赋值

  if (messages.length === 0) return;

  for (let i = 0, len = messages.length; i < len; i++) {
    const type = messages[i].type; //消息类型
    if (type === 'reply2') {
      //type是reply2说明存储的是二级回复
      if (messages[i].reply) {
        const reply1Id = (messages[i].reply as ReplyDocument).replyId; //获取二级回复对应的一级回复id
        const reply1 = await replyProxy.getReplyById(reply1Id); //一级回复信息
        messages[i].reply1 = reply1!;
      }
    }
  }

  return messages;
};

/**
 * 根据消息Id获取消息
 * @param id 消息ID
 */
export const getMessageById = (_id: ObjectId) => {
  if (!isValid(_id)) return;

  return Message.findOne({ _id });
};

/**
 * 新增消息
 * @param   type          [消息类型]
 * @param  topicId       [主题id]
 * @param  replyId       [回复id]
 * @param  replyAuthorId [可选,二级回复时对应的一级回复者id, 当二级回复时设定该值]
 */
export const addMessage = async (
  type: MessageType,
  topicId: ObjectId,
  replyId: ObjectId,
  replyAuthorId?: ObjectId,
) => {
  const message = new Message();
  message.type = type;
  message.topic = topicId;
  message.reply = replyId;

  let userId;

  if (type === 'reply') {
    //如果是一级回复，userId为帖子的
    const topic = await topicProxy.getTopicFullById(topicId);
    if (topic) userId = (topic.author as UserDocument)._id;
  } else if (type === 'reply2') {
    userId = replyAuthorId;
  }

  if (userId) {
    message.userId = userId;

    return message.save();
  }
};

/**
 * 设置所有消息为已读
 * @param userId 用户id
 */
export const setMessagesToHasRead = (userId: ObjectId) => {
  if (!isValid(userId)) return;
  return Message.updateMany({ userId }, { hasRead: true });
};

/**
 * 删除评论
 * @param replyId 回复id
 */
export const removeMessageByReplyId = (replyId: ObjectId) => {
  if (!isValid(replyId)) return;
  return Message.remove({ reply: replyId });
};
