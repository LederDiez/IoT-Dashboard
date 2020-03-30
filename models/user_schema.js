'user strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const uri = 'mongodb://localhost/user-registers';

var mail_match = [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "El email no es valido."]

const UserSchema = new Schema({
    user       : {type: String, required: true, maxlength: 255, index: true},
    mail       : {type: String, required: true, maxlength: 255, match: mail_match, index: true, lowercase: true, unique: true},
    pass       : {type: String, required: true, maxlength: 500},
    image      : {type: String, maxlength: 255},
    check      : {type: Boolean},
    signUpDate : {type: Date, default: Date.now()},
    lastLogin  : Date
});

module.exports = mongoose.model('User', UserSchema);