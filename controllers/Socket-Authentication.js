const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router  = express.Router();

const { DevicesModel, UserModel } = require('../models/connection_models');

// User websocket authentication
router.post('/authentication/user', function (req, res) {

	const user  	= req.session.user || null;
	const serial  = req.session.deviceSerial || null;

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

	} else {
		res.status(401).send({
				status	 : 'Unauthorized',
				code: 0
		});
	}
});

// Device websocket authentication
router.post('/authentication/device', function (req, res) {

	const key = req.body.DeviceKey || null;

	if (key != null) {
		
		const v4 = uuidv4();

		const filter = { autenticador: key };
		const update = { uuid: v4 };

		DevicesModel.findOneAndUpdate(filter, update, {new: true}, function(error, data) {
			if (error) {
				res.status(500).send({
					status	 : 'Server error',
					code: 1
				});
			} else {
				req.session.deviceStarted = true;
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