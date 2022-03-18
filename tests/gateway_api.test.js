const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Gateway = require('../models/gateway')

beforeEach(async () => {
  await Gateway.deleteMany({})
  const gatewayObjects = helper.initialGateways.map(gateway => new Gateway(gateway))
  const promiseArray = gatewayObjects.map(gateway => gateway.save())
  await Promise.all(promiseArray)
})

describe('Checking the Gateway lists', () => {
  test('ok gateways are returned as json', async () => {
    await api
      .get('/api/gateways')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
  })
  test('there are 3 elements', async () => {
    const response = await api.get('/api/gateways')
    expect(response.body).toHaveLength(helper.initialGateways.length)
  })
  test('property id is defined', async () => {
    const response = await api.get('/api/gateways')
    //pick only first object response to check schema composition
    expect(response.body[0].id).toBeDefined()
  })
})

describe('viewing a specific gateway entry', () => {
  test('succeeds with a valid id', async () => {
    const gatewaysAtStart = await helper.gatewaysInDb()

    const gatewayToView = gatewaysAtStart[0]

    const resultGateway = await api
      .get(`/api/gateways/${gatewayToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const processedGatewayToView = JSON.parse(JSON.stringify(gatewayToView))
    expect(resultGateway.body).toEqual(processedGatewayToView)
  })

  test('fails with statuscode 404 if gateway does not exist', async () => {
    const validNonexistingId = await helper.nonExistingGatewayId()
    await api
      .get(`/api/gateways/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '1a3d5da0000000a82aaaa4'
    await api
      .get(`/api/gateways/${invalidId}`)
      .expect(400)
  })
})

describe('addition tests', () => {

  test('new gateway can be added', async () => {
    const newGateway = {
      serial: 'HHHQQQQPPP',
      name: 'Some New Gateway',
      ip_v4: '192.168.33.99'
    }
    await api
      .post('/api/gateways')
      .send(newGateway)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const gatewaysAtEnd = await helper.gatewaysInDb()
    expect(gatewaysAtEnd).toHaveLength(helper.initialGateways.length + 1)
    const serial = gatewaysAtEnd.map(b => b.serial)
    expect(serial).toContain(
      'HHHQQQQPPP'
    )
  })

  test('this should fail because invalid ip', async () => {
    const newGateway = {
      serial: 'HHHQQQQPPP',
      name: 'Some New Gateway',
      ip_v4: 'invalid_ip'
    }
    const result = await api
      .post('/api/gateways')
      .send(newGateway)
      .expect(400)
    expect(result.body.error).toContain('IP missing or invalid')
  })

  //variation of this test can be used to test al mongoose schema validation
  test('this should fail because serial must be unique', async () => {
    const newGateway = {
      serial: 'HHHPPP0001',
      name: 'Some New Gateway',
      ip_v4: '192.168.22.33'
    }
    await api
      .post('/api/gateways')
      .send(newGateway)
      .expect(400)
      //mongose schema throw 400 error on invalid fields...
  })
})

describe('deletion tests', () => {

  test('succeeds with status code 204 if id is valid', async () => {
    const gatewaysAtStart = await helper.gatewaysInDb()
    const gatewayToDelete = gatewaysAtStart[0]
    await api
      .delete(`/api/gateways/${gatewayToDelete.id}`)
      .expect(204)

    const gatewaysAtEnd = await helper.gatewaysInDb()

    expect(gatewaysAtEnd).toHaveLength(
      helper.initialGateways.length - 1
    )
    const contents = gatewaysAtEnd.map(r => r.id)
    expect(contents).not.toContain(gatewayToDelete.id)
  })

})

describe('updating tests', () => {
  test('valid change name update', async () => {
    const gatewaysAtStart = await helper.gatewaysInDb()
    const gatewayToUpdate = gatewaysAtStart[0]
    const updateName = {
      name: 'Updated Name'
    }
    const resultGateway = await api
      .put(`/api/gateways/${gatewayToUpdate.id}`)
      .send(updateName)
      .expect(200)

    expect(resultGateway.body.name).toContain('Updated Name')
  })

})

afterAll(() => {
  mongoose.connection.close()
})