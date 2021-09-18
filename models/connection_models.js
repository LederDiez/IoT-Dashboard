'user strict'

const { MONGO_URL, USER_COLECTION, DEVICE_COLECTION, SESSION_COLECTION, SESSION_SECRET } = require('../config/config')

const mongoose = require('mongoose');
const colors   = require('colors');

const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);

const Schema = mongoose.Schema;

mongoose.connect(MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(function () { 
  console.log('Success to establish connection with mongodb'.bgGreen); 
}).catch(function (err) { 
  console.log('Failed to establish connection with mongodb'.bgRed);
  console.log(err.message); 
});

mongoose.Promise = global.Promise;
const db = mongoose.connection

const sessionStoreModel = new MongoStore({
    mongooseConnection: db,
    collection: SESSION_COLECTION
});

const sessionStore = session({  
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 604800000 // 1 week
    },
    resave: false,
    saveUninitialized: false,
    unset: 'destroy',
    store: sessionStoreModel
})

var mail_match = [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "El email no es valido."]
const UserSchema = new Schema({
    type       : {type: String, required: true, maxlength: 50},
    user       : {type: String, required: true, maxlength: 255, index: true},
    mail       : {type: String, required: true, maxlength: 255, match: mail_match, index: true, lowercase: true, unique: true},
    pass       : {type: String, required: true, maxlength: 500},
    check      : {type: Boolean},
    signUpDate : {type: Date, default: Date.now()},
    lastLogin  : Date
});
var userModel = mongoose.model(USER_COLECTION, UserSchema);

const DeviceSchema = new Schema({
    name       : {type: String, maxlength: 255},                                                                // Definido por usuario
    modelName      : {type: String, required: true, maxlength: 255},                                                // Definido por admin
    serialNumber     : {type: String, required: true, maxlength: 255, index: true, lowercase: false, unique: true},   // Definido por admin
    associatedUser       : {type: String, maxlength: 255, index: true}                                                    // Definido por sistema
});
devicesModel = mongoose.model(DEVICE_COLECTION, DeviceSchema);

const DevicesSchema = new Schema({
    registerDate : {type: Number, required: true},
    data         : {type: Object, required: true}
});

module.exports = {
  SessionStore  : sessionStore,
  UserModel     : userModel,
  DevicesModel  : devicesModel,
  DevicesDataSchema    : DevicesSchema
};