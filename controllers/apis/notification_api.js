'user strict'

const express = require('express');
const router  = express.Router();

const { NotificationModel } = require('../../models/connection_models');

/**********************************************
*	User Notifications controllers
*	ADD 			* Add notification
*	DELETE 		* Delete notification
*	ALL 			* Get all notifications
**********************************************/
router.post("/notifications", function(req, res) {
	
	const IsStarted  = req.session.IsStarted  || false;
	const deviceSerial = req.session.deviceAuth || null;

	const action = req.body.action || null;
	const message = req.body.message || null;

	if (IsStarted) {
		
		switch (action) {
			case 'ALL':
				
				DevicesModel.find({'associatedUser' : userid}, function(err, result) {
					if (err) {
						res.status(500).send('Error del servidor');
					} else {
						if (result.toString() != "") {
							//
						}
					}
				});

				break;

			case 'ADD':
				// Evitar usuario genere notificacion
				if (message != null) {
					
					const notification = new NotificationModel();

					notification.deviceSerial = deviceSerial;
					notification.message = message;

					notification.save((err) => {
						if (err) { 
							console.log(err);
							res.status(500).send({
								status  : 'error'
							});
						} else {
							res.status(200).send({
								status  : 'success'
							});
						}
					});
				}
				break;

			case 'DELETE':
				//
				break;
		
			default:
				res.status(401).send({
					status	 : 'Unauthorized',
					code: 0
				});
				break;
		}

	} else {
		res.status(401).send({
			status	 : 'Unauthorized',
			code: 1
		});
	}

});

module.exports = router;