const mongoose = require('mongoose')
const configs = require('../config/configs.js')

const NotificationSchema = new mongoose.Schema({
  deviceSerial: { type: String, required: true, maxlength: 15, index: true, lowercase: false }, // Definido por usuario
  message: { type: String, required: true, maxlength: 150 },
  generatedDate: { type: Date, default: Date.now() },
  deleted: { type: Boolean, default: false },
  viewed: { type: Boolean, default: false }
})
const NotificationModel = mongoose.model(configs.NOTIFICATION_COLECTION, NotificationSchema)

module.exports = NotificationModel
