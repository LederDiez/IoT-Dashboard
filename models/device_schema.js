'user strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    name       : {type: String, maxlength: 255},
    model      : {type: String, required: true, maxlength: 255},
    serial     : {type: String, required: true, maxlength: 255, index: true, lowercase: false, unique: true},
    user       : {type: String, maxlength: 255, index: true}
});

module.exports = mongoose.model('device', DeviceSchema);