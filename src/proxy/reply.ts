import {
  Reply,
  ReplyDocument,
  ObjectId,
  Topic,
  MessageType,
  MessageDocument,
  TopicDocument,
} from '../models';
import { isValid } from './index';
import * as messageProxy from './message';
import * as tools from '../common/tools';
import { RemoveResult } from '../types';

/**
 * 根据回复ID，获取回复
 */
export function getReplyById(_id: ObjectId, isAllInfo = false) {
  if (!isValid(_id)) return;

  if (isAllInfo) {
    return Reply.findOne({ _id }).populate('author');
  } else {
    return Reply.findOne({ _id }).populate('author', {
      _id: 1,
      username: 1,
      nickname: 1,
      avatar: 1,
    });
  }
}

/**
 * 根据帖子ID，获取回复
 */
export const getRepliesByTopicId = async (
  topicId: ObjectId,
  skip = 0,
  pageSize = 10,
) => {
  if (!isValid(topicId)) return;

  const replies = await Reply.find({ topicId }, '', { sort: 'create_at' })
    .populate('author', {
      _id: 1,
      username: 1,
      nickname: 1,
      avatar: 1,
    })
    .skip(skip)
    .limit(pageSize);

  return replies;
};

/**
 * 根据帖子ID，获取回复的数量
 */
export const getReplyCountByTopicId = (topicId: ObjectId) =>
  Reply.countDocuments({ topicId });

/**
 * 创建并保存一条回复信息
 * @param content 回复内容
 * @param topicId 帖子ID
 * @param authorId 回复作者ID
 * @param replyId 回复ID，当二级回复时设定该值
 * @param replyAuthor 二级回复对应的一级回复者信息，当二级回复时设定该值
 */
export const addReply = async function(
  content: string,
  topicId: ObjectId,
  authorId: ObjectId,
  replyId: ObjectId,
  replyAuthor: AnyObject,
) {
  const data: Partial<ReplyDocument> = {
    // _id: new ObjectId(),
    content: content,
    topicId: topicId,
    author: authorId,
    createTime: tools.getFormatDate(),
  };
  //是否是二级回复
  if (replyId) {
    data.replyId = replyId;
  }

  if (replyAuthor) {
    data.replyAuthor = replyAuthor;
  }

  const reply = new Reply(data);

  const res = await reply.save();
  if (!res) return;

  const res2 = await Topic.updateOne(
    { _id: topicId },
    {
      $set: {
        lastReply: res._id,
        lastReplyTime: tools.setFormatDate(new Date()),
      },
      $inc: {
        replyCount: 1,
      },
    },
  );
  //{ n: 1, nModified: 1, ok: 1 }
  if (!res2.ok) return;

  //添加消息
  let type: MessageType;
  let res3: MessageDocument | undefined;
  //二级回复id则传入对应的一级回复者id
  if (replyId && replyAuthor) {
    type = 'reply2';
    res3 = await messageProxy.addMessage(
      type,
      topicId,
      res._id,
      replyAuthor._id,
    );
  } else {
    type = 'reply';
    res3 = await messageProxy.addMessage(type, topicId, res._id);
  }

  if (!res3) return;

  return getReplyById(res._id);
};

/**
 * 删除回复
 * @param 回复id
 */
export const removeReply = async (_id: ObjectId) => {
  if (!isValid(_id)) return;

  const reply = await Reply.findOne({ _id });
  if (!reply) return;

  const topicId = reply.topicId;
  //let res = await Reply.updateOne({ _id }, { $set: { deleted: true } })
  const res = reply.remove();
  if (!res) return;

  const res2 = await tools.promiseAll<TopicDocument | RemoveResult>(
    Topic.updateOne(
      { _id: topicId },
      {
        $set: {
          lastReplyTime: tools.setFormatDate(new Date()),
        },
        $inc: {
          replyCount: -1,
        },
      },
    ),
    messageProxy.removeMessageByReplyId(_id)!,
  );

  if (res2.length < 2) return;

  return { ok: 1 };
};
