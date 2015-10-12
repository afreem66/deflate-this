var express = require('express'),
    router = express.Router();
    User = require('../models/userModel.js');
    // Post = require(../models/postModel.js);



  //pathway to create user page
  router.get('/user/new', function(req, res) {
    res.render('user/new');
  });

  ///posting pathway

  router.post('/user/new', function(req, res) {
    var newUser = new User(req.body.user)
    console.log(newUser);

    newUser.save(function (err) {
      if (err) {
        console.log("There was an error, " + err);
      } else {
        res.redirect(302, '/');
      }
    });

  });

  //pathway to edit user page
  router.get('/user/:id/edit', function(req, res) {
    res.render('/user/:id/edit');
  });

  module.exports = router;
