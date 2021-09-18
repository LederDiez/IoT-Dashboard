'user strict'

const express = require('express');
const router  = express.Router();

const { DevicesModel } = require('../../models/connection_models');

/**********************************************
*	Admin Devices controllers
*	ALL 		* get all devices
*	GET 		* get device
*	ADD 		* add device
*	DELETE 		* Delete device
*	EDIT 		* Edit device
**********************************************/
router.post("/admin", function(req, res) {

	const action = req.body.action;
	var IsStarted = false;

	if (req.session.IsStarted != null) {
		IsStarted = req.session.IsStarted;
	}
	if (IsStarted) {
		switch (action) {
			case 'all':
			
				DevicesModel.find({}, function (err, data) {
					if (!err) {
						if (data) {
							var serials = new Array();
							for (var i = 0; i < data.length; i++) {
								serials.push(data[i].serialNumber);
							}
							res.status(200).send(serials);
						} else {
							res.status(200).send({
								status  : 'error',
								title   : 'Error!',
								message : 'Serial invalido o erroneo.'
							});
						}
					} else {
						res.status(200).send({
							status  : 'error',
							title   : 'Error!',
							message : 'Error del servidor.'
						});
					}
				});

			break;

			case 'get':
				
				var serial = req.body.serial;

				DevicesModel.findOne({'serialNumber': serial}, function (err, data) {
					if (!err) {
						if (data) {
							res.status(200).send(data);
						} else {
							res.status(200).send({
								status  : 'error',
								title   : 'Error!',
								message : 'Serial invalido o erroneo.'
							});
						}
					} else {
						res.status(200).send({
							status  : 'error',
							title   : 'Error!',
							message : 'Error del servidor.'
						});
					}
				});

			break;

			case 'add':

				var serial = req.body.serial;
				var model  = req.body.model;

				// Comprobar que esten los datos
				if (serial != null && model != null) {
					// Comprobar que el serial no este registrado
					DevicesModel.findOne({'serialNumber': serial}, function (err, data) {
						//Error al tratar de buscar el serial en la base de datos
						if (!err) {
							// Comprobar de que no existan datos de un dispositivo
							if (!data) {
								
								const newDevice = new DevicesModel();

								newDevice.name						= '';
								newDevice.associatedUser	= '';
								newDevice.modelName				= model;
								newDevice.serialNumber		= serial;

								newDevice.save((err) => {
									if (!err) { 
										res.status(200).send({
											status  : 'success',
											title   : 'Éxito',
											message : 'Dispositivo registrado con éxito.'
										});
									} else {
										res.status(200).send({
											status  : 'error',
											title   : 'Error!',
											message : 'Error al guardar el dispositivo.'
										});
									}
								});
							} else {
								res.status(200).send({  // Bad request
									status  : 'error',
									title   : 'Error!',
									message : 'Dispositivo ya registado.'
								});
							}
						} else {
							res.status(200).send({ // Server error
								status  : 'error',
								title   : 'Error!',
								message : 'Error al buscar el serial en la base de datos.'
							});
						}
					});
				} else {
					res.status(200).send({
						status  : 'error',
						title   : 'Error!',
						message : 'Datos no validos.',
						action  : 'reload'
					});
				}

			break;
			
			case 'delete':

				var serial = req.body.serial;

				// Comprobar que esten los datos
				if (serial != null) {
					//Eliminar el dispositivo
					DevicesModel.findOneAndDelete({'serialNumber' : serial}, function (err, data) {
						//Error al tratar de buscar el serial en la base de datos
						if (!err) {
							// Comprobar de que existan datos de un dispositivo
							if (data) {
								res.status(200).send({
									status  : 'success',
									title   : 'Éxito!',
									message : 'Dispositivo eliminado de la base de datos',
									action  : 'reload'
								});
							} else {
								res.status(200).send({
									status  : 'error',
									title   : 'Error!',
									message : 'Serial invalido o erroneo.'
								});
							}
						} else {
							res.status(200).send({
								status  : 'error',
								title   : 'Error!',
								message : 'Error del servidor.'
							});
						}
					});
				} else {
					res.status(200).send({
						status  : 'error',
						title   : 'Error!',
						message : 'Datos no validos.',
						action  : 'reload'
					});
				}


			break;

			case 'edit':

				var name   = req.body.name;
				var model   = req.body.model;
				var serial = req.body.serial;

				// Comprobar que esten los datos
				if (name != null && model != null && serial != null) {

					// Actualizar los datos del dispositivo
					const update = { 
						name 		 : name,
						modelName 	 : model,
						serialNumber : serial
					};

					var query	= {'serialNumber' : serial};
					DevicesModel.collection('devices').findOneAndUpdate(query, update, function (err, data) {
						if (!err) {
							res.status(200).send({
								status  : 'success',
								title   : 'Éxito!',
								message : 'Datos del dispositivo actualizados',
								action  : 'reload'
							});
						} else {
							res.status(200).send({
								status  : 'error',
								title   : 'Error!',
								message : 'Error del servidor.'
							});
						}
					});

				} else {
					res.status(200).send({
						status  : 'error',
						title   : 'Error!',
						message : 'Datos no validos.',
						action  : 'reload'
					});
				}

			break;

			default:
				res.status(200).send({
					status  : 'error',
					title   : 'Error!',
					message : 'Datos no validos.',
					action  : 'reload'
				});
			break;
		}
	} else {
		res.status(200).send({
			status	 	: 'error',
			title	  	: 'Error!',
			message		: 'Sesión no iniciada.',
			action	 	: 'redirect',
			redirectTo 	: '../'
		});
	}
});

module.exports = router;