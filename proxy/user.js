const models  = require('../models')
const User    = models.User
const isValid = require('./index').isValid

/**
 * 根据用户名查找用户
 * @param {String} username 用户名
 * @return { Promise<Object> }
 */
exports.getUserByUsername = (username, isAll) => isAll ? User.find({'username': username}) : User.findOne({'username': username})

/**
 * 根据用户ID，查找用户
 * @param {ObjectId} id 用户ID
 * @return { Promise<Object> }
 */
exports.getUserById = (_id, isAll) => {
  if(!isValid(_id)) return
  //不查询出密码
  return isAll ? User.find({ _id }, { password: 0 }) : User.findOne({ _id }, { password: 0 })
}

/**
 * 根据用户ID列表，获取一组用户
 * @param {Array<ObjectId>} ids 用户ID列表
 * @return { Promise<Object> }
 */
exports.getUsersByIds = ids => User.find({'_id': {'$in': ids}}, { password: 0 })

/**
 * 创建用户
 * @param {Object} userInfo 用户信息
 * @return { Promise<Object> }
 */
exports.addUser = userInfo => {
  let user = new User(userInfo)
  return user.save()
}

/**
 * 修改用户
 * @param {Object} userInfo 用户信息
 * @return { Promise<Object> }
 */
exports.updateUser = userInfo => {
  if(userInfo._id) {
    const _id = userInfo._id
    
    if(!isValid(_id)) return

    delete userInfo._id
    return User.updateOne({ _id }, { $set: userInfo })
  }
}