
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Movement = new Schema({
  name: {
    type: String
  },
  patient: {
    type: Schema.Types.ObjectId, 
    ref: 'Patient',
    required: true
  },
  defaultRecord: {
      type: Array
  },
  time: {
    type: Number
  },
  max: {
    type: Number,
    default: 0
  },
  min: {
    type: Number,
    default: 0
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Movement', Movement);