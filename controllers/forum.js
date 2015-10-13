var express = require('express'),
    router = express.Router(),
    session = require('express-session');
    User = require('../models/userModel.js');
    Post = require('../models/postModel.js');


    router.use(session({
      secret: "SOME PASSPHRASE TO ENCRYPT",
      resave : true,
      saveUninitialized: true
    }));

  //pathway to create user page

  router.get('/user/new', function (req, res) {
    res.render('user/new');
  });

  router.get('/user/login', function (req, res) {
    res.render('user/login')
  });

  router.post('/user/login', function (req, res) {
    var login = req.body.user

    User.findOne({username : login.username}, function (err, user) {
      if (user && user.password === login.password) {
        req.session.currentUser = user.username;

        res.redirect(302, '/forum/post/feed')
      } else {
        res.redirect(302, '/')
      }
    });
  });

  ///creating a user pathway SHOULD BE FOR AUTHOR ONLY AND TAKE TO AUTHOR ONLY VIEW

  router.post('/user/new', function (req, res) {
    var newUser = new User(req.body.user)
    req.session.username = req.body.user.username
    console.log(req.session);
    console.log(newUser);

    newUser.save(function (err, user) {
      if (err) {
        console.log("There was an error, " + err);
      } else {
        res.redirect(302, '/forum/user/' + user._id + '/view');
      }
    });
  });

///pathway to view user info
router.get('/user/:id/view', function (req, res) {
  var userID = req.params.id;
  console.log(userID);

  User.findOne({
    _id : userID
  }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render('user/view', {
        thisUser : foundUser
      });
    }
  });
});


///pathway to edit user page
router.get('/user/:id/edit', function (req, res) {
  res.render('/user/:id/edit');
});

///pathway to write a post form

router.get('/post/new', function (req, res) {
  res.render('post/new');
});

router.post('/post/new', function (req, res) {
  var newPost = new Post(req.body.post)
  console.log(newPost);

  newPost.save(function (err) {
    if (err) {
      console.log("There was an error " + err) ;
    } else {
      res.redirect(302, '/forum/post/feed');
    }
  })
})

/// feed view pathway
router.get('/post/feed', function (req, res) {
  Post.find({}, function (err, allPosts) {
    if (err) {
      console.log("There was an error finding the posts" + err);
    } else {
      res.render('post/feed', {
        posts : allPosts
      });
    }
  });
})

///individual post view for author pathway WILL HAVE EDIT AND DELETE
router.get('/post/:id/authorView', function (req, res) {
  var postId = req.params.id;

  Post.findOne({
    _id : postId
  }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      if (req.session.currentUser) {
        res.render('post/authorView', {
          thisPost : foundPost
        });
      } else {
        res.render('post/view', {
          thisPost : foundPost
        });
      }
    }
  });
});

///individual post view for non-author pathway
router.get('/post/:id/view', function (req, res) {
  var postId = req.params.id;

  Post.findOne({
    _id : postId
  }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render('post/view', {
        thisPost : foundPost
      });
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

router.patch('post/:id/edit ', function (req, res) {
  var postID = req.params.id,
      postAtrribs = req.params.post;

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
          res.redirect(302, '/forum/post/feed');
        }
      });
    }
  });
});


///individual post delete pathway FOR AUTHOR ONLY
///first grabs the id from the params then finds the post in the db by id
///it then redirects to the updated feed

router.delete('/post/:id/authorView', function (req, res) {
  var postId = req.params.id;


  Post.remove({
    _id : postId
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(302, '/forum/post/feed');
    }
  });
});

  module.exports = router;
