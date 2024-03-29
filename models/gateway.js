const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const gatewaySchema = new mongoose.Schema({
  serial: {
    type: String,
    minlength: [3, 'Serial must have more than 3 chars length'],
    required: [true, 'Serial required'],
    unique: [true, 'Serial must be unique']
  },
  name:  { type: String, minlength: 3, required: true },
  ip_v4: { type: String, required: true },
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device'
    }
  ],
})

gatewaySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

gatewaySchema.plugin(uniqueValidator)

const Gateway = mongoose.model('Gateway', gatewaySchema)

module.exports = Gateway