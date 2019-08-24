var mongoose = require('mongoose')
var BaseModel = require('./base-model')
var tools = require('../common/tools')
var Schema = mongoose.Schema
//var ObjectId = Schema.Types.ObjectId

let UserSchema = new Schema(
  {
    nickname: String,
    username: String,
    password: String,
    email: String,
    avatar: String,
    level: {
      //等级
      type: Number,
      default: 1
    },
    reputation: {
      //声望
      type: Number,
      default: 0
    },
    signature: String, //个性签名
    createTime: { type: String, default: tools.setFormatDate(new Date()) },
    updateTime: { type: String, default: tools.setFormatDate(new Date()) },
    isBlock: {type: Boolean, default: false},
    // createTime: {
    //   type: Date,
    //   default: Date.now,
    //   get: v => tools.setFormatDate(v)
    // },
    // updateTime: {
    //   type: Date,
    //   default: Date.now,
    //   get: v => tools.setFormatDate(v)
    // }
  },
  // {
  //   timestamps: true //自动创建字段`createdAt` and `updatedAt`，并且update时自动更新updatedAt
  // }
)

UserSchema.plugin(BaseModel, { index: true })

module.exports = mongoose.model('User', UserSchema)
