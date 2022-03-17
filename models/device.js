const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const deviceSchema = new mongoose.Schema({
  uid: { type: Number, minlength: 3, required: true, unique: true },
  vendor:  { type: String, minlength: 3, required: true },
  date: {
    type: Date,
    required: true,
  },
  status: Boolean,
  gateway: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gateway'
  }
})

deviceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

deviceSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Device', deviceSchema)