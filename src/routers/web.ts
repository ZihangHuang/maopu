import Router from 'koa-router';
import { Context } from 'koa';
import { jwtAuthentication } from '../middlewares/passport';
import * as user from '../controllers/user';
import * as sign from '../controllers/sign';
import * as topic from '../controllers/topic';
import * as news from '../controllers/news';
import * as reply from '../controllers/reply';
import * as message from '../controllers/message';
import * as qiniuHandle from '../controllers/qiniu-handle';

const router = new Router<Context>();

//首页

//注册
router.post('/register', sign.register);
//登录
router.post('/login', sign.login);
//router.post('/logout', sign.logout)

//鉴权
router.post('/authentication', jwtAuthentication, sign.authentication);

//用户
router.post('/user/detail', jwtAuthentication, user.getUser);
router.post('/user/update', jwtAuthentication, user.updateUser);

//帖子
router.post('/topic/list', topic.getTopicList);
router.post('/topic/detail', topic.getTopicDetail);
router.post('/topic/add', jwtAuthentication, topic.addTopic);
router.post('/topic/delete', jwtAuthentication, topic.deleteTopic);
//新闻
router.post('/news/list', news.getNewsList);
router.post('/news/list/focus', news.getNewsHasFocusPic);
router.post('/news/add', jwtAuthentication, news.addNews);
router.post('/news/delete', jwtAuthentication, topic.deleteTopic);

//回复
router.post('/reply/add', jwtAuthentication, reply.addReply);
router.post('/reply/list', reply.getRepliesByTopicId);
router.post('/reply/delete', jwtAuthentication, reply.deleteReply);

//消息
router.post('/message/list', jwtAuthentication, message.getMessagesByUserId);
router.post(
  '/message/list/unread',
  jwtAuthentication,
  message.getUnReadMessagesCount,
);
router.post(
  '/message/set/hasread',
  jwtAuthentication,
  message.setMessagesToHasRead,
);

//七牛
router.post(
  '/base/getQiniuToken',
  jwtAuthentication,
  qiniuHandle.getQiniuToken,
);

export default router;
