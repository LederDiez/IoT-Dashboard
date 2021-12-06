'user strict'

const express = require('express');
const router  = express.Router();

const { DevicesModel } = require('../models/connection_models');

/**********************************************
*	User Devices controllers
*	ADD 			* add device to user
*	DELETE 		* Delete user device
*	EDIT 			* Edit user device
**********************************************/

router.post("/device/add", function(req, res) {
	
	const IsStarted = req.session.IsStarted || false;

	if (IsStarted) {
		let name   = req.body.name || null;
		let serial = req.body.serial || null;
		let userid = req.session.userid;
		
		if (name != null && serial != null && userid != null) {

			const filter = {
				serialNumber: serial,
				associatedUser: ''
			};
			const update = {
				name: name,
				associatedUser: userid
			};

			DevicesModel.findOneAndUpdate(filter, update, function (err, data) {
				if (err) {
					res.status(200).json({
						status  : 'error',
						code		: 1,
						title   : 'Error!',
						message : 'Un error en el servidor impide la ejecución.'
					});
				} else if (data) {
					res.status(200).json({
						status  : 'success',
						title   : 'Éxito!',
						message : 'Serial asociado a su cuenta',
						action  : 'reload'
					});
				} else {
					res.status(200).json({
						status  : 'error',
						code		: 2,
						title   : 'Error!',
						message : 'Serial incorrecto u ocupado por otro usuario.'
					});
				}
			});
		} else {
			res.status(200).json({
				status  : 'error',
				title   : 'Error!',
				message : 'Datos no validos.',
				action  : 'reload'
			});
		}
	} else {
		res.status(401).json({
			status	 : 'Unauthorized',
			code: 1,
			action  : 'reload'
		});
	}

});

router.post("/device/edit", function(req, res) {
	const IsStarted = req.session.IsStarted || false;

	if (IsStarted) {
		
		let name   = req.body.name || null;
		let serial = req.session.deviceSerial || null;
		let userid = req.session.userid;

		if (name != null) {

			const filter = {
				serialNumber: serial,
				associatedUser: userid
			};
			const update = {
				name: name
			};

			DevicesModel.findOneAndUpdate(filter, update, function (err, data) {
				if (err) {
					res.status(200).json({
						status  : 'error',
						code		: 2,
						title   : 'Error!',
						message : 'Un error en el servidor impide la ejecución.'
					});
				} else if (data) {
					res.status(200).json({
						status  : 'success',
						title   : 'Éxito!',
						message : 'Nombre del dispositivo actualizado',
						action  : 'reload'
					});
				}
			});
		} else {
			res.status(200).json({
				status  : 'error',
				title   : 'Error!',
				message : 'Datos no validos.',
				action  : 'reload'
			});
		}
	} else {
		res.status(401).json({
			status	 : 'Unauthorized',
			code: 1,
			action  : 'reload'
		});
	}
});

router.post("/device/delete", function(req, res) {
	const IsStarted = req.session.IsStarted || false;

	if (IsStarted) {
		
		let serial = req.body.serial || null;
		let userid = req.session.userid;

		if (serial != null) {

			const filter = {
				serialNumber: serial,
				associatedUser: userid
			};
			const update = {
				name: '',
				associatedUser: ''
			};

			DevicesModel.findOneAndUpdate(filter, update, function (err, data) {
				if (err) {
					res.status(200).json({
						status  : 'error',
						code		: 3,
						title   : 'Error!',
						message : 'Un error en el servidor impide la ejecución.'
					});
				} else if (data) {
					res.status(200).json({
						status  : 'success',
						title   : 'Éxito!',
						message : 'Dispositivo desvinculado de su cuenta',
						action  : 'reload'
					});
				} else {

				}
			});
		} else {
			res.status(200).json({
				status  : 'error',
				title   : 'Error!',
				message : 'Datos no validos.',
				action  : 'reload'
			});
		}
	} else {
		res.status(401).json({
			status	 : 'Unauthorized',
			code: 1,
			action  : 'reload'
		});
	}
});

module.exports = router;