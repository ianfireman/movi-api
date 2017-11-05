var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('./validator/User_validator');

var Patient = new Schema({
  email: {
    type: String,
    lowercase: true,
    validate: [validator.email(), 'Email not valid']
  },
  name: {
    type: String,
    required: true
  },
  profileImgUrl: {
    type: String
  },
  description: {
    type: String,
    required: false
  },
  user: {
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('Patient', Patient);