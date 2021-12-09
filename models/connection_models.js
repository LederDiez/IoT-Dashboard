'user strict'

const { MONGO_URL, USER_COLECTION, NOTIFICATION_COLECTION, DEVICE_COLECTION, SESSION_COLECTION, SESSION_SECRET } = require('../config/config')

const mongoose = require('mongoose');
const colors	 = require('colors');

const session		= require('express-session');
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
	secret	: SESSION_SECRET,
	cookie	: {
		maxAge: 604800000 // 1 week
	},
	resave: false,
	saveUninitialized: false,
	unset: 'destroy',
	store: sessionStoreModel
})

var mail_match = [/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, "El email no es valido."]
const UserSchema = new Schema({
	type				: {type: String, required: true, maxlength: 50},
	user				: {type: String, required: true, maxlength: 50, index: true},
	mail				: {type: String, required: true, maxlength: 50, match: mail_match, index: true, lowercase: true, unique: true},
	pass				: {type: String, required: true, maxlength: 500},
	check				: {type: Boolean},
	signUpDate	: {type: Date, default: Date.now()},
	lastLogin		: {type: Date, default: Date.now()},
	uuid  			: {type: String, maxlength: 100},
	deviceAuth	: {type: String, maxlength: 15, lowercase: false}
});
var userModel = mongoose.model(USER_COLECTION, UserSchema);

const NotificationSchema = new Schema({
	deviceSerial		: {type: String,  required: true, maxlength: 15, index: true, lowercase: false},																																// Definido por usuario
	message 				: {type: String,  required: true, maxlength: 150},
	generatedDate		: {type: Date,    default: Date.now()},
	deleted					: {type: Boolean, default: false},
	viewed					: {type: Boolean, default: false},
});
var NotificationModel = mongoose.model(NOTIFICATION_COLECTION, NotificationSchema);

const DeviceSchema = new Schema({
	name						: {type: String, maxlength: 50},																																// Definido por usuario
	modelName				: {type: String, maxlength: 50,  required: true},																								// Definido por admin
	serialNumber		: {type: String, maxlength: 15,  required: true, index: true, lowercase: false, unique: true},	  // Definido por admin
	associatedUser	: {type: String, maxlength: 100, index: true},																									// Definido por sistema
	autenticador		: {type: String, maxlength: 100, required: true, index: true},
	uuid  					: {type: String, maxlength: 100}
});
var devicesModel = mongoose.model(DEVICE_COLECTION, DeviceSchema);

const DevicesDataSchema = new Schema({
	registerDate	: {type: Number, required: true, index: true},
	data					: {type: Object, required: true}
});

module.exports = {
	SessionStore			: sessionStore,
	UserModel					: userModel,
	NotificationModel	: NotificationModel,
	DevicesModel			: devicesModel,
	DevicesDataSchema	: DevicesDataSchema
};