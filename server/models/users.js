const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 1
    // validate: {
    //   validator: validator.isEmail(value),
    //   message: '{VALUE} is not a valid email'
    //   }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

module.exports = { User }
