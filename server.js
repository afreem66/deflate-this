var express = require('express'),
    PORT = process.env.PORT || 5432,
    server = express(),
    MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    MongoClient = require('mongodb').MongoClient,
    dbname = "forum",
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    expressLayouts = require('express-ejs-layouts'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    session = require('express-session'),
    bcrypt = require('bcryptjs');

///defining paths for layouts
  server.set('views', './views');
  server.set('view engine', 'ejs');

///setting up sessions
  server.use(session({
    secret: "SOME PASSPHRASE TO ENCRYPT",
    resave : true,
    saveUninitialized: true
  }));

///telling the app to use express and where to find static files, methodOverride
///and body parser to show us nice bodies when asked ;) adn morgan to log errors
///and express-ejs-layouts to make our lives easier when creating the way the
///app is formatted
server.use(express.static('./public'));

server.use(methodOverride('_method'));

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(morgan('dev'));

server.use(expressLayouts);

///this allows me to access the currentUser variable whereever I am since it is
///stored locally
server.use(function (req, res, next) {
  res.locals.user = req.session.currentUser;
  next();
})

///requiring users pathway using a controller. All routes from this pathway will
///begin with /users/
var usersController = require('./controllers/users.js');
server.use('/users', usersController);

///requiring posts pathway using a controller. All routes from this pathway will
///begin with /posts/
var postsController = require('./controllers/posts.js');
server.use('/posts', postsController);

///get pathway to the homepage
server.get('/home', function (req, res) {
  if(req.session.currentUser) {
  res.render('home');
  } else {
    res.redirect(302, '/');
  }
});

///catch all pathway brings you back to login or create user page
server.use('/', function(req, res) {
  res.render('loginWall');
});


//connecting mongoose locally and on heroku
mongoose.connect(MONGOURI + "/" + dbname);

///setting server to listen locally and on heroku
  server.listen(PORT, function () {
    console.log("I LOVE WALTAH");
  })
