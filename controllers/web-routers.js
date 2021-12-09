const CryptoJS = require("crypto-js");
const express  = require('express');

const { SERIAL_CRYPTO_KEY } = require('../config/config');
const { DevicesModel } = require('../models/connection_models');

const router = express.Router();

const fs = require('fs');

router.get("/", function(req, res) {
	if (req.session.IsStarted != true) {
		res.render("web/index");
	} else {
		if (req.session.type == 'client') {
			res.redirect('./consola/'); 
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
			res.redirect('../consola/'); 
		} else {
			res.redirect('../admin/'); 
		}
		
	}
});

router.get("/consola", function(req, res) {
	if (req.session.IsStarted == true) {

		/* Indica que dispositivo tiene seleccionado el usuario */
		var deviceId = req.query.device || 0;

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
					
					req.session.deviceName   = deviceName;
					req.session.deviceModel  = deviceModel;
					req.session.deviceSerial = deviceSerial;

					RenderData.deviceName	= deviceName,
					RenderData.NDevices	 	= result.length,
					RenderData.devices	  = JSON.stringify(result)

				}

				res.render("consola/index", RenderData);

			} else {
				res.status(500).send('Error del servidor');
			}
		});
	} else {
		res.redirect('/acceso'); 
	}
});

router.post("/models", function(req, res) {
	if (req.session.IsStarted == true) {

		const viewName = req.body.viewName  || null;
		const model = req.session.deviceModel;

		if (viewName != null) {

			let path = "models/" + viewName + "/" + model + "/index.ejs";
			const filePath = "./views/" + path;

			fs.access(filePath, function (error) {
				if (error) {
					res.render("models/error/index", {
						viewName: viewName
					});
				} else {
					res.render(path, {
						viewName: viewName
					});
				}
			});

		} else {
			res.redirect('/acceso'); 
		}
	} else {
		res.redirect('/acceso'); 
	}
});

router.get("/admin", function(req, res) {
	res.render("admin/index", {
		title: 'Administrador',
		user: req.session.user
	});
});

router.get("/simulador/inversor", function(req, res) {
	res.render("inversor", {
		title: 'Simulador web'
	});
});

module.exports = router;