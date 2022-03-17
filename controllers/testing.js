const testingRouter = require('express').Router()
const Device = require('../models/device')
const Gateway = require('../models/gateway')

testingRouter.post('/reset', async (request, response) => {
  await Device.deleteMany({})
  await Gateway.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter