
const DeviceModel = require('../../models/DeviceModel')

const attachDevice = (req, res) => {
  const session = req.session

  if (req.isAuthenticated()) {
    const name = req.body.name || null
    const serial = req.body.serial || null
    const userid = session.RenderData.userid

    if (name != null && serial != null) {
      const filter = {
        serialNumber: serial,
        associatedUser: ''
      }
      const update = {
        name,
        associatedUser: userid
      }

      DeviceModel.findOneAndUpdate(filter, update, function (err, data) {
        if (err) {
          res.status(200).json({
            status: 'error',
            code: 1,
            title: 'Error!',
            message: 'Un error en el servidor impide la ejecución.'
          })
        } else if (data) {
          res.status(200).json({
            status: 'success',
            title: 'Éxito!',
            message: 'Serial asociado a su cuenta',
            action: 'reload'
          })
        } else {
          res.status(200).json({
            status: 'error',
            code: 2,
            title: 'Error!',
            message: 'Serial incorrecto u ocupado por otro usuario.'
          })
        }
      })
    } else {
      res.status(200).json({
        status: 'error',
        title: 'Error!',
        message: 'Datos no validos.',
        action: 'reload'
      })
    }
  } else {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1,
      action: 'reload'
    })
  }
}

const editAttachDevice = (req, res) => {
  const session = req.session

  if (req.isAuthenticated()) {
    const name = req.body.name || null
    const serial = session.deviceSerial || null
    const userid = session.RenderData.userid

    if (name != null) {
      const filter = {
        serialNumber: serial,
        associatedUser: userid
      }
      const update = {
        name
      }

      DeviceModel.findOneAndUpdate(filter, update, function (err, data) {
        if (err) {
          res.status(200).json({
            status: 'error',
            code: 2,
            title: 'Error!',
            message: 'Un error en el servidor impide la ejecución.'
          })
        } else if (data) {
          res.status(200).json({
            status: 'success',
            title: 'Éxito!',
            message: 'Nombre del dispositivo actualizado',
            action: 'reload'
          })
        }
      })
    } else {
      res.status(200).json({
        status: 'error',
        title: 'Error!',
        message: 'Datos no validos.',
        action: 'reload'
      })
    }
  } else {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1,
      action: 'reload'
    })
  }
}

const detachDevice = (req, res) => {
  const session = req.session

  if (req.isAuthenticated()) {
    const serial = req.body.serial || null
    const userid = session.RenderData.userid

    if (serial != null) {
      const filter = {
        serialNumber: serial,
        associatedUser: userid
      }
      const update = {
        name: '',
        associatedUser: ''
      }

      DeviceModel.findOneAndUpdate(filter, update, function (err, data) {
        if (err) {
          res.status(200).json({
            status: 'error',
            code: 3,
            title: 'Error!',
            message: 'Un error en el servidor impide la ejecución.'
          })
        } else if (data) {
          res.status(200).json({
            status: 'success',
            title: 'Éxito!',
            message: 'Dispositivo desvinculado de su cuenta',
            action: 'reload'
          })
        } else {
          // Un error que no recuerdo
        }
      })
    } else {
      res.status(200).json({
        status: 'error',
        title: 'Error!',
        message: 'Datos no validos.',
        action: 'reload'
      })
    }
  } else {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1,
      action: 'reload'
    })
  }
}

module.exports = {
  attachDevice,
  editAttachDevice,
  detachDevice
}
