const db = require('../models/session_conecction');

const dotenv   = require('dotenv').config();
const CryptoJS = require("crypto-js");
const express  = require('express');

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

		var userid = req.session.userid;
		var user   = req.session.user;
		var mail   = req.session.mail;
		var image  = req.session.image;
		var check  = req.session.check;

		if (image == "") {
			image = "default.png";
		}

		var deviceName;
		var deviceModel;
		var deviceSerial;
		var RenderData = {
			user	     : user,
			mail         : mail,
			image        : image,
			check        : check,
			NDevices     : 0,
			deviceName 	 : null,
			deviceModel  : null,
			deviceSerial : null,
			devices		 : null
		};

		db.collection("devices").find({'user' : userid}).toArray(function(err, result) {
			if (!err) {
				if (result.toString() != "") {
					if (result.length <= deviceId) {
						req.query.device = 0;
						deviceId = 0;
					}

					deviceName   = result[deviceId].name;
					deviceModel  = result[deviceId].model;
					deviceSerial = result[deviceId].serial;

					// Encrypt
					var encryptedSerial = CryptoJS.AES.encrypt(deviceSerial, process.env.SERIAL_CRYPTO_KEY);
					
					RenderData.deviceName	= deviceName,
					RenderData.deviceModel  = deviceModel,
					RenderData.NDevices	 	= result.length,
					RenderData.deviceSerial = encryptedSerial,
					RenderData.devices      = JSON.stringify(result)

					req.session.deviceName   = deviceName;
					req.session.deviceModel  = deviceModel;
					req.session.deviceSerial = deviceSerial;

					

				}

				res.render("consola/index", RenderData);

			} else {
				res.status(500).send('Error del servidor');
			}
		});
	} else {
		res.redirect('/'); 
	}
});

module.exports = router;