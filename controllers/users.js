var express = require('express'),
    router = express.Router(),
    session = require('express-session'),
    User = require('../models/userModel.js');

    router.use(session({
      secret: "FUNKE",
      resave : true,
      saveUninitialized: true
    }));

  //This adds lgoout functionality. This fires when the logout link is clicked
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


  ///creating a user entry in the db by filling the schema with the form entries
  ///it then sets the current user to the newly created user aka logs you in
  ///and sends you to the user profile page

  router.post('/new', function (req, res) {
    var newUser = new User(req.body.user)
    console.log(req.session);
    console.log(newUser);

    newUser.save(function (err, user) {
      if (err) {
        console.log("There was an error, " + err);
      } else {
        req.session.currentUser = user;
        res.redirect(302, '/users/view');
      }
    });
  });

///pathway to view user info which fires by hitting the profile link
///finds the user by session.currentUser.name and renders the page by passing
///in the found user's information
router.get('/view', function (req, res) {
  var name = req.session.currentUser.username
  console.log(name);

  User.findOne({
    username : name
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



///pathway to edit user page which fires when you click the eit link in the profile
///finds by
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

router.patch('/edit ', function (req, res) {
  var name = req.session.currentUser.username,
      userAtrribs = req.body.user;

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

router.delete('/view', function (req, res) {
  // var userId = req.params.id;
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

  module.exports = router;
