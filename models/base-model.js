/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */
var tools = require('../common/tools')
//console.log(tools.setFormatDate(new Date()))

module.exports = function(schema, options) {
  schema.pre('updateOne', function(next) {
    this.updateOne({}, { $set: { updateTime: tools.setFormatDate(new Date()) } })
    next()
    
    //设置索引
    // if (options && options.index) {
    //   schema.path('updateTime').index(options.index)
    // }
  })
}
