const notifiController = require('../../controllers/v1/notificationController')

const notificationRouters = require('express').Router()

// User only method
notificationRouters.get('/all', notifiController.getAllNotifications)

// User only method
notificationRouters.get('/count', notifiController.getNotificationsCount)

// User only method
notificationRouters.post('/delete', notifiController.deleteNotification)

// Device only method
notificationRouters.post('/add', notifiController.generateNotification)

// Sub user to notifications
notificationRouters.post('/sub', notifiController.subToNotifications)

module.exports = notificationRouters
