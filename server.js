var express = require('express'),
    PORT = process.env.PORT || 5432,
    server = express(),
    MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    dbname = "forum",
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    expressLayouts = require('express-ejs-layouts'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    session = require('express-session'),
    bcrypt = require('bcryptjs');

///defining path for
  server.set('views', './views');
  server.set('view engine', 'ejs');

  server.use(session({
    secret: "SOME PASSPHRASE TO ENCRYPT",
    resave : true,
    saveUninitialized: true
  }));

///setting up packages
server.use(express.static('./public'));

server.use(methodOverride('_method'));

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(morgan('dev'));

server.use(expressLayouts);

server.use(function (req, res, next) {
  res.locals.user = req.session.currentUser;
  next();
})
///server pathways
var usersController = require('./controllers/users.js');
server.use('/users', usersController);

///server pathways
var postsController = require('./controllers/posts.js');
server.use('/posts', postsController);

server.get('/welcome', function (req, res) {
  res.render('welcome', {
    thisUser : req.session.currentUser.username
  });
});

//catch all pathway brings you back to login or create user page
server.use('/', function(req, res) {
  res.render('loginWall');
});


//connecting mongoose
mongoose.connect(MONGOURI + "/" + dbname);

///setting server to listen
  server.listen(PORT, function () {
    console.log("I LOVE WALTAH");
  })
