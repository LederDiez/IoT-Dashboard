const CryptoJS = require("crypto-js");
const express  = require('express');

const { SERIAL_CRYPTO_KEY } = require('../../config/config');
const { DevicesModel } = require('../../models/connection_models');

const router = express.Router();

router.get("/", function(req, res) {
	if (req.session.IsStarted != true) {
		res.render("web/index");
	} else {
		if (req.session.type == 'client') {
			res.redirect('./consola'); 
		} else {
			res.redirect('./admin'); 
		}
		
	}
});

router.get("/acceso", function(req, res) {
	if (req.session.IsStarted != true) {
		res.render("acceso/index", {
			title: 'Acceso'
		});
	} else {
		if (req.session.type == 'client') {
			res.redirect('../consola'); 
		} else {
			res.redirect('../admin'); 
		}
		
	}
});

router.get("/consola", function(req, res) {
	if (req.session.IsStarted == true) {

		/* Indica que dispositivo tiene seleccionado el usuario */
		var deviceId = 0;
		if (req.query.device != null) {
			deviceId = req.query.device;
		}
		/******************************************************/

		var userid = req.session.userid;
		var user   = req.session.user;
		var mail   = req.session.mail;
		var check  = req.session.check;

		var deviceName;
		var deviceModel;
		var deviceSerial;
		var RenderData = {
			user		 : user,
			mail		 : mail,
			check		: check,
			NDevices	 : 0,
			deviceName 	 : null,
			deviceModel  : null,
			deviceSerial : null,
			devices		 : null
		};

		DevicesModel.find({'associatedUser' : userid}, function(err, result) {
			if (!err) {
				if (result.toString() != "") {
					if (result.length <= deviceId) {
						req.query.device = 0;
						deviceId = 0;
					}

					deviceName   = result[deviceId].name;
					deviceModel  = result[deviceId].modelName;
					deviceSerial = result[deviceId].serialNumber;

					// Encrypt
					var encryptedSerial = CryptoJS.AES.encrypt(deviceSerial, SERIAL_CRYPTO_KEY);
					
					RenderData.deviceName	= deviceName,
					RenderData.deviceModel  = deviceModel,
					RenderData.NDevices	 	= result.length,
					RenderData.deviceSerial = encryptedSerial,
					RenderData.devices	  = JSON.stringify(result)

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

router.get("/admin", function(req, res) {
	res.render("admin/index", {
		title: 'Administrador',
		user: req.session.user
	});
});

router.get("/test", function(req, res) {
	res.render("test", {
		title: 'Test web'
	});
});

module.exports = router;