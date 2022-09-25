const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const configs = require('../config/configs.js')

const UserSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    maxlength: 50
  },
  username: {
    type: String,
    required: true,
    maxlength: 50,
    index: true
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
    index: true,
    lowercase: true,
    unique: true
  },
  active: {
    type: Boolean
  },
  signUpDate: {
    type: Date,
    default: Date.now()
  },
  lastLogin: {
    type: Date,
    default: Date.now()
  },
  uuid: {
    type: String,
    maxlength: 100
  },
  authTime: {
    type: Number,
    maxlength: 15,
    lowercase: false
  },
  device: {}
})

const options = {
  lastLoginField: 'lastLogin',
  usernameUnique: false,
  usernameQueryFields: ['email'],
  limitAttempts: true,
  maxAttempts: 5
}

UserSchema.plugin(passportLocalMongoose, options)
const UserModel = mongoose.model(configs.USER_COLECTION, UserSchema)

module.exports = UserModel
