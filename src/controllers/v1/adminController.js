const DeviceModel = require('../../models/DeviceModel.js')

const adminDevice = (req, res) => {
  const action = req.body.action

  const session = req.session
  const IsStarted = session.IsStarted || false

  if (IsStarted) {
    switch (action) {
      case 'all': {
        DeviceModel.find({}, function (err, data) {
          if (!err) {
            if (data) {
              const serials = []
              for (let i = 0; i < data.length; i++) {
                serials.push(data[i].serialNumber)
              }
              res.status(200).send(serials)
            } else {
              res.status(200).send({
                status: 'error',
                title: 'Error!',
                message: 'Serial invalido o erroneo.'
              })
            }
          } else {
            res.status(200).send({
              status: 'error',
              title: 'Error!',
              message: 'Error del servidor.'
            })
          }
        })

        break
      }
      case 'get': {
        const serial = req.body.serial

        DeviceModel.findOne({ serialNumber: serial }, function (err, data) {
          if (!err) {
            if (data) {
              res.status(200).send(data)
            } else {
              res.status(200).send({
                status: 'error',
                title: 'Error!',
                message: 'Serial invalido o erroneo.'
              })
            }
          } else {
            res.status(200).send({
              status: 'error',
              title: 'Error!',
              message: 'Error del servidor.'
            })
          }
        })

        break
      }
      case 'add': {
        const serial = req.body.serial
        const model = req.body.model

        // Comprobar que esten los datos
        if (serial != null && model != null) {
          // Comprobar que el serial no este registrado
          DeviceModel.findOne({ serialNumber: serial }, function (err, data) {
            // Error al tratar de buscar el serial en la base de datos
            if (!err) {
              // Comprobar de que no existan datos de un dispositivo
              if (!data) {
                const newDevice = new DeviceModel()

                newDevice.name = ''
                newDevice.associatedUser = ''
                newDevice.modelName = model
                newDevice.serialNumber = serial

                newDevice.save((err) => {
                  if (!err) {
                    res.status(200).send({
                      status: 'success',
                      title: 'Éxito',
                      message: 'Dispositivo registrado con éxito.'
                    })
                  } else {
                    res.status(200).send({
                      status: 'error',
                      title: 'Error!',
                      message: 'Error al guardar el dispositivo.'
                    })
                  }
                })
              } else {
                res.status(200).send({ // Bad request
                  status: 'error',
                  title: 'Error!',
                  message: 'Dispositivo ya registado.'
                })
              }
            } else {
              res.status(200).send({ // Server error
                status: 'error',
                title: 'Error!',
                message: 'Error al buscar el serial en la base de datos.'
              })
            }
          })
        } else {
          res.status(200).send({
            status: 'error',
            title: 'Error!',
            message: 'Datos no validos.',
            action: 'reload'
          })
        }

        break
      }
      case 'delete': {
        const serial = req.body.serial

        // Comprobar que esten los datos
        if (serial != null) {
          // Eliminar el dispositivo
          DeviceModel.findOneAndDelete({ serialNumber: serial }, function (err, data) {
            // Error al tratar de buscar el serial en la base de datos
            if (!err) {
              // Comprobar de que existan datos de un dispositivo
              if (data) {
                res.status(200).send({
                  status: 'success',
                  title: 'Éxito!',
                  message: 'Dispositivo eliminado de la base de datos',
                  action: 'reload'
                })
              } else {
                res.status(200).send({
                  status: 'error',
                  title: 'Error!',
                  message: 'Serial invalido o erroneo.'
                })
              }
            } else {
              res.status(200).send({
                status: 'error',
                title: 'Error!',
                message: 'Error del servidor.'
              })
            }
          })
        } else {
          res.status(200).send({
            status: 'error',
            title: 'Error!',
            message: 'Datos no validos.',
            action: 'reload'
          })
        }

        break
      }
      case 'edit': {
        const name = req.body.name
        const model = req.body.model
        const serial = req.body.serial

        // Comprobar que esten los datos
        if (name != null && model != null && serial != null) {
          // Actualizar los datos del dispositivo
          const update = {
            name,
            modelName: model,
            serialNumber: serial
          }

          const query = { serialNumber: serial }
          DeviceModel.findOneAndUpdate(query, update, function (err, _data) {
            if (!err) {
              res.status(200).send({
                status: 'success',
                title: 'Éxito!',
                message: 'Datos del dispositivo actualizados',
                action: 'reload'
              })
            } else {
              res.status(200).send({
                status: 'error',
                title: 'Error!',
                message: 'Error del servidor.'
              })
            }
          })
        } else {
          res.status(200).send({
            status: 'error',
            title: 'Error!',
            message: 'Datos no validos.',
            action: 'reload'
          })
        }

        break
      }
      default: {
        res.status(200).send({
          status: 'error',
          title: 'Error!',
          message: 'Datos no validos.',
          action: 'reload'
        })
        break
      }
    }
  } else {
    res.status(200).send({
      status: 'error',
      title: 'Error!',
      message: 'Sesión no iniciada.',
      action: 'redirect',
      redirectTo: '../'
    })
  }
}

module.exports = adminDevice
