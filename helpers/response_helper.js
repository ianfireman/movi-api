exports.success = {
  register: function(res, object) {
    res.status(200).json({
      status: 'Register successful!',
      success: true,
      data: object
    });
  }
};

exports.error = {
  default: function(err) {
    return err;
  },
  
  paramsNotAllowed: function() {
    err = new Error('Params not Allowed');
    err.status = 500;
    return err;
  },
  
  dataNotFound: function(err) {
    switch(err.name) {
      case 'CastError':
        err = new Error('Data not found');
        err.status = 500;
        return err;
      default:
        this.default(err);
    }
  },

  validationFailed: function(err){
    switch(err.name) {
      case 'ValidationError':
        return validationError(err);
      case 'MongoError':
        if(err.code == 11000){
          return duplicatedKey(err);
        }
      default:
        return this.default(err);
    }
  },

  loginFailed: function(err){
    switch(err.name) {
      case 'IncorrectPasswordError':
        err.status = 401;
        return err;
      case 'IncorrectUsernameError':
        err.status = 401;
        return err;
      default:
        err = new Error('Could not log in');
        err.status = 401;
        return err;
    }
  },

  referenceFailed: function(err) {
    if (err instanceof Error){
      this.validationFailed(err);
    } else {
      switch(err) {
        case 'sector':
          return referenceError(err);
        case 'product':
          return referenceError(err);
        default:
          this.default(err);
      }
    }
  }
};

function validationError (err){
  let errors = Object.keys(err.errors).map(function(i) { return err.errors[i] });
  let keys = {
    keys: []
  };
  errors.map(function(error) {
   keys.keys.push({
      "path" : error.path,
      "kind" : error.kind,
      "message" : error.message
    });
  });
  return ({
    status: 500,
    message: "Validation errors",
    keys
  });
}

function duplicatedKey (err){
  let keys = err.message.split(/[$_]/);
  keys.shift();
  keys.pop();
  return({
    status: 500,
    message: "Duplicate key errors",
    keys: {keys}
  });
}

function referenceError (name){
  return {
    status: 500,
    message: "Reference error",
    keys: {
      keys: [{
        path: name,
        kind: 'required',
        message: "Path `"+name+"` is required."
      }]
    }
  };
}