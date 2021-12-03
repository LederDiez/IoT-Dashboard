'user strict'

const { DevicesModel, UserModel } = require('../models/connection_models');

const { v4: uuidv4 } = require('uuid');

const express = require('express');
const router  = express.Router();

const admin_routers = require('./apis/admin_api');
const user_routers = require('./apis/users_api');
const device_routers = require('./apis/devices_api');
const notification_routers = require('./apis/notification_api');

const pages = require('./routers/routes');

router.use("/api", admin_routers);
router.use("/api", user_routers);
router.use("/api", device_routers);
router.use("/api", notification_routers);

router.use("/", pages);

// User or device socket authentication register
router.post('/authentication', function (req, res) {

	const user  	= req.session.user || null;
	const serial  = req.session.deviceSerial || null;
	const token  	= req.body.DeviceToken || null;

	if (user != null) {

		const v4 = uuidv4();

		const filter = { user: user };
		const update = { 
			uuid: v4,
			deviceAuth: serial
		};

		UserModel.findOneAndUpdate(filter, update, {new: true}, function(error, data) {
			if (error) {
				res.status(500).send({
					status	 : 'Server error',
					code: 1
				});
			} else {
				res.status(200).send(v4);
			}
		});

	} else if (token != null) {
		
		const v4 = uuidv4();

		const filter = { autenticador: token };
		const update = { uuid: v4 };

		DevicesModel.findOneAndUpdate(filter, update, {new: true}, function(error, data) {
			if (error) {
				res.status(500).send({
					status	 : 'Server error',
					code: 1
				});
			} else {
				req.session.IsStarted = true;
				req.session.deviceAuth = data.serialNumber;
				res.status(200).send(v4);
			}
		});

	} else {
		res.status(401).send({
				status	 : 'Unauthorized',
				code: 0
		});
	}
});

module.exports = router;