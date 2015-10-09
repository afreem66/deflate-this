var express = require('express'),
    PORT = process.env.PORT || 5432,
    server = express(),
    MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    dbname = "some_useful_name",
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    expressLayouts = require('express-ejs-layouts'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    sessions = require('sessions');

///defining path for
    server.set('views', './views');
    server.set('view engine', 'ejs');

///setting up packages
    server.use(express.static('./public'));

    server.use(methodOverride('_method'));

    server.use(bodyParser.urlencoded({
      extended: true
    }));

    server.use(morgan('dev'));

    server.use(expressLayouts);
///server pathways

//pathway to homepage
server.get('/welcome', function(req, res) {
  res.render('welcome');
});

//pathway to login page
server.get('/user/login', function(req, res) {
  res.render('/user/login');
});

//pathway to create user page
server.get('/user/new', function(req, res) {
  res.render('/user/new');
});

//pathway to edit user page
server.get('/user/:id/edit', function(req, res) {
  res.render('/user/:id/edit');
});

///connecting mongoose
  mongoose.connect(MONGOURI + "/" + dbname);

///setting server to listen
  server.listen(PORT, function () {
    console.log("server is up on PORT: ", PORT);
  })
