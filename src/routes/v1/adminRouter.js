const adminRoutes = require('express').Router()

const adminDevice = require('../../controllers/v1/adminController')

/**********************************************
* Admin Devices controllers
* ALL    * get all devices
* GET    * get device
* ADD    * add device
* DELETE * Delete device
* EDIT   * Edit device
**********************************************/
adminRoutes.post('/', adminDevice)

module.exports = adminRoutes
