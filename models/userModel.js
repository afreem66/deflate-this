///requiring mongoose and defining a Schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

///creating a new schema for posts. including a username, encrypted password,
/// their name, and viewpoint. it also adds it to the collection user

var userSchema = new Schema ({
  username: {type : String},
  passwordDigest: {type: String},
  name: {type: String},
  viewpoint: {type: String}

}, {collection: 'user', strict: false});

///this is defining the model  with the schema

var User = mongoose.model('User', userSchema)

///exporting to server.js

module.exports = User;
