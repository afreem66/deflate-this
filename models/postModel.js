var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postSchema = new Schema ({
  title: {type: String},
  author: {type: String}, ///need to address this when it come to login
  content: {type: String}
}, {collection: 'post', strict : false});

var Post = mongoose.model('Post', postSchema)

module.exports = Post;
