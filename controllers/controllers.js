'user strict'

const express = require('express');
const router  = express.Router();

const admin_routers = require('./apis/admin_api');
const user_routers = require('./apis/users_api');
const device_routers = require('./apis/devices_api');

const pages = require('./routers/routes');

router.use("/api", admin_routers);
router.use("/api", user_routers);
router.use("/api", device_routers);

router.use("/", pages);

module.exports = router;