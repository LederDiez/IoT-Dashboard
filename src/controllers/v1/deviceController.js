
const DeviceModel = require('../../models/DeviceModel')

function updateDevicesInformation(user, session) {

  RenderData = session.RenderData;

  DeviceModel.find({ associatedUser: user.id }, function (err, result) {
    if (err) {
      return
    }

    RenderData.associatedDevices = result.length

    if (result.length > 0) {

      RenderData.devices = result
      RenderData.deviceName = RenderData.devices[0].name
      RenderData.modelName = RenderData.devices[0].modelName
      RenderData.deviceSerial = RenderData.devices[0].serialNumber
      
      session.RenderData = RenderData

      const email = user.email
      UserModel.updateOne({ email }, { device: result[0] }, function (_err, _result) {})
    }
    
  })
}

const attachDevice = (req, res) => {
  const session = req.session

  if (!req.isAuthenticated()) {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1,
      action: 'reload'
    })
    return
  }

  const user = req.user || null
  const name = req.body.name || null
  const serial = req.body.serial || null
  const userid = session.RenderData.userid || null

  if (user == null || name == null || serial == null || userid == null) {
    res.status(200).json({
      status: 'error',
      title: 'Error!',
      message: 'Datos no validos.',
      action: 'reload'
    })
    return
  }

  const filter = {
    serialNumber: serial,
    associatedUser: ''
  }
  const update = {
    name,
    associatedUser: userid
  }

  console.log(user);
  
  res.status(200).json({
    status: 'error',
    title: 'Error!',
    message: 'Datos no validos.',
    action: 'reload'
  })
  return

  DeviceModel.findOneAndUpdate(filter, update, function (err, data) {

    if (err) {
      res.status(200).json({
        status: 'error',
        code: 1,
        title: 'Error!',
        message: 'Un error en el servidor impide la ejecución.'
      })
      return
    }

    if (!data) {
      res.status(200).json({
        status: 'error',
        code: 2,
        title: 'Error!',
        message: 'Serial incorrecto u ocupado por otro usuario.'
      })
      return
    }

    updateDevicesInformation(user, session)

    res.status(200).json({
      status: 'success',
      title: 'Éxito!',
      message: 'Serial asociado a su cuenta',
      action: 'reload'
    })

  })
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
