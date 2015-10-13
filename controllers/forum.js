var express = require('express'),
    router = express.Router();
    User = require('../models/userModel.js');
    Post = require('../models/postModel.js');



  //pathway to create user page

  router.get('/user/new', function(req, res) {
    res.render('user/new');
  });

  ///creating a user pathway SHOULD BE FOR AUTHOR ONLY AND TAKE TO AUTHOR ONLY VIEW

  router.post('/user/new', function(req, res) {
    var newUser = new User(req.body.user)
    console.log(newUser);

    newUser.save(function (err) {
      if (err) {
        console.log("There was an error, " + err);
      } else {
        res.redirect(302, '/user/view');
      }
    });

  });

  //pathway to edit user page
  router.get('/user/:id/edit', function(req, res) {
    res.render('/user/:id/edit');
  });

///pathway to write a post form

router.get('/post/new', function(req, res) {
  res.render('post/new');
});

router.post('/post/new', function(req, res) {
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
  Post.find({}, function(err, allPosts) {
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
router.get('/post/:id/authorView', function(req, res) {
  var postId = req.params.id;

  Post.findOne({
    _id : postId
  }, function(err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render('post/authorView', {
        thisPost : foundPost
      });
    }
  });
});

///individual post view for non-author pathway
// router.get('/post/:id/view', function(req, res) {
//   var postId = req.params.id;
//
//   Post.findOne({
//     _id : postId
//   }, function(err, foundPost) {
//     if (err) {
//       console.log(err);
//     } else {
//       res.render('post/view', {
//         thisPost : foundPost
//       });
//     }
//   });
// });

// router.patch('post/id')

///individual post delete pathway FOR AUTHOR ONLY
router.delete('/post/:id/authorView', function(req, res) {
  var postId = req.params.id;

  Post.remove({
    _id : postId
  }, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(302, '/forum/post/feed');
    }
  });
});

  module.exports = router;
