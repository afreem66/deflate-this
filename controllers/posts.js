var express = require('express'),
    router = express.Router(),
    session = require('express-session');
    Post = require('../models/postModel.js');


    router.use(session({
      secret: "FUNKE",
      resave : true,
      saveUninitialized: true
    }));

///pathway to write a post form

router.get('/new', function (req, res) {
  if (req.session.currentUser) {
    res.render('post/new', {
      user : req.session.currentUser
    });
  } else {
    res.redirect(302, "/");
  }

});

router.post('/new', function (req, res) {
  var newPost = new Post({
    author : req.session.currentUser.username,
    title: req.body.post.title,
    content: req.body.post.content
  })
  console.log(newPost);

  newPost.save(function (err) {
    if (err) {
      console.log("There was an error " + err) ;
    } else {
      res.redirect(302, '/posts/feed');
    }
  })
})

/// feed view pathway
router.get('/feed', function (req, res) {
  if (req.session.currentUser) {
    Post.find({}, function (err, allPosts) {
      if (err) {
        console.log("There was an error finding the posts" + err);
      } else {
        res.render('post/feed', {
          posts : allPosts,
        });
      }
    });
  } else {
    res.redirect(302, '/')
  }
})

///individual post view for author pathway WILL HAVE EDIT AND DELETE
router.get('/:id/authorView', function (req, res) {
  var postId = req.params.id;

  Post.findOne({
    _id : postId
  }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      if (req.session.currentUser.username === foundPost.author) {
        res.render('post/authorView', {
          thisPost : foundPost,
        });
      } else {
        res.render('post/view', {
          thisPost : foundPost,
        });
      }
    }
  });
});

router.get('/post/:id/edit', function (req, res) {
  var postID = req.params.id;

  Post.findOne({
    _id : postID
  }, function (err, foundPost) {
    if (err) {
      console.log(err, foundPost);
    } else {
      res.render('post/edit', {
        post : foundPost
      });
    }
  });

});

router.patch('/post/:id/edit', function (req, res) {
  var postID = req.params.id,
      postAtrribs = req.body.post;

  console.log(postID);
  console.log(req.body);
  Post.findOne({
    _id : postID
  }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      foundPost.update(postAtrribs, function (errDos, post) {
        if (errDos) {
          console.log(errDos);
        } else {
          res.redirect(302, '/posts/feed');
        }
      });
    }
  });
});


///individual post delete pathway FOR AUTHOR ONLY
///first grabs the id from the params then finds the post in the db by id
///it then redirects to the updated feed

router.delete('/:id/authorView', function (req, res) {
  var postId = req.params.id;


  Post.remove({
    _id : postId
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(302, '/posts/feed');
    }
  });
});

  module.exports = router;
