const db = require('mongoose')
const session = require('express-session')
const connect = require('connect-mongo')

const configs = require('../config/configs')

// mongo
const MONGO = configs.MONGO_PRODUCTION
db.connect(MONGO).then(() => {
  console.log('Success to establish connection with mongodb'.bgGreen)
}).catch((err) => {
  console.log('Failed to establish connection with mongodb'.bgRed)
  console.log(err.message)
})
db.Promise = global.Promise

const MongoStore = connect(session)
module.exports = session({
  secret: configs.SESSION_SECRET,
  cookie: {
    secure: false,
    maxAge: 604800000 // 1 week
  },
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  store: new MongoStore({
    mongooseConnection: db.connection,
    collection: configs.SESSION_COLECTION
  })
})
