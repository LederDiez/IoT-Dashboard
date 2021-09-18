'user strict'

const express = require('express');
const router  = express.Router();

const { DevicesModel } = require('../../models/connection_models');

/**********************************************
*	User Devices controllers
*	ADD 			* add device to user
*	DELETE 		* Delete user device
*	EDIT 			* Edit user device
**********************************************/
router.post("/device", function(req, res) {

	const action = req.body.action;
	var IsStarted = false;

	if (req.session.IsStarted != null) {
		IsStarted = req.session.IsStarted;
	}
	if (IsStarted) {
		switch (action) {
			case 'add':
				
				var name   = req.body.name;
				var serial = req.body.serial;
				var userid = req.session.userid;
				
				// Comprobar que esten los datos
				if (name != null && serial != null && userid != null) {
					// Buscar dispositivo en la base de datos
					DeviceSchema.findOne({'serialNumber' : serial}, function (err, data) {
						// Comprobar errores en la busqueda
						if (!err) {
							// Comprobar que se ha encontrado
							if (data != null) {
								// Comprobar que no este asociado a ningun usuario
								if (data.associatedUser == '') {
									// Registar como de este usuario
									data.name = name;
									data.associatedUser = userid;
									data.save(function (err, updateData) {
										if (!err) {
											res.status(200).send({
												status  : 'success',
												title   : 'Éxito!',
												message : 'Dispositivo asociado a su cuenta',
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
										message : 'Dispositivo asociado a otro usuario.'
									});
								}
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
				var serial = req.body.serial;
				var userid = req.session.userid;

				var query	= {'serialNumber' : serial};

				// Comprobar que esten los datos
				if (name != null && serial != null && userid != null) {
					// Buscar dispositivo en la base de datos
					DeviceSchema.findOne(query, function (err, data) {
						// Comprobar errores en la busqueda
						if (!err) {
							// Comprobar que se ha encontrado
							if (data != null) {
								// Comprobar que este asociado al usuario
								if (data.associatedUser == userid) {
									// Actualizar los datos del dispositivo
									data.name = name;
									data.associatedUser = userid;
									DeviceSchema.findOneAndUpdate(query, data, function (err, doc) {
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
										message : 'Dispositivo no asociado a este usuario.'
									});
								}
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

			case 'delete':
				var serial = req.body.serial  		|| null;
				var userid = req.session.userid   || null;

				var query	= {'serialNumber' : serial};

				// Comprobar que esten los datos
				if (serial != null && userid != null) {
					// Buscar dispositivo en la base de datos
					DeviceSchema.findOne(query, function (err, data) {
						// Comprobar errores en la busqueda
						if (!err) {
							// Comprobar que se ha encontrado
							if (data != null) {
								// Comprobar que este asociado al usuario
								if (data.user == userid) {
									// Actualizar los datos del dispositivo
									data.name = '';
									data.associatedUser = '';
									DeviceSchema.findOneAndUpdate(query, data, function (err, doc) {
										if (!err) {
											res.status(200).send({
												status  : 'success',
												title   : 'Éxito!',
												message : 'Dispositivo eliminado de su cuenta',
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
										message : 'Dispositivo no asociado a este usuario.'
									});
								}
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
			status	 : 'error',
			title	  : 'Error!',
			message	: 'Sesión no iniciada.',
			action	 : 'redirect',
			redirectTo : '../'
		});
	}
});

module.exports = router;