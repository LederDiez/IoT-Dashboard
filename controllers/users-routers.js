'user strict'

const express = require('express');
const router  = express.Router();

const bcrypt  = require('bcrypt-nodejs');
const { UserModel }   = require('../models/connection_models');

// generating a hashs
function generateHash (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
function validPassword (pass1, pass2) {
	return bcrypt.compareSync(pass1, pass2);
};

function validarEmail(valor) {
	if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)){
		return true;
	} else {
		return false;
	}
}

/**********************************************
*	User controller
*   login 		* 
*	logout 		* 
*	register	* 
*	recover		* 
*	forgot  	* 
*	edit	 	* 
**********************************************/
router.post("/user", function(req, res) {

	const page  = req.body.page  || null;
	const user  = req.body.user  || null;
	const mail  = req.body.mail  || null;
	const pass1 = req.body.pass1 || null;
	const pass2 = req.body.pass2 || null;
	const check = req.body.check || null;
	const pass3 = req.body.pass3 || null;

	var IsStarted = false;

	if (req.session.IsStarted != null) {
		IsStarted = req.session.IsStarted;
	}
	
	switch (page) {
		case 'login':
			// Comprobar que la secion no este iniciada
			if (!IsStarted) {
				// Comprobar que esten todos los datos
				if (mail != null || pass1 != null) {

					const filter = { 'mail': mail };
					const update = { 'lastLogin': Date.now() };

					// Busca el email en la base de datos
					UserModel.findOneAndUpdate(filter, update, function (err, data) {
						if (!err) {
							if (data) {
								if (validPassword(pass1, data.pass)) {

									req.session.IsStarted = true;
									req.session.userid  = data.id;
									req.session.user	= data.user;
									req.session.mail	= data.mail;
									req.session.check   = data.check;
									req.session.type	= data.type;

									if (data.type == "admin") {
										res.status(200).send({
											status	 : 'success',
											title	  : 'Éxito',
											message	: 'Sesion iniciada.',
											action	 : 'redirect',
											redirectTo : '../admin'
										});
									} else if (data.type == "client") {
										res.status(200).send({
											status	 : 'success',
											title	  : 'Éxito',
											message	: 'Sesion iniciada.',
											action	 : 'redirect',
											redirectTo : '../consola'
										});
									}
									
								} else {
									res.status(200).send({
										status  : 'error',
										code		: 1,
										title   : 'Error!',
										message : 'Contraseña incorrecta.'
									});
								}
							} else {
								res.status(200).send({
									status  : 'error',
									code		: 2,
									title   : 'Error!',
									message : 'Email no registrado.'
								});
							}
						} else {
							res.status(200).send({
								status  : 'error',
								code		: 3,
								title   : 'Error!',
								message : 'No se puede iniciar sesión, error del servidor'
							});
						}
					});
				} else {
					res.status(200).send({
						status  : 'error',
						code		: 4,
						title   : 'Error!',
						message : 'Datos no validos.',
						action  : 'reload'
					});
				}
			} else {
				res.status(200).send({
					status	 : 'error',
					code		: 5,
					title	  : 'Error!',
					message	: 'Sesión ya iniciada.',
					action	 : 'redirect',
					redirectTo : './consola'
				});
			}
			break;

		case 'logout':
			if (IsStarted) {
				// delete session object
				req.session = null;
				res.status(200).send({
					status	 : 'success',
					title	  : 'Éxito',
					message	: 'Sesión destruida.',
					action	 : 'redirect',
					redirectTo : '../acceso'
				});
			} else {
				res.status(200).send({
					status	 : 'error',
					code		: 6,
					title	  : 'Error!',
					message	: 'Sesión ya destruida.',
					action	 : 'redirect',
					redirectTo : '../acceso'
				});
			}
			break;
	
		case 'register':
			// Comprobar que la secion no este iniciada
			if (!IsStarted) {
				// Comprobar que esten todos los datos
				if (user != null || mail != null || pass1 != null || pass2 != null) {
					// Comprobar que es un mail valido
					if (validarEmail(mail)) {
						if (pass1 === pass2) {
							// Comprobar que el mail no este registrado
							// data es la informacion del usuario encontrado con ese mail
							UserModel.findOne({'mail': mail}, function (err, data) {
								//Error al tratar de buscar el mail en la base de datos
								if (!err) {
									// Comprobar de que no existan datos de un usuario
									if (!data) {
										
										const newUser = new UserModel();
	
										newUser.type   = 'client';
										newUser.user   = user;
										newUser.mail   = mail;
										newUser.pass   = generateHash(pass1);
										newUser.check  = false;
	
										newUser.save((err) => {
											if (!err) { 
												res.status(200).send({
													status  : 'success',
													title   : 'Éxito',
													message : 'Usuario registrado con éxito.',
													action  : 'show',
													toShow  : 'login'
												});
											} else {
												res.status(200).send({
													status  : 'error',
													code		: 7,
													title   : 'Error!',
													message : 'El usuario no pudo ser registrado.'
												});
											}
										});
									} else {
										res.status(200).send({  // Bad request
											status  : 'error',
											code		: 8,
											title   : 'Error!',
											message : 'Email ya registado.'
										});
									}
								} else {
									res.status(200).send({ // Server error
										status  : 'error',
										code		: 9,
										title   : 'Error!',
										message : 'El usuario no pudo ser registrado.'
									});
								}
							});
						} else {
							res.status(200).send({  // Unauthorized
								status  : 'error',
								code		: 10,
								title   : 'Error!',
								message : 'Contraseñas no validas.',
								action  : 'reload'
							});
						}
					} else {
						res.status(200).send({
							status  : 'error',
							code		: 11,
							title   : 'Error!',
							message : 'Correo invalido.',
							action  : 'reload'
						});
					}
				} else {
					res.status(200).send({
						status  : 'error',
						code		: 12,
						title   : 'Error!',
						message : 'Datos no validos.',
						action  : 'reload'
					});
				}
			} else {
				res.status(200).send({
					status	 : 'error',
					code		: 13,
					title	  : 'Error!',
					message	: 'Sesión ya iniciada.',
					action	 : 'redirect',
					redirectTo : '../consola'
				});
			}
			break;

		case 'recover':
			res.status(200).send({
				status  : 'success',
				title   : 'Exito!',
				message : 'Pero no disponible de momento.'
			});
			break;

		case 'forgot':
			res.status(200).send({
				status  : 'success',
				title   : 'Exito!',
				message : 'Pero no disponible de momento.'
			});
			break;

		case 'edit':
			let error = false;
			// Comprobar que la secion este iniciada
			if (IsStarted) {
				// Comprobar que el mail este registrado
				// data es la informacion del usuario encontrada con ese mail
				UserModel.findOne({'mail': req.session.mail}, function (err, data) {
					//Error al tratar de buscar el mail en la base de datos
					if (!err) {
						// Comprobar de que no existan datos de un usuario
						if (data) {
							if (validPassword(pass3, data.pass)) {
								if (user != null) {
									data.user = user;
								}
								if (mail != null) {
									// Comprobar que el nuevo mail es valido
									if (validarEmail(mail)) {
										data.mail = mail;
									} else {
										// Nuevo correo invalido
										res.status(200).send({
											status  : 'error',
											code		: 14,
											title   : 'Error!',
											message : 'Correo invalido.'
										});
										error = true;
									}
								}
								if (pass1 != null && pass2 != null) {
									// Comprobar contraseñas
									if (pass1 === pass2) {
										data.pass = generateHash(pass1);
									} else {
										// Contraseñas invalidas // no deberia ocurrir
										res.status(200).send({  // Unauthorized
											status  : 'error',
											code		: 15,
											title   : 'Error!',
											message : 'Contraseñas no validas.',
											action  : 'reload'
										});
										error = true;
									}
								}
								if (check) {
									data.check = check;
								}
								if (!error) {
									data.save(function (err, updateData) {
										if (!err) {
											res.status(200).send({
												status  : 'success',
												title   : 'Éxito!',
												message : 'Datos de usuario guardados correctamente.',
												action  : 'logout'
											});
										} else {
											res.status(200).send({ // Server error
												status  : 'error',
												code		: 16,
												title   : 'Error!',
												message : 'El usuario no pudo ser modificado. ERROR CODE #1',
											});
										}
									});
								}
							} else {
								res.status(200).send({
									status  : 'error',
									code		: 17,
									title   : 'Error!',
									message : 'Contraseña de usuario incorrecta.'
								});
							}
						} else {
							res.status(200).send({
								status  : 'error',
								code		: 18,
								title   : 'Error!',
								message : 'Email no registrado.'
							});
						}
					} else {
						res.status(200).send({ // Server error
							status  : 'error',
							code		: 19,
							title   : 'Error!',
							message : 'El usuario no pudo ser modificado. ERROR CODE #2'
						});
					}
				});
			} else {
				res.status(200).send({
					status	 : 'error',
					code		: 0,
					title	  : 'Error!',
					message	: 'Sesión no iniciada.',
					action	 : 'redirect',
					redirectTo : '../'
				});
			}
			break;

		default:
			res.status(200).send({
				status  : 'error',
				code		: 0,
				title   : 'Error!',
				message : 'Datos no validos.',
				action  : 'reload'
			});
		break;
	}
});

module.exports = router;