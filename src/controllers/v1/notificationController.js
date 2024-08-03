const webPush = require('web-push')

const configs = require('../../config/configs')

const NotificationModel = require('../../models/NotificationsModel')

webPush.setVapidDetails(
  'mailto:lederdiez00@gmail.com',
  configs.PUBLIC_VAPID_KEY,
  configs.PRIVATE_VAPID_KEY
)

// let pushSubscripton

const getAllNotifications = (req, res) => {
  const session = req.session
  const serial = session.RenderData.deviceSerial || null

  if (req.isAuthenticated() && serial != null) {
    const filter = {
      deviceSerial: serial,
      deleted: false
    }

    NotificationModel.find(filter, (err, result) => {
      if (err) {
        res.status(500).json({
          status: 'Error del servidor'
        })
      } else {
        res.status(200).json({
          status: 'success',
          count: result.length,
          notifications: result
        })
      }
    })
  } else {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1
    })
  }
}

const getNotificationsCount = (req, res) => {
  const session = req.session
  const serial = session.RenderData.deviceSerial || null

  if (req.isAuthenticated() && serial != null) {
    const filter = {
      deviceSerial: serial,
      deleted: false
    }

    NotificationModel.find(filter, (err, result) => {
      if (err) {
        res.status(500).json({
          status: 'Error del servidor'
        })
      } else {
        res.status(200).json({
          status: 'success',
          count: result.length
        })
      }
    })
  } else {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1
    })
  }
}

const deleteNotification = (req, res) => {
  const id = req.body.id || null

  if (req.isAuthenticated() && id != null) {
    const filter = {
      _id: id
    }
    const update = {
      deleted: true
    }

    NotificationModel.findByIdAndUpdate(filter, update, (err, _result) => {
      if (err) {
        res.status(500).json({
          status: 'Error del servidor'
        })
      } else {
        res.status(200).json({
          status: 'success'
        })
      }
    })
  } else {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1
    })
  }
}

const generateNotification = (req, res) => {
  const session = req.session

  const deviceStarted = session.deviceStarted || false
  const deviceSerial = session.deviceAuth || null

  const message = req.body.message || null

  if (deviceStarted === true && deviceSerial != null && message != null) {
    const notification = new NotificationModel({
      deviceSerial,
      message,
      generatedDate: Date.now()
    })

    notification.save((err) => {
      if (err) {
        console.log(err)
        res.status(500).json({
          status: 'error'
        })
      } else {
        res.status(200).json({
          status: 'success'
        })
      }
    })
  } else {
    res.status(401).json({
      status: 'Unauthorized',
      code: 1
    })
  }
}

const subToNotifications = (req, res) => {
  console.log(req.body)
  res.status(200).json()
}

module.exports = {
  getAllNotifications,
  getNotificationsCount,
  deleteNotification,
  generateNotification,
  subToNotifications
}
