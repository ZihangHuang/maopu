/**
 * 给所有的 Model 扩展功能
 * http://mongoosejs.com/docs/plugins.html
 */
var tools = require('../common/tools')
//console.log(tools.getFormatDate())

module.exports = function(schema, options) {
  schema.pre('updateOne', function(next) {
    this.updateOne({}, { $set: { updateTime: tools.getFormatDate() } })
    next()
    
    //设置索引
    // if (options && options.index) {
    //   schema.path('updateTime').index(options.index)
    // }
  })
}
