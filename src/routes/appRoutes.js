const express = require('express')
const path = require('path')
const fs = require('fs')

const DeviceModel = require('../models/DeviceModel')
const UserModel = require('../models/UserModel')

const webRouter = express.Router()

webRouter.get('/', (_req, res) => {
  res.render('web/index')
})

webRouter.get('/consola/acceso/', (req, res) => {
  if (req.isAuthenticated()) {
    const user = req.user

    if (user.type === 'admin') {
      res.redirect('../../admin/')
    } else {
      res.redirect('../')
    }
  } else {
    res.render('acceso/index', {
      title: 'Acceso'
    })
  }
})

webRouter.get('/consola/', (req, res) => {
  const session = req.session
  const query = req.query

  if (req.isAuthenticated()) {
    const user = req.user

    let RenderData = {
      userid: user.id,
      username: user.username,
      email: user.email,
      active: user.active,
      deviceName: '',
      modelName: null,
      deviceSerial: null,
      devices: null
    }

    /* Indica que dispositivo tiene seleccionado el usuario */
    let deviceId = query.device || 0

    if (session.RenderData) {
      RenderData = session.RenderData
      if (RenderData.devices.length <= deviceId) {
        req.query.device = '0'
        deviceId = 0
      }

      RenderData.deviceName = RenderData.devices[deviceId].name
      RenderData.modelName = RenderData.devices[deviceId].modelName
      RenderData.deviceSerial = RenderData.devices[deviceId].serialNumber
      res.render('consola/index', RenderData)
    } else {
      DeviceModel.find({ associatedUser: user.id }, function (err, result) {
        if (err) {
          res.status(500).send('Error del servidor')
          return
        }
        if (result.toString() !== '') {
          if (result.length <= deviceId) {
            req.query.device = '0'
            deviceId = 0
          }

          RenderData.devices = result
          RenderData.deviceName = RenderData.devices[deviceId].name
          RenderData.modelName = RenderData.devices[deviceId].modelName
          RenderData.deviceSerial = RenderData.devices[deviceId].serialNumber
          
          session.RenderData = RenderData
          res.render('consola/index', RenderData)

          const email = user.email
          UserModel.updateOne({ email }, { device: result[deviceId] }, function (_err, _result) {})
        } else {
          session.RenderData = RenderData
          res.render('consola/index', RenderData)
        }
      })
    }
  } else {
    res.redirect('./acceso/')
  }
})

webRouter.post('/models', (req, res) => {
  const session = req.session

  if (req.isAuthenticated()) {
    const viewName = req.body.viewName || null
    const model = session.RenderData.modelName

    if (viewName != null) {
      const file = 'models/' + viewName + '/' + model + '/index.ejs'
      const filePath = '../../views/' + file
      const ModelView = path.join(__dirname, filePath)

      fs.access(ModelView, (error) => {
        if (error) {
          res.render('models/error/index', { viewName })
        } else {
          res.render(file, { viewName })
        }
      })
    } else {
      res.redirect('../consola/acceso/')
    }
  } else {
    res.redirect('../consola/acceso/')
  }
})

webRouter.get('/admin', (req, res) => {
  const session = req.session

  res.render('admin/index', {
    title: 'Administrador',
    user: session.user
  })
})

webRouter.get('/simuladores/inversor', (_req, res) => {
  res.render('simuladores/inversor', {
    title: 'Simulador web'
  })
})

module.exports = webRouter
