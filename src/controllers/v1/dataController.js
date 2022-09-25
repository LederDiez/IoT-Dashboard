const DeviceDataModel = require('../../models/DeviceDataModel.js')

const getAllData = (req, res) => {
  const session = req.session
  const params = req.params

  const unixMin = parseInt(params.unixmin || 0)
  const unixMax = parseInt(params.unixmax || 0)
  const serial = session.RenderData.deviceSerial || null

  const query = {
    $and: [
      { registerDate: { $gte: unixMin } },
      { registerDate: { $lte: unixMax } }
    ]
  }

  const dataModel = DeviceDataModel(serial)
  dataModel.find(query, function (_err, docs) {
    res.json(docs)
  })
}

module.exports = {
  getAllData
}
