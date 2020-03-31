'user strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeviceSchema = new Schema({
    registerDate : {type: Number, required: true},
    data         : {type: Object, required: true}
});

module.exports = DeviceSchema;