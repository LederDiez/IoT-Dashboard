const mongoose = require('mongoose')
const configs = require('../config/configs.js')

const DeviceSchema = new mongoose.Schema({
  name: { type: String, maxlength: 50 }, // Definido por usuario
  modelName: { type: String, maxlength: 50, required: true }, // Definido por admin
  serialNumber: { type: String, maxlength: 15, required: true, index: true, lowercase: false, unique: true }, // Definido por admin
  associatedUser: { type: String, maxlength: 100, index: true }, // Definido por sistema
  autenticador: { type: String, maxlength: 100, required: true, index: true },
  uuid: { type: String, maxlength: 100 }
})
const DeviceModel = mongoose.model(configs.DEVICE_COLECTION, DeviceSchema)

module.exports = DeviceModel
