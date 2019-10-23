const db = require('../models/session_conecction');
const CryptoJS = require("crypto-js");
const express = require('express');
const router = express.Router();

router.get("/", function(req, res) {
	if (req.session.IsStarted != true) {
		res.render("index", {
			title: 'Home'
		});
	} else {
		res.redirect('./consola'); 
	}
});

router.get("/consola", function(req, res) {
	if (req.session.IsStarted == true) {

		/* Dice que dispositivo tiene seleccionado el usuario */
		var deviceId = 0;
		if (req.query.device != null) {
			deviceId = req.query.device;
		}
		/******************************************************/

		const user = req.session.user;
		const mail = req.session.mail;

		db.collection("devices").find({'user' : mail}).toArray(function(err, result) {
			if (!err) {
				if (result.toString() != "") {

					const deviceName   = result[deviceId].name;
					const deviceModel  = result[deviceId].model;
					const deviceSerial = result[deviceId].serial;
					var ArrayData = {
						user    	 : user,
						mail    	 : mail,
						devices  	 : JSON.stringify(result),
						deviceName   : deviceName,
						deviceModel  : deviceModel,
						deviceSerial : encryptedSerial
					}
					var encryptedSerial = CryptoJS.AES.encrypt(deviceSerial, 'Fv55xh2JWJP25eW');

					req.session.deviceName   = deviceName;
					req.session.deviceModel  = deviceModel;
					req.session.deviceSerial = deviceSerial;

					// Encrypt

					res.render("consola/index", ArrayData);

				} else {

					var ArrayData = {
						user	: user,
						mail    : mail,
					}

					res.render("consola/addDevice", ArrayData);

				}
			} else {
				res.status(500).send('Error del servidor');
			}
		});
	} else {
		res.redirect('/'); 
	}
});

module.exports = router;