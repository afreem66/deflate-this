var express = require('express'),
    router = express.Router(),
    session = require('express-session'),
    mongoose = require('mongoose'),
    Post = require('../models/postModel.js');


    router.use(session({
      secret: "FUNKE",
      resave : true,
      saveUninitialized: true
    }));

///pathway to post form. renders form only if you are logged in, otherwise redirects to loginwall

router.get('/new', function (req, res) {
  if (req.session.currentUser) {
    res.render('post/new', {
      user : req.session.currentUser
    });
  } else {
    res.redirect(302, "/");
  }

});

///makes a new post instance and populates author with session.currentUser,
///viewpoint with current user, and title and content from req.body and saves to db
///redirects to feed of posts

router.post('/new', function (req, res) {
  var newPost = new Post({
    author : req.session.currentUser.username,
    viewpoint : req.session.currentUser.viewpoint,
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

/// feed view pathway fired when header link clicked. Finds all post instances
///and passes them to the feed ejs file
///If no one is logged in sends to login wall.

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

///individual post view fires when post title is clicked. Finds in db by postID
///from params and passes to either author view or jsut view ejs files.
///Goes to author view if the currentUser is equal to post author.
/// author view file has edit and delete functions

router.get('/:id/view', function (req, res) {
  var postId = req.params.id;

  Post.findOne({
    _id : postId
  }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      // res.render('post/authorView', {
      //   thisPost : foundPost
      // });
      if (req.session.currentUser.username === foundPost.author) {
        res.render('post/authorView', {
          thisPost : foundPost,
        });
      } else {
        res.render('post/view', {
          thisPost : foundPost
        });
      }
    }
  });
});

///post comments
router.post('/:id/view', function (req, res) {
  var comment = {
    content : req.body.comment,
    author : req.session.currentUser.username
  };
  var postId = req.params.id;
  console.log(req.body);
  console.log(comment);

  Post.findByIdAndUpdate({
    _id : req.params.id
    },
    { $push: {comments: comment}},
    function (err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        if (comment.author === foundPost.author) {
          res.redirect(302, 'post/authorView');
        } else {
         res.redirect(302, 'post/view');
        }
      }
    }
  );
});
///pathway to edit a post. Fires when edit linked is clicked in authorView view.
///finds post by id and updates info saved in db. Also autopopulates the edit ejs form
///which is rendered by passing in foundPost.
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

////pathway to edit information in db. This uses method override and patch to
///find a post then upadate it. It then redirects to the feed
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

///exports router to server.js

  module.exports = router;
