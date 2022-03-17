const devicesRouter = require('express').Router()
const Device = require('../models/device')
const Gateway = require('../models/gateway')

devicesRouter.get('/', async (request, response) => {
  const devices = await Device.find({}).populate('gateway')
  response.json(devices)
})

devicesRouter.post('/', async (request, response) => {
  const body = request.body
  if (!body.gateway_id) {
    return response.status(401).json({ error: 'Gateway not selected' })
  }
  const gateway = await Gateway.findById(body.gateway_id)
  if(!gateway){
    return response.status(401).json({ error: 'Gateway not exist or invalid' })
  }
  //no more that 10 peripheral devices are allowed for a gateway

  const device = new Device({
    uid: body.uid,
    vendor: body.vendor,
    date: new Date(),
    status: body.status,
    gateway: gateway._id
  })

  const savedDevice = await device.save()
  gateway.devices = gateway.devices.concat(savedDevice._id)
  await gateway.save()
  response.json(savedDevice)
})

devicesRouter.get('/:id', async (request, response) => {
  const device = await Device.findById(request.params.id)
  if (device) {
    response.json(device)
  } else {
    response.status(404).end()
  }

})

devicesRouter.delete('/:id', async (request, response) => {
  await Device.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

devicesRouter.put('/:id', async (request, response) => {
  const body = request.body
  const device = {
    uid: body.uid,
    vendor: body.vendor,
    date: new Date(),
    status: body.status,
  }

  const updatedDevice = await Device.findByIdAndUpdate(request.params.id, device, { new: true }).populate('gateway')
  response.json(updatedDevice)
})

module.exports = devicesRouter