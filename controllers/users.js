var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    session = require('express-session'),
    bcrypt = require('bcryptjs'),
    User = require('../models/userModel.js'),
    Post = require('../models/postModel.js');

    router.use(session({
      secret: "FUNKE",
      resave : true,
      saveUninitialized: true
    }));

  //This adds logout functionality. This fires when the logout link is clicked
  //it sets the currentUser to null and then redirects to loginWall
  router.get('/logout', function (req, res) {
    req.session.currentUser = null;

    console.log(req.session.currentUser);

    res.redirect(302, '/loginWall')
  });

///This takes the usre to the new user form when you click create a user
  router.get('/new', function (req, res) {
    res.render('user/new');
  });

///This route takes the user to the login form page
  router.get('/login', function (req, res) {
    res.render('user/login')
  });

///This route logs the user in. It searches the User collection for a username
///that matches what was entered in the form. If they are equal it sets the
///session current user to that user object, and redirects to the welcome page.
///otherwise redirects to the loginWall
  router.post('/login', function (req, res) {

    User.findOne({username : req.body.user.username}, function (err, user) {
      if (err) {
          console.log(err);
      } else if (user) {
        bcrypt.compare(req.body.user.password, user.passwordDigest, function (compareErr, match) {
          if (match) {
            req.session.currentUser = user;
            res.redirect(302, '/posts/feed');
          } else {
            console.log("Username and password combo is not a match");
            res.redirect(302, '/');
          }
        });
      } else {
        console.log("something bad happened");
        res.redirect(302, '/');
      }
    });
  });


  ///creating a user entry in the db by filling the schema with the form entries
  ///it then sets the current user to the newly created user aka logs you in
  ///and sends you to the user profile page

  router.post('/new', function (req, res) {

    User.findOne({ username : req.body.user.username},
    function (err, user) {
      if(err) {
        console.log(err);
      } else if (user) {
        res.redirect(302, '/');
      } else {
        bcrypt.genSalt(10, function (saltErr, salt) {
          bcrypt.hash(req.body.user.password,
          salt, function(hashErr, hash) {
            var newUser = new User({
            username : req.body.user.username,
            passwordDigest: hash,
            name : req.body.user.name,
            viewpoint : req.body.user.viewpoint})

            newUser.save(function (saveErr, savedUser) {
              if (saveErr) {
                console.log("There was an error, " + saveErr);
              } else {
                req.session.currentUser = savedUser;
                res.redirect(302, '/users/' + newUser.username + '/view');
              }
            });
          });
        });
      };
    });
  });



///pathway to view user info which fires by hitting the profile link
///finds the user by session.currentUser.name and renders the page by passing
///in the found user's information
router.get('/:username/view', function (req, res) {
  var name = req.params.username
  console.log(name);

  User.findOne({
    username : name
  }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      Post.find({
        author : name
      }).sort({
          votes : -1
        }).exec(function (err, foundPosts) {
          if (err) {
            console.log(err);
          } else {
            res.render('user/view', {
              thisUser : foundUser,
              posts : foundPosts,
              currentUser : req.session.currentUser.name
          });
        }
      });
    }
  });
});



///pathway to edit user form which fires when you click the eit link in the profile
///finds by user name from currentUser
router.get('/edit', function (req, res) {
  var name = req.session.currentUser.username

  User.findOne({
    username : name
  }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render('user/edit', {
        user : foundUser
      });
    }
  });
});

///Updates the db entry for this user. Found by username from sessions.
///redirects to the userview profile page
router.patch('/edit', function (req, res) {
  var name = req.session.currentUser.username,
      userAtrribs = req.body.user;

  User.findOne({
    username : name
  }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      foundUser.update(userAtrribs, function (errDos, user) {
        if (errDos) {
          console.log(errDos);
        } else {
          res.redirect(302, '/users/view');
        }
      });
    }
  });
});

///this deletes a user profile entry in the db by finding by sessions.currentUser
/// and then removing.
router.delete('/view', function (req, res) {
  var name = req.session.currentUser.username;

  User.remove({
    username : name
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(302, '/loginWall');
    }
  });
});

///exports the router to server.js

  module.exports = router;
