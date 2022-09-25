const passport = require('passport')
const validator = require('email-validator')

const UserModel = require('../../models/UserModel')

const loginUser = (req, res) => {
  if (req.isAuthenticated()) {
    // Redirect to consola
    res.status(200).send({
      status: 'error',
      code: 1,
      title: 'Error!',
      message: 'Sesión ya iniciada.',
      action: 'redirect',
      redirectTo: '../'
    })
    return
  }

  const username = req.body.username || null
  const password = req.body.password || null
  // const demo = req.body.demo || false

  if (username != null && password != null) {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.log(err)
        res.status(200).send({
          status: 'error',
          code: 2,
          title: 'Error!',
          message: 'No se puede iniciar sesión, error de autenticación.'
        })
      } else {
        if (!user) {
          res.status(200).send({
            status: 'error',
            code: 3,
            title: 'Error!',
            message: 'Email o contraseña incorrecta.'
          })
        } else {
          req.login(user, (err) => {
            if (err) {
              res.status(200).send({
                status: 'error',
                code: 4,
                title: 'Error!',
                message: 'No se puede iniciar sesión, error de inicio de sesión.'
              })
            } else {
              if (user.type === 'admin') {
                res.status(200).send({
                  status: 'success',
                  title: 'Éxito',
                  message: 'Sesion iniciada.',
                  action: 'redirect',
                  redirectTo: '../../admin/'
                })
              } else {
                // Redirect to consola
                res.status(200).send({
                  status: 'success',
                  title: 'Éxito',
                  message: 'Sesion iniciada.',
                  action: 'redirect',
                  redirectTo: '../consola'
                })
              }
            }
          })
        }
      }
    })(req, res)
  } else {
    res.status(200).send({
      status: 'error',
      code: 5,
      title: 'Error!',
      message: 'Datos no validos.',
      action: 'reload'
    })
  }
}

const logoutUser = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) {
        console.log(err)
        res.status(200).send({
          status: 'error',
          code: 1,
          title: 'Error!',
          message: 'No se pudo cerrar sesión, error del servidor'
        })
        return
      }

      res.status(200).send({
        status: 'success',
        title: 'Éxito',
        message: 'Sesión destruida.',
        action: 'redirect',
        redirectTo: './acceso'
      })
    })
  } else {
    res.status(200).send({
      status: 'error',
      code: 2,
      title: 'Error!',
      message: 'Sesión ya destruida.',
      action: 'redirect',
      redirectTo: './acceso'
    })
  }
}

const registerUser = (req, res) => {
  const username = req.body.username || null
  const email = req.body.email || null
  const password = req.body.password || null

  // Comprobar que la secion no este iniciada
  if (req.isAuthenticated()) {
    res.status(200).json({
      status: 'error',
      code: 1,
      title: 'Error!',
      message: 'Sesión ya iniciada.',
      action: 'redirect',
      redirectTo: '../'
    })
    return
  }

  // Comprobar que esten todos los datos
  if (username != null && email != null && password != null) {
    if (validator.validate(email)) {
      const User = new UserModel({
        type: 'client',
        username,
        email,
        active: true
      })

      UserModel.register(User, password, (err) => {
        if (err) {
          if (err.name === 'UserExistsError') {
            res.status(200).send({
              status: 'error',
              code: 2,
              title: 'Error!',
              message: 'Email ya registado.'
            })
          } else {
            res.status(200).send({
              status: 'error',
              code: 3,
              title: 'Error!',
              message: 'El usuario no pudo ser registrado, server error.'
            })
          }
          return
        }

        res.status(200).send({
          status: 'success',
          title: 'Éxito',
          message: 'Usuario registrado con éxito.',
          action: 'show',
          toShow: 'login'
        })
      })
    } else {
      res.status(200).send({
        status: 'error',
        code: 4,
        title: 'Error!',
        message: 'Correo invalido.',
        action: 'reload'
      })
    }
  } else {
    res.status(200).send({
      status: 'error',
      code: 5,
      title: 'Error!',
      message: 'Datos no validos.',
      action: 'reload'
    })
  }
}

