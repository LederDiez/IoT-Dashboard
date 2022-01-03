'user strict'

const express = require('express');
const router  = express.Router();

const admin_routers = require('./admin-routers');
const user_routers = require('./users-routers');
const device_routers = require('./devices-routers');
const notification_routers = require('./notification-routers');
const authentication = require("./Socket-Authentication");

const data = require("./data-routers");

const web = require('./web-routers');

router.use("/api", admin_routers);
router.use("/", user_routers);
router.use("/user", device_routers);
router.use("/api", notification_routers);

router.use("/data", data);

router.use("/", authentication);
router.use("/", web);

module.exports = router;