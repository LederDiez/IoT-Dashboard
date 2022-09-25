const mqttAuth = require('express').Router()

const { userAuth, deviceAuth } = require('../../controllers/v1/mqttAuthController')

// User websocket authentication
mqttAuth.post('/user', userAuth)

// Device websocket authentication
mqttAuth.post('/device', deviceAuth)

module.exports = mqttAuth
