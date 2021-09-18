const dotenv = require('dotenv').config();

module.exports = {

    PORT : process.env.PORT || 80,

    NODE_ENV : process.env.NODE_ENV || 'development',
    
    MONGO_URL : process.env.MONGO_URL || 'MONGO_URL',

    USER_COLECTION : process.env.USER_COLECTION || 'USER_COLECTION',
    DEVICE_COLECTION : process.env.DEVICE_COLECTION || 'DEVICE_COLECTION',
    SESSION_COLECTION : process.env.SESSION_COLECTION || 'SESSION_COLECTION',

    PUBLIC_VAPID_KEY : process.env.PUBLIC_VAPID_KEY || 'PUBLIC_VAPID_KEY',
    PRIVATE_VAPID_KEY : process.env.PRIVATE_VAPID_KEY || 'PRIVATE_VAPID_KEY',

    SERIAL_CRYPTO_KEY : process.env.SERIAL_CRYPTO_KEY || 'SERIAL_CRYPTO_KEY',

    SESSION_SECRET : process.env.SESSION_SECRET || 'SESSION_SECRET'
}