const express = require('express')
const path = require('path')
const fs = require('fs')

const DeviceModel = require('../models/DeviceModel')
const UserModel = require('../models/UserModel')

const webRouter = express.Router()

webRouter.get('/', (_req, res) => {
  res.render('web/index')
})

webRouter.get('/acceso/', (req, res) => {

  if (!req.isAuthenticated()) {
    res.render('acceso/index', {
      title: 'Acceso'
    })
    return;
  }

  const user = req.user
  if (user.type === 'admin') {
    res.redirect('../../admin/')
  } else {
    res.redirect('../')
  }
})

webRouter.get('/consola/', (req, res) => {
  
  if (!req.isAuthenticated()) {
    res.redirect('./acceso/')
    return;
  }
  
  const session = req.session
  const query = req.query
  const user = req.user
  /* Indica que dispositivo tiene seleccionado el usuario */
  let deviceId = query.device || 0

  let RenderData = {
    userid: user.id,
    username: user.username,
    email: user.email,
    active: user.active,
    deviceName: '',
    modelName: null,
    deviceSerial: null,
    associatedDevices: 0,
    devices: null
  }

  if (session.RenderData && session.RenderData.associatedDevices > 0) {
    RenderData = session.RenderData
    
    if (deviceId >= RenderData.associatedDevices) {
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
        res.render('consola/index', RenderData)
        return;
      }

      RenderData.associatedDevices = result.length

      if (RenderData.associatedDevices <= 0) {
        session.RenderData = RenderData
        res.render('consola/index', RenderData)
        return;
      }

      if (deviceId >= RenderData.associatedDevices) {
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
      
    })
  }
})

webRouter.post('/models', (req, res) => {
  const session = req.session

  if (!req.isAuthenticated()) {
    res.redirect('../acceso/')
    return;
  }

  const viewName = req.body.viewName || null
  if (viewName == null || viewName == '') {
    res.redirect('../acceso/')
    return;
  }

  const model = session.RenderData.modelName
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