const recoverUser = (req, res) => {
  const session = req.session
  const IsStarted = session.IsStarted || false

  // Comprobar que la secion no este iniciada
  if (IsStarted) {
    res.status(200).send({
      status: 'error',
      code: 5,
      title: 'Error!',
      message: 'Sesión ya iniciada.',
      action: 'redirect',
      redirectTo: '../'
    })
    return
  }

  res.status(200).send({
    status: 'success',
    title: 'Exito!',
    message: 'Pero no disponible de momento.'
  })
}

const forgotUser = (req, res) => {
  const session = req.session
  const IsStarted = session.IsStarted || false

  // Comprobar que la secion no este iniciada
  if (IsStarted) {
    res.status(200).send({
      status: 'error',
      code: 5,
      title: 'Error!',
      message: 'Sesión ya iniciada.',
      action: 'redirect',
      redirectTo: '../'
    })
    return
  }

  res.status(200).send({
    status: 'success',
    title: 'Exito!',
    message: 'Pero no disponible de momento.'
  })
}

const editUser = (req, res) => {
  const session = req.session
  const IsStarted = session.IsStarted || false

  // Comprobar que la secion no este iniciada
  if (IsStarted) {
    res.status(200).send({
      status: 'error',
      code: 5,
      title: 'Error!',
      message: 'Sesión ya iniciada.',
      action: 'redirect',
      redirectTo: '../'
    })
    return
  }

  const user = req.body.user || null
  const email = req.body.email || null
  const pass1 = req.body.pass1 || null
  const pass2 = req.body.pass2 || null
  const check = req.body.check || null
  const pass3 = req.body.pass3 || null

  let error = false
  // Comprobar que la secion este iniciada
  if (IsStarted) {
    // Comprobar que el email este registrado
    // data es la informacion del usuario encontrada con ese email
    UserModel.findOne({ email: session.email }, (err, data) => {
      // Error al tratar de buscar el email en la base de datos
      if (!err) {
        // Comprobar de que no existan datos de un usuario
        if (data) {
          if (validPassword(pass3, data.pass)) {
            if (user != null) {
              data.user = user
            }
            if (email != null) {
              // Comprobar que el nuevo email es valido
              if (validarEmail(email)) {
                data.email = email
              } else {
                // Nuevo correo invalido
                res.status(200).send({
                  status: 'error',
                  code: 14,
                  title: 'Error!',
                  message: 'Correo invalido.'
                })
                error = true
              }
            }
            if (pass1 != null && pass2 != null) {
              // Comprobar contraseñas
              if (pass1 === pass2) {
                data.pass = generateHash(pass1)
              } else {
                // Contraseñas invalidas // no deberia ocurrir
                res.status(200).send({ // Unauthorized
                  status: 'error',
                  code: 15,
                  title: 'Error!',
                  message: 'Contraseñas no validas.',
                  action: 'reload'
                })
                error = true
              }
            }
            if (check) {
              data.check = check
            }
            if (!error) {
              data.save((err, _updateData) => {
                if (!err) {
                  res.status(200).send({
                    status: 'success',
                    title: 'Éxito!',
                    message: 'Datos de usuario guardados correctamente.',
                    action: 'logout'
                  })
                } else {
                  res.status(200).send({ // Server error
                    status: 'error',
                    code: 16,
                    title: 'Error!',
                    message: 'El usuario no pudo ser modificado. ERROR CODE #1'
                  })
                }
              })
            }
          } else {
            res.status(200).send({
              status: 'error',
              code: 17,
              title: 'Error!',
              message: 'Contraseña de usuario incorrecta.'
            })
          }
        } else {
          res.status(200).send({
            status: 'error',
            code: 18,
            title: 'Error!',
            message: 'Email no registrado.'
          })
        }
      } else {
        res.status(200).send({ // Server error
          status: 'error',
          code: 19,
          title: 'Error!',
          message: 'El usuario no pudo ser modificado. ERROR CODE #2'
        })
      }
    })
  } else {
    res.status(200).send({
      status: 'error',
      code: 0,
      title: 'Error!',
      message: 'Sesión no iniciada.',
      action: 'redirect',
      redirectTo: '../consola/'
    })
  }
}

module.exports = {
  loginUser,
  logoutUser,
  registerUser,
  recoverUser,
  forgotUser,
  editUser
}
