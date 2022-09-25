const deviceRoutes = require('express').Router()

const deviceController = require('../../controllers/v1/deviceController')

/**********************************************
* User Devices controllers
* ADD     * add device to user
* DELETE  * Delete user device
* EDIT    * Edit user device
**********************************************/

deviceRoutes.post('/attach', deviceController.attachDevice)

deviceRoutes.post('/edit', deviceController.editAttachDevice)

deviceRoutes.post('/delete', deviceController.detachDevice)

module.exports = deviceRoutes
