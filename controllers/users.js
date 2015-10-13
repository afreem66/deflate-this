var express = require('express'),
    router = express.Router(),
    session = require('express-session');
    User = require('../models/userModel.js');

    router.use(session({
      secret: "FUNKE",
      resave : true,
      saveUninitialized: true
    }));

  //pathway to create user page

  router.get('/new', function (req, res) {
    res.render('user/new');
  });

  router.get('/login', function (req, res) {
    res.render('user/login')
  });

  router.post('/login', function (req, res) {
    var login = req.body.user

    User.findOne({username : login.username}, function (err, user) {
      if (user && user.password === login.password) {
        req.session.currentUser = user;

        res.redirect(302, '/welcome')
      } else {
        res.redirect(302, '/')
      }
    });
  });

  ///creating a user pathway SHOULD BE FOR AUTHOR ONLY AND TAKE TO AUTHOR ONLY VIEW

  router.post('/new', function (req, res) {
    var newUser = new User(req.body.user)
    req.session.username = req.body.user.username
    console.log(req.session);
    console.log(newUser);

    newUser.save(function (err, user) {
      if (err) {
        console.log("There was an error, " + err);
      } else {
        res.redirect(302, '/users/' + user._id + '/view');
      }
    });
  });

///pathway to view user info
router.get('/:id/view', function (req, res) {
  var userName = req.session.currentUser.username
  console.log(userName);

  User.findOne({
    username : userName
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
  var userID = req.params.id;

  User.findOne({
    _id : userID
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

router.patch('user/:id/edit ', function (req, res) {
  var userId = req.params.id,
      userAtrribs = req.params.user;

  User.findOne({
    _id : userId
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

router.delete('/:id/view', function (req, res) {
  var userId = req.params.id;

  Post.remove({
    _id : userId
  }, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect(302, '/users/new');
    }
  });
});

  module.exports = router;
