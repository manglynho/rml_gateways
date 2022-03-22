const gatewaysRouter = require('express').Router()
const Gateway = require('../models/gateway')
const Device = require('../models/device')
const net = require('net')

gatewaysRouter.get('/', async (request, response) => {
  const gateways = await Gateway.find({}).populate('devices')
  response.json(gateways)
})

gatewaysRouter.post('/', async (request, response) => {
  const body = request.body
  if(!net.isIPv4(body.ip_v4)){
    return response.status(400).json({ error: 'IP missing or invalid' })
  }
  const gateway = new Gateway({
    serial: body.serial,
    name: body.name,
    ip_v4: body.ip_v4,
  })
  const savedGateway = await gateway.save()
  response.json(savedGateway)
})

gatewaysRouter.get('/:id', async (request, response) => {
  const gateway = await Gateway.findById(request.params.id)
  if (gateway) {
    response.json(gateway)
  } else {
    response.status(404).end()
  }

})

gatewaysRouter.delete('/:id', async (request, response, next) => {
  Gateway.findById(request.params.id, function(err, gateway){
    Device.deleteMany({
      '_id': {
        $in: gateway.devices
      }
    }, function(err){
      if(err) return next(err)
      gateway.deleteOne()
      response.status(204).end()
    })
  })
  /*await Gateway.findByIdAndRemove(request.params.id)
  response.status(204).end()*/
})

gatewaysRouter.put('/:id', async (request, response) => {
  const body = request.body
  const gateway = {
    serial: body.serial,
    name: body.name,
    ip_v4: body.ip_v4,
  }

  const updatedGateway = await Gateway.findByIdAndUpdate(request.params.id, gateway, { new: true }).populate('devices')
  response.json(updatedGateway)
})

module.exports = gatewaysRouter