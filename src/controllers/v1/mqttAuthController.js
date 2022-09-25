const uuidv4 = require('uuid').v4

const DeviceModel = require('../../models/DeviceModel')
const UserModel = require('../../models/UserModel')

const userAuth = (req, res) => {
  const session = req.session
  const email = session.RenderData.email || null

  if (email != null) {
    const v4 = uuidv4()

    const filter = { email: email.toString() }
    const update = {
      uuid: v4,
      authTime: Date.now()
    }

    UserModel.findOneAndUpdate(filter, update, { new: true }, function (error, _data) {
      if (error != null) {
        res.status(500).send({
          status: 'Server error',
          code: 1
        })
        return
      }
      res.status(200).send(v4)
    })
  } else {
    res.status(401).send({
      status: 'Unauthorized',
      code: 0
    })
  }
}

const deviceAuth = (req, res) => {
  const session = req.session
  const key = req.body.DeviceKey || null

  if (key != null) {
    const v4 = uuidv4()

    const filter = { autenticador: key }
    const update = { uuid: v4 }

    DeviceModel.findOneAndUpdate(filter, update, { new: true }, function (error, data) {
      if (error || data == null) {
        res.status(500).send({
          status: 'Server error',
          code: 1
        })
      } else {
        session.deviceStarted = true
        session.deviceAuth = data.serialNumber
        res.status(200).send(v4)
      }
    })
  } else {
    res.status(401).send({
      status: 'Unauthorized',
      code: 0
    })
  }
}

module.exports = {
  userAuth,
  deviceAuth
}
