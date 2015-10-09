var express = require('express'),
    PORT = process.env.PORT || 5432,
    server = express(),
    MONGOURI = process.env.MONGOLAB_URI,
    mongoose = require('mongoose');

  server.get('/', function (req, res) {
    res.write("Welcome to my amazing app");
    res.end();
  });

  mongoose.connect(MONGOURI);
  server.listen(PORT, function () {
    console.log("server is up on PORT: ", PORT);
  })
