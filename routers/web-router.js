const Router = require('koa-router')
const { isJwtAuthenticated } = require('../middlewares/passport')
const user = require('../controllers/user')
const home = require('../controllers/home')
const sign = require('../controllers/sign')
const topic = require('../controllers/topic')
const reply = require('../controllers/reply')
const message = require('../controllers/message')
const qiniuHandle = require('../controllers/qiniu-handle')

let router = new Router()

//首页
router.get('/', isJwtAuthenticated, home.index)

//注册
router.post('/register', sign.register)
//登录
router.post('/login', sign.login)
//router.post('/logout', sign.logout)

//鉴权
router.post('/authentication', isJwtAuthenticated, sign.authentication)

//用户
router.post('/user/detail', isJwtAuthenticated, user.getUser)
router.post('/user/update', isJwtAuthenticated, user.updateUser)

//帖子
router.post('/topic/list', topic.getTopicList)
router.post('/topic/detail', topic.getTopicDetail)
router.post('/topic/add', isJwtAuthenticated, topic.addTopic)
//回复
router.post('/reply/add', isJwtAuthenticated, reply.addReply)
router.post('/reply/list', reply.getRepliesByTopicId)
router.post('/reply/delete', isJwtAuthenticated, reply.deleteReply)

//消息
router.post('/message/list', isJwtAuthenticated, message.getMessagesByUserId)
router.post('/message/list/unread', isJwtAuthenticated, message.getUnReadMessagesCount)

//七牛
router.post('/base/getQiniuToken', isJwtAuthenticated, qiniuHandle.getQiniuToken)

module.exports = router
