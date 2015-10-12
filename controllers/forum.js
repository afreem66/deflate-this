var express = require('express'),
    router = express.Router();
    // User = user schema,
    // Post = post schema;


  //pathway to login page
  router.get('/user/login', function(req, res) {
    res.render('/user/login');
  });

  //pathway to create user page
  router.get('/user/new', function(req, res) {
    res.render('user/new');
  });

  //pathway to edit user page
  router.get('/user/:id/edit', function(req, res) {
    res.render('/user/:id/edit');
  });

  module.exports = router;
