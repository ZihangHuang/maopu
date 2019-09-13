const moment = require('moment')

moment.locale('en-us')

// 格式化时间
function setFormatDate(date, fromNow) {
  date = moment(date)
  if (fromNow) {
    return date.fromNow()
  } else {
    return date.format('YYYY-MM-DD HH:mm')
  }
}

function getFormatDate(fromNow) {
  if (fromNow) {
    return moment().fromNow()
  } else {
    return moment().format('YYYY-MM-DD HH:mm')
  }
}

exports.setFormatDate = setFormatDate
exports.getFormatDate = getFormatDate

//加密
const crypto = require('crypto')

function encrypt(val) {
  return crypto.createHash('sha256').update(val).digest('hex')
}

function check(val, encryptVal) {
  return encrypt(val) === encryptVal
}

exports.encrypt = encrypt
exports.check = check

function getRandom(n) {
  var rnd = ''
  for (var i = 0; i < n; i++) rnd += Math.floor(Math.random() * 10)
  return rnd
}

exports.getRandom = getRandom

/**
 * [promiseAll 并发操作]
 * @param  {...Promise} promises
 * @return {Promise<Array>}
 */
exports.promiseAll = function promiseAll(...promises) {
  return Promise.all(promises)
}