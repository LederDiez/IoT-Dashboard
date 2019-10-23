'user strict'

const bcrypt = require('bcrypt-nodejs');
const express = require('express');
const router = express.Router();
const db           = require('../models/session_conecction');
const UserSchema   = require('../models/user_schema');
const DeviceSchema = require('../models/device_schema');

/**********************************************
*	User Devices controllers
*	ADD 		* add device to user
*	DELETE 		* Delete user device
*	EDIT 		* Edit user device
*	CREATE 		* Create device     //DEPRECATED
*	SUPPRESS 	* Delete device     //DEPRECATED
**********************************************/
router.post("/device", function(req, res) {
    const action = req.body.action  || null;

    switch (action) {
        case 'add':
        
            const name   = req.body.name    || null;
            const serial = req.body.serial  || null;
            const mail = req.session.mail   || null;
            // Comprobar que esten los datos
            if (name != null && serial != null && mail != null) {
                // Buscar dispositivo en la base de datos
                DeviceSchema.findOne({'serial' : serial}, function (err, data) {
                    // Comprobar errores en la busqueda
                    if (!err) {
                        // Comprobar que se ha encontrado
                        if (data != null) {
                            // Comprobar que no este asociado a ningun usuario
                            if (data.user == '') {
                                // Registar como de este usuario
                                data.name = name;
                                data.user = mail;
                                var query    = {'serial' : serial};
                                db.collection('devices').findOneAndUpdate(query, data, function (err, doc) {
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
            const name   = req.body.name    || null;
            const serial = req.body.serial  || null;
            const mail = req.session.mail   || null;
            // Comprobar que esten los datos
            if (name != null && serial != null && mail != null) {
                // Buscar dispositivo en la base de datos
                DeviceSchema.findOne({'serial' : serial}, function (err, data) {
                    // Comprobar errores en la busqueda
                    if (!err) {
                        // Comprobar que se ha encontrado
                        if (data != null) {
                            // Comprobar que este asociado al usuario
                            if (data.user == mail) {
                                // Actualizar los datos del dispositivo
                                data.name = name;
                                data.user = mail;
                                var query    = {'serial' : serial};
                                db.collection('devices').findOneAndUpdate(query, data, function (err, doc) {
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
            const serial = req.body.serial  || null;
            const mail = req.session.mail   || null;
            // Comprobar que esten los datos
            if (serial != null && mail != null) {
                // Buscar dispositivo en la base de datos
                DeviceSchema.findOne({'serial' : serial}, function (err, data) {
                    // Comprobar errores en la busqueda
                    if (!err) {
                        // Comprobar que se ha encontrado
                        if (data != null) {
                            // Comprobar que este asociado al usuario
                            if (data.user == mail) {
                                // Actualizar los datos del dispositivo
                                data.name = '';
                                data.user = '';
                                var query    = {'serial' : serial};
                                db.collection('devices').findOneAndUpdate(query, data, function (err, doc) {
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
});

/**********************************************
*	User controller
* 	login 		* 
*	logout 		* 
*	register	* 
*	recover		* 
*	remember	* 
*	edit     	* 
**********************************************/
router.post("/user", function(req, res) {

    const page  = req.body.page  || null;
    const user  = req.body.user  || null;
    const mail  = req.body.mail  || null;
    const pass1 = req.body.pass1 || null;
    const pass2 = req.body.pass2 || null;

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
                    // Busca el email en la base de datos
                    UserSchema.findOne({'mail': mail}, function (err, data) {
                        if (!err) {
                            if (data) {
                                if (validPassword(pass1, data.pass)) {

                                    req.session.IsStarted = true;
                                    req.session.user    = data.user;
                                    req.session.mail    = data.mail;
                                    req.session.imag    = data.imag;
                                    req.session.devices = data.devices;
                                    
                                    res.status(200).send({
                                        status     : 'success',
                                        title      : 'Éxito',
                                        message    : 'Sesion iniciada.',
                                        action     : 'redirect',
                                        redirectTo : './consola'
                                    });
                                } else {
                                    res.status(200).send({
                                        status  : 'error',
                                        title   : 'Error!',
                                        message : 'Contraseña incorrecta.'
                                    });
                                }
                            } else {
                                res.status(200).send({
                                    status  : 'error',
                                    title   : 'Error!',
                                    message : 'Email no registrado.'
                                });
                            }
                        } else {
                            res.status(200).send({
                                status  : 'error',
                                title   : 'Error!',
                                message : 'No se puede iniciar sesión, error del servidor'
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
            } else {
                res.status(200).send({
                    status     : 'error',
                    title      : 'Error!',
                    message    : 'Sesión ya iniciada.',
                    action     : 'redirect',
                    redirectTo : './consola'
                });
            }
            break;

        case 'logout':
            if (IsStarted) {
                // delete session object
                req.session.destroy(function(err) {
                    if(!err) {
                        res.status(200).send({
                            status     : 'success',
                            title      : 'Éxito',
                            message    : 'Sesión destruida.',
                            action     : 'redirect',
                            redirectTo : '/'
                        });
                    } else {
                        res.status(200).send({
                            status  : 'error',
                            title   : 'Error!',
                            message : 'La sesión no pudo ser destruida.'
                        });
                    }
                });
            } else {
                res.status(200).send({
                    status     : 'success',
                    title      : 'Éxito',
                    message    : 'Sesión destruida.',
                    action     : 'redirect',
                    redirectTo : '/'
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
                            UserSchema.findOne({'mail': mail}, function (err, data) {
                                //Error al tratar de buscar el mail en la base de datos
                                if (!err) {
                                    // Comprobar de que no existan datos de un usuario
                                    if (!data) {
                                        
                                        const newUser = new UserSchema();
    
                                        newUser.user    = user;
                                        newUser.mail    = mail;
                                        newUser.pass    = generateHash(pass1);
                                        newUser.devices = "";
                                        newUser.imag    = "";
    
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
                                                    title   : 'Error!',
                                                    message : 'El usuario no pudo ser registrado.'
                                                });
                                            }
                                        });
                                    } else {
                                        res.status(200).send({  // Bad request
                                            status  : 'error',
                                            title   : 'Error!',
                                            message : 'Email ya registado.'
                                        });
                                    }
                                } else {
                                    res.status(200).send({ // Server error
                                        status  : 'error',
                                        title   : 'Error!',
                                        message : 'El usuario no pudo ser registrado.'
                                    });
                                }
                            });
                        } else {
                            res.status(200).send({  // Unauthorized
                                status  : 'error',
                                title   : 'Error!',
                                message : 'Contraseñas no validas.',
                                action  : 'reload'
                            });
                        }
                    } else {
                        res.status(200).send({
                            status  : 'error',
                            title   : 'Error!',
                            message : 'Datos no validos.',
                            action  : 'reload'
                        });
                    }
                } else {
                    res.status(200).send({
                        status  : 'error',
                        title   : 'Error!',
                        message : 'Datos no validos.',
                        action  : 'reload'
                    });
                }
            } else {
                res.status(200).send({
                    status     : 'error',
                    title      : 'Error!',
                    message    : 'Sesión ya iniciada.',
                    action     : 'redirect',
                    redirectTo : './consola'
                });
            }
            break;

        case 'recover':
            
            break;

        case 'remember':
            
            break;

        case 'edit':
            
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
});

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

module.exports = router;