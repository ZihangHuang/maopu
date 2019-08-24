const mongoose = require('mongoose')

//用来检查传入的_id是否合法，因为使用不合法的_id进行查询等操作时mongoose会报错
exports.isValid = _id => mongoose.Types.ObjectId.isValid(_id)

//封装数据库操作
exports.User = require('./user')
exports.Topic = require('./topic')
exports.Reply = require('./reply')
exports.Message = require('./message')