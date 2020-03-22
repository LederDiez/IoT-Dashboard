'user strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    name       : {type: String, maxlength: 255},                                                                // Definido por usuario
    model      : {type: String, required: true, maxlength: 255},                                                // Definido por admin
    serial     : {type: String, required: true, maxlength: 255, index: true, lowercase: false, unique: true},   // Definido por admin
    user       : {type: String, maxlength: 255, index: true}                                                    // Definido por sistema
});

module.exports = mongoose.model('device', DeviceSchema);