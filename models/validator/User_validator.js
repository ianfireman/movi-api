var emailRegex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;  

module.exports = {
  username: function (username) { // handled by mongoose directly
    return username.length > 2;
  },
  password: function(password, cb) { // handled by passport local mongoose
    if(password.length > 5){
      cb(null); // no errors
    } else {
      cb("Your passwod need at last 6 characters");
    }
  },
  email: function() {
    return emailRegex;
  }
};