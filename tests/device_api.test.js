const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Device = require('../models/device')
const Gateway = require('../models/gateway')

beforeEach(async () => {
  await Gateway.deleteMany({})
  const gatewayObjects = helper.initialGateways.map(gateway => new Gateway(gateway))
  const promiseArray = gatewayObjects.map(gateway => gateway.save())
  await Promise.all(promiseArray)
})

beforeEach(async () => {
  await Device.deleteMany({})
  const deviceObjects = helper.initialDevices.map(device => new Device(device))
  const promiseArray = deviceObjects.map(device => device.save())
  await Promise.all(promiseArray)
})

describe('Checking the Device lists', () => {
  test('ok devices are returned as json', async () => {
    await api
      .get('/api/devices')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('there are 13 elements', async () => {
    const response = await api.get('/api/devices')
    expect(response.body).toHaveLength(helper.initialDevices.length)
  })
  test('property id is defined', async () => {
    const response = await api.get('/api/devices')
    //pick only first object response to check schema composition
    expect(response.body[0].id).toBeDefined()
  })
})

describe('viewing a specific device entry', () => {
  test('succeeds with a valid id', async () => {
    const devicessAtStart = await helper.devicesInDb()

    const deviceToView = devicessAtStart[0]

    const resultDevice = await api
      .get(`/api/devices/${deviceToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const processedDeviceToView = JSON.parse(JSON.stringify(deviceToView))
    expect(resultDevice.body).toEqual(processedDeviceToView)
  })

  test('fails with statuscode 404 if device does not exist', async () => {
    const validNonexistingId = await helper.nonExistingDeviceId()
    await api
      .get(`/api/devices/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '1a3d5da0000000a82aaaa4'
    await api
      .get(`/api/devices/${invalidId}`)
      .expect(400)
  })
})

describe('addition tests', () => {

  test('new device can be added', async () => {
    const newDevice = {
      uid: '90908012',
      vendor: 'Huawei4',
      date: new Date(),
      status: true,
      gateway: '5a422b3a1b54a676234d17f9'
    }
    await api
      .post('/api/devices')
      .send(newDevice)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const devicesAtEnd = await helper.devicesInDb()
    expect(devicesAtEnd).toHaveLength(helper.initialDevices.length + 1)
    const uid = devicesAtEnd.map(b => b.uid)
    expect(uid).toContain(
      90908012
    )
  })

  test('this should fail because gateway has 10 devices already ', async () => {
    const newDevice = {
      uid: '90909013',
      vendor: 'TPLink11',
      date: new Date(),
      status: true,
      gateway: '5a422aa71b54a676234d17f8'
    }
    const result = await api
      .post('/api/devices')
      .send(newDevice)
      .expect(400)
    expect(result.body.error).toContain('No more that 10 peripheral devices are allowed for a gateway')
  })

  //variation of this test can be used to test al mongoose schema validation
  test('this should fail because uid must be unique', async () => {
    const newDevice = {
      uid: '90908002',
      vendor: 'Huawei4',
      date: new Date(),
      status: true,
      gateway: '5a422b3a1b54a676234d17f9'
    }
    await api
      .post('/api/devices')
      .send(newDevice)
      .expect(400)
      //mongose schema throw 400 error on invalid fields...
  })

  //variation of this test can be used to test al mongoose schema validation
  test('this should fail because uid must be a number', async () => {
    const newDevice = {
      uid: 'SSSSSSS',
      vendor: 'Huawei4',
      date: new Date(),
      status: true,
      gateway: '5a422b3a1b54a676234d17f9'
    }
    await api
      .post('/api/devices')
      .send(newDevice)
      .expect(400)
      //mongose schema throw 400 error on invalid fields...
  })
})

describe('deletion tests', () => {

  test('succeeds with status code 204 if id is valid', async () => {
    const devicessAtStart = await helper.devicesInDb()
    const deviceToDelete = devicessAtStart[0]
    await api
      .delete(`/api/devices/${deviceToDelete.id}`)
      .expect(204)

    const devicesAtEnd = await helper.devicesInDb()

    expect(devicesAtEnd).toHaveLength(
      helper.initialDevices.length - 1
    )
    const contents = devicesAtEnd.map(r => r.id)
    expect(contents).not.toContain(deviceToDelete.id)
  })

})

describe('updating tests', () => {
  test('valid status update', async () => {
    const devicessAtStart = await helper.devicesInDb()
    const deviceToUpdate = devicessAtStart[0]
    const updateStatus = {
      status: false,
    }
    const resultDevice = await api
      .put(`/api/devices/${deviceToUpdate.id}`)
      .send(updateStatus)
      .expect(200)

    expect(resultDevice.body.status).toEqual(false)
  })

})

afterAll(() => {
  mongoose.connection.close()
})