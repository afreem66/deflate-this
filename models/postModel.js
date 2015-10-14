var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postSchema = new Schema ({
  title: {type: String},
  author: {type: String},
  viewpoint: {type: String},
  content: {type: String},
  date: {type: Date, default: Date.now}
  comments: []
}, {collection: 'post', strict : false});

var Post = mongoose.model('Post', postSchema)

module.exports = Post;
