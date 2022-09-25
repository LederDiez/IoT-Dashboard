const v1Routes = require('express').Router()

const accesoRoutes = require('./v1/accesoRoutes')
const deviceRoutes = require('./v1/devicesRouter')
const notificationRouters = require('./v1/notificationRouter')
const datasRouter = require('./v1/dataRoutes')
const mqttAuth = require('./v1/mqttAuthRouter')
const adminRoutes = require('./v1/adminRouter')

v1Routes.use('/v1/acceso', accesoRoutes)
v1Routes.use('/v1/device', deviceRoutes)
v1Routes.use('/v1/notifications', notificationRouters)
v1Routes.use('/v1/data', datasRouter)
v1Routes.use('/v1/authentication', mqttAuth)
v1Routes.use('/v1/admin', adminRoutes)

module.exports = v1Routes
