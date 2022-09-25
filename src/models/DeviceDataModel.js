const mongoose = require('mongoose')

const DeviceDataSchema = new mongoose.Schema({
  registerDate: { type: Number, required: true, index: true },
  data: { type: Object, required: true }
})

module.exports = (deviceSerial) => {
  const collection = 'device-' + deviceSerial
  return mongoose.model(collection, DeviceDataSchema)
}
