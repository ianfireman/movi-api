
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
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Movement', Movement);