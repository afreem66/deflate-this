var express = require('express'),
    PORT = process.env.PORT || 5432,
    server = express(),
    // MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    // dbname = "forum",
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
var forumController = require('./controllers/forum.js');
server.use('/forum', forumController);

//pathway to homepage
server.use('/', function(req, res) {
  res.render('welcome');
});

///connecting mongoose
// mongoose.connect(MONGOURI + "/" + dbname);
mongoose.connect("mongodb://localhost:27017/forum")
///setting server to listen
  server.listen(PORT, function () {
    console.log("server is up on PORT: ", PORT);
  })
