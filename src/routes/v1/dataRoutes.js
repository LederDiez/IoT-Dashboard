const datasRouter = require('express').Router()
const { getAllData } = require('../../controllers/v1/dataController')

datasRouter.post('/:unixmin/:unixmax', getAllData)

module.exports = datasRouter
