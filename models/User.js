var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var validator = require('./validator/User_validator');

var User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.username, 'Need 3 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.email(), 'Email not valid']
  },
  password: {
    type: String
  },
  firstname: {
    type: String,
    default: ''
  },
  lastname: {
    type: String,
    default: ''
  },
  profileImgUrl: {
    type: String
  },
  actived: {
    type: Boolean,
    default: true
  },
  passwordToken: {
    type: String
  }
},
{
  timestamps: true
});

User.methods.getName = function() {
  return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose, {usernameLowerCase: true, passwordValidator: validator.password});

module.exports = mongoose.model('User', User);