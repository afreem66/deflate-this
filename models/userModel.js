var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema ({
  username: {type : String},
  password: {type: String},
  firstName: {type: String},
  lastName: {type: String},
  gender: {type: String}

}, {collection: 'user', strict: false});

var User = mongoose.model(null, userSchema)

module.exports = User;
