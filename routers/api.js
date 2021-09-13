'user strict'

const express = require('express');
const router  = express.Router();

const admin_routers = require('./admin_api_routers');
const user_routers = require('./user_api_routers');
const device_routers = require('./device_api_routers');

router.use(admin_routers);
router.use(user_routers);
router.use(device_routers);

module.exports = router;