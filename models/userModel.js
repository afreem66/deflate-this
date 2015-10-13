var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema ({
  username: {type : String},
  password: {type: String},
  name: {type: String},
  team: {type: String}

}, {collection: 'user', strict: false});

var User = mongoose.model('User', userSchema)

module.exports = User;
