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
    Post.find({}).sort({
       votes : -1
     }).exec(function (err, orderedPosts) {
      if (err) {
        console.log("There was an error finding the posts" + err);
      } else {
        res.render('post/feed', {
          posts : orderedPosts,
        });
      }
    });
  }
})

///individual post view fires when post title is clicked. Finds in db by postID
///from params and passes to view ejs file. passes in currentUser for conditional
///to determine if it should show author functionality like delete and edit.

router.get('/:id/view', function (req, res) {
  var postId = req.params.id;

  Post.findOne({
    _id : postId
  }, function (err, foundPost) {
    if (err) {
      console.log(err);
    } else {
      res.render('post/view', {
        thisPost : foundPost,
        author : req.session.currentUser.username
      });
    }
  });
});

///uses method override and patch to update the post entry array of comments.
///Creates comment object from req.body and currentUser.username
///Uses findByIdAndUpdate to find the post and then push's the comment object
///into the comments array and redirects to the posts' view
router.patch('/:id/view', function (req, res) {
  var comment = {
    author : req.session.currentUser.username ,
    content : req.body.comment
  };
  var postId = req.params.id;
  console.log(req.body);
  console.log(comment);
  console.log(postId);

  Post.findByIdAndUpdate(
    postId,
    { $push: {comments: comment}},
    function (err, foundPost) {
      if (err) {
        console.log(err);
      } else {
          res.redirect(302, '/posts/' + req.params.id + '/view');
        }
      }

  );
});
///pathway to edit a post. Fires when edit linked is clicked in authorView view.
///finds post by id and updates info saved in db. Also autopopulates the edit ejs form
///which is rendered by passing in foundPost.
router.get('/:id/edit', function (req, res) {
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

/*
var voteValue = (req.body.vote === 'Up Vote')?1:-1;
poastAttribs = {
  $inc: {
    votes: voteValue;
  }
}
*/
///patch pathway to create up or down votes!


router.patch('/post/:id/vote', function (req, res) {
  var postId = req.params.id,
      voteValue = (req.body.vote === 'Down Vote')?-1 : 1;
  console.log(postId);
  console.log(req.body);
  console.log(voteValue);

  Post.findByIdAndUpdate(
    postId,
    { $inc: {votes: voteValue}},
    function (err, foundPost) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(302, '/posts/feed')
      }
    }
  );
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

router.delete('/:id/view', function (req, res) {
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
