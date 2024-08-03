const userRouters = require('express').Router()
const accesoController = require('../../controllers/v1/accesoController')

/**********************************************
*User controller
* login    *
* logout   *
* register *
* recover  *
* forgot   *
* edit *
**********************************************/

// Accesible from localhost/v1/acceso/*

userRouters.post('/login', accesoController.loginUser)

userRouters.post('/logout', accesoController.logoutUser)

userRouters.post('/register', accesoController.registerUser)

userRouters.post('/recover', accesoController.recoverUser)

userRouters.post('/forgot', accesoController.forgotUser)

userRouters.post('/edit', accesoController.editUser)

module.exports = userRouters
