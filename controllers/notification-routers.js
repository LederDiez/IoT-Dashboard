'user strict'

const express = require('express');
const router  = express.Router();

const { NotificationModel } = require('../models/connection_models');

// User only method
router.post("/notifications", function(req, res) {
	
	const IsStarted = req.session.IsStarted || false;
	const serial = req.session.deviceSerial || null;

	if (IsStarted == true && serial != null) {

		const filter = {
			deviceSerial: serial,
			deleted: false
		};
				
		NotificationModel.find(filter, function(err, result) {
			if (err) {
				res.status(500).json({
					status  : 'Error del servidor'
				});
			} else {
				res.status(200).json({
					status  : 'success',
					count: result.length,
					notifications: result
				});
			}
		});
	} else {
		res.status(401).json({
			status	 : 'Unauthorized',
			code: 1
		});
	}
});

// User only method
router.post("/notifications/count", function(req, res) {
	
	const IsStarted = req.session.IsStarted || false;
	const serial = req.session.deviceSerial || null;

	if (IsStarted == true && serial != null) {

		const filter = {
			deviceSerial: serial,
			deleted: false
		};
				
		NotificationModel.find(filter, function(err, result) {
			if (err) {
				res.status(500).json({
					status  : 'Error del servidor'
				});
			} else {
				res.status(200).json({
					status  : 'success',
					count: result.length
				});
			}
		});
	} else {
		res.status(401).json({
			status	 : 'Unauthorized',
			code: 1
		});
	}
});

// User only method
router.post("/notification/delete", function(req, res) {
	
	const IsStarted  = req.session.IsStarted  || false;
	const id = req.body.id || null

	if (IsStarted == true && id != null) {
		
		const filter = {
			_id: id
		};
		const update = {
			deleted: true
		};
				
		NotificationModel.findByIdAndUpdate(filter, update, function(err, result) {
			if (err) {
				res.status(500).json({
					status  : 'Error del servidor'
				});
			} else {
				res.status(200).json({
					status  : 'success'
				});
			}
		});

	} else {
		res.status(401).json({
			status	 : 'Unauthorized',
			code: 1
		});
	}

});

// Device only method
router.post("/notification/add", function(req, res) {
	
	const deviceStarted  = req.session.deviceStarted  || false;
	const deviceSerial = req.session.deviceAuth || null;

	const message = req.body.message || null;

	if (deviceStarted == true && message != null) {
			
		const notification = new NotificationModel();

		notification.deviceSerial = deviceSerial;
		notification.message = message;
		notification.generatedDate = Date.now();

		notification.save((err) => {
			if (err) { 
				console.log(err);
				res.status(500).json({
					status  : 'error'
				});
			} else {
				res.status(200).json({
					status  : 'success'
				});
			}
		});

	} else {
		res.status(401).json({
			status	 : 'Unauthorized',
			code: 1
		});
	}

});

module.exports = router;