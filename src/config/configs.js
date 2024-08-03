const dotenv = require('dotenv')

dotenv.config()

const configs = {

  PORT: process.env.PORT || 80,
  NODE_ENV: process.env.NODE_ENV || 'pro',
  MONGO_PRODUCTION: process.env.MONGO_PRO || 'mongodb+srv://LederDiez:159753852@cluster0-jcmxa.mongodb.net/dashboard?retryWrites=true&w=majority',
  MONGO_DEV: process.env.MONGO_DEV || 'mongodb+srv://LederDiez:159753852@cluster0-jcmxa.mongodb.net/TEST?retryWrites=true&w=majority',

  USER_COLECTION: process.env.USER_COLECTION || 'users',
  DEVICE_COLECTION: process.env.DEVICE_COLECTION || 'devices',
  SESSION_COLECTION: process.env.SESSION_COLECTION || 'sessions',
  NOTIFICATION_COLECTION: process.env.NOTIFICATION_COLECTION || 'notifications',

  PUBLIC_VAPID_KEY: process.env.PUBLIC_VAPID_KEY || 'BFPL6jlmpD2RO42vWcaqFUGsbmYDI6ezFgqkEBtl2I9bDu8hk34ooiQF0BdyLmbT7J6ikwZe5vCTwhxYcIBKECE',
  PRIVATE_VAPID_KEY: process.env.PRIVATE_VAPID_KEY || '0bF1GxjOVtfj1szFjHCyro1hJ2zVgGmrb3PUlHgN--4',

  SERIAL_CRYPTO_KEY: process.env.SERIAL_CRYPTO_KEY || 'HZ3TM6O0M76Z67PQ',

  SESSION_SECRET: process.env.SESSION_SECRET || '9Q3HTBA2DFS5ITDC',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'I98KYU4JGB6F51DVC'
}

module.exports = configs
