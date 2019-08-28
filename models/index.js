const mongoose = require('mongoose')
const config = require('../config')
const { loggerTrace, loggerError } = require('../common/logger')

const { host, port, database } = config.mongodb
const uri = `mongodb://${host}:${port}/${database}`

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })

const db = mongoose.connection
db.on('error', err => {
  console.log('connect to %s error: ', uri, err.message)
  loggerError.error('connect to %s error: ', uri, err.message)
  process.exit(1)
})

// 打印日志
var traceMQuery = function(method, info, query) {
  return function(err, result, millis) {
    if (err) {
      loggerError.error('traceMQuery error:', err)
    }
    var infos = []
    infos.push(query._collection.collection.name + '.' + method)
    infos.push(JSON.stringify(info))
    infos.push('\nresult: ' + JSON.stringify(result))
    infos.push(millis + 'ms')

    loggerTrace.debug('mongoose - ', infos.join(' '))
  }
}
mongoose.Mongoose.prototype.mquery.setGlobalTraceFunction(traceMQuery)


// mongoose.set('debug', (collectionName, method, query, doc) => {
//   var infos = []
//   infos.push(collectionName + '.' + method)
//   infos.push('\nquery: ' + JSON.stringify(query))
//   infos.push('\ndoc: ' + JSON.stringify(doc))
//   loggerTrace.debug('mongoose - ', infos.join(' '))
// })

exports.User = require('./user')
exports.Topic = require('./topic')
exports.Message = require('./message')
exports.Reply = require('./reply')