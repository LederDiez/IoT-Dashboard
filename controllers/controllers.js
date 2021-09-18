'user strict'

const express = require('express');
const router  = express.Router();

const admin_routers = require('./routers/admin_api');
const user_routers = require('./routers/users_api');
const device_routers = require('./routers/devices_api');

const web_api = require('./routers/web_api');

router.use("/api", admin_routers);
router.use("/api", user_routers);
router.use("/api", device_routers);

router.use("/", web_api);

module.exports = router;