const Gateway = require('../models/gateway')
const Device = require('../models/device')

const initialGateways = [ {
  _id: '5a422a851b54a676234d17f7',
  serial: 'HHHPPP0001',
  name: 'North Star',
  ip_v4: '192.168.22.1',
  __v: 0
},
{
  _id: '5a422aa71b54a676234d17f8',
  serial: 'HHHPPP0002',
  name: 'South Star',
  ip_v4: '192.168.22.2',
  devices:[
    '6233963428342a590cb973e4',
    '6233963428342a590cb973e1',
    '6233963428342a590cb973e2',
    '6233963428342a590cb973e3',
    '6233963428342a590cb973e5',
    '6233963428342a590cb973e6',
    '6233963428342a590cb973e7',
    '6233963428342a590cb973e8',
    '6233963428342a590cb973e9',
    '6233963428342a590cb973f1',
  ],
  __v: 0
},
{
  _id: '5a422b3a1b54a676234d17f9',
  serial: 'HHHPPP0003',
  name: 'West Star',
  ip_v4: '192.168.22.3',
  devices:['6233963428342a590cb973f2','6233963428342a590cb973f3','6233963428342a590cb973f4'],
  __v: 0
}
]

const initialDevices = [ {
  _id: '6233963428342a590cb973e4',
  uid: '90909010',
  vendor: 'TP_Link1',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e1',
  uid: '90909020',
  vendor: 'TP_Link2',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e2',
  uid: '90909030',
  vendor: 'TP_Link3',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e3',
  uid: '90909040',
  vendor: 'TP_Link4',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e5',
  uid: '90909050',
  vendor: 'TP_Link5',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e6',
  uid: '90909060',
  vendor: 'TP_Link6',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e7',
  uid: '90909070',
  vendor: 'TP_Link7',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e8',
  uid: '90909080',
  vendor: 'TP_Link8',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973e9',
  uid: '90909090',
  vendor: 'TP_Link9',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973f1',
  uid: '90909000',
  vendor: 'TP_Link10',
  date: new Date(),
  status: true,
  gateway: '5a422aa71b54a676234d17f8',
  __v: 0
},
{
  _id: '6233963428342a590cb973f2',
  uid: '90908000',
  vendor: 'Huawei1',
  date: new Date(),
  status: true,
  gateway: '5a422b3a1b54a676234d17f9',
  __v: 0
},
{
  _id: '6233963428342a590cb973f3',
  uid: '90908001',
  vendor: 'Huawei2',
  status: true,
  gateway: '5a422b3a1b54a676234d17f9',
  __v: 0
},
{
  _id: '6233963428342a590cb973f4',
  uid: '90908002',
  vendor: 'Huawei3',
  date: new Date(),
  status: true,
  gateway: '5a422b3a1b54a676234d17f9',
  __v: 0
}
]

const nonExistingGatewayId = async () => {
  const gateway = new Gateway({
    serial: 'HHHPPP9999',
    name: 'Some Gateway',
    ip_v4: '192.168.22.99'
  })
  await gateway.save()
  await gateway.remove()

  return gateway._id.toString()
}

const gatewaysInDb = async () => {
  const gateways = await Gateway.find({})
  return gateways.map(gateway => gateway.toJSON())
}

const nonExistingDeviceId = async () => {
  const device = new Device({
    uid: '90909099',
    vendor: 'Some Vendor',
    date: new Date(),
    status: true,
    gateway: '5a422a851b54a676234d17f7',
  })
  await device.save()
  await device.remove()

  return device._id.toString()
}

const devicesInDb = async () => {
  const devices = await Device.find({})
  return devices.map(device => device.toJSON())
}



module.exports = {
  initialGateways, initialDevices, nonExistingGatewayId, nonExistingDeviceId, gatewaysInDb, devicesInDb
}