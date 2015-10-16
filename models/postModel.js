///requiring mongoose and defining a Schema

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

///creating a new schema for posts. including a title, author, their viewpoint,
///upvotes (defaulted to 0), the post content, the date created, and an array of
///of comments which holds objects that have an author and content and adds it
/// to the posts collection

var postSchema = new Schema ({
  title: {type: String},
  author: {type: String},
  viewpoint: {type: String},
  votes: {type: Number, default: 0},
  content: {type: String},
  date: {type: Date, default: Date.now},
  comments: [ {author: String, content: String} ]
}, {collection: 'post', strict : false});

///this is defining the model or collection with the schema

var Post = mongoose.model('Post', postSchema)

///exporting the model to server.js

module.exports = Post;
