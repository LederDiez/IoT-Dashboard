'user strict'

const mongoose   = require('mongoose');
const { DevicesDataSchema } = require('../models/connection_models');

const express = require('express');
const router  = express.Router();

router.post('/:unixmin/:unixmax', function (req, res) {

  let unixMin = parseInt(req.params.unixmin || 0);
  let unixMax = parseInt(req.params.unixmax || 0);
  let serial = req.session.deviceSerial || null;

  let query = {
    $and: [
      {registerDate: {$gte: unixMin}},
      {registerDate: {$lte: unixMax}}
    ]
  };

  let dataModel = mongoose.model('device-' + serial, DevicesDataSchema);
  dataModel.find(query, function(err, docs){
    res.json(docs);
  });
});

module.exports = router;