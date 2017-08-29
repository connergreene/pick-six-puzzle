'use strict'; 

var app = require('express')();
var path = require('path');
var User = require('../api/users/user.model');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport'); 
var session = require('express-session');
var server = require('http').Server(app);
var MongoStore = require('connect-mongo')(session);
var sowpods = require('pf-sowpods');

app.use(cookieParser());

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(session({
  secret: 'puzz',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); 

passport.serializeUser(function (user, done){
    done(null, user.id);
}); 

passport.deserializeUser(function (id, done) {
    User.findById(id, done);
});

app.get('/session', function (req, res) {
    if (req.user) {
      res.send({ user: req.user.sanitize() });
    } 
    else {
      res.status(401).send('No authenticated user.');
    }
});

app.get('/pick-six/:letters', function(req, res, next){
  var letters = '';
  for(var i = 0; i < 6; i++){
    letters+=req.params.letters;
  }
  var words = sowpods.anagram(letters);
  var results = [];
  for (var i = 0; i < words.length; i++){
    if(words[i].length>=6){
      results.push(words[i])
      // if(words[i][0] === "D" && words[i][1] === "O"){
      //   console.log(words[i])
      // }
    }
  }
  res.send(results);
})

app.get('/spelling-bee/:letters', function(req, res, next){
  var letters = '';
  for(var i = 0; i < 10; i++){
    letters+=req.params.letters;
  }
  var words = sowpods.anagram(letters);
  var results = [];
  for (var i = 0; i < words.length; i++){
    if(words[i].length >= 5 && words[i].includes(letters[0])){
      results.push(words[i])
    }
  }
  res.send(results);
})

app.use(require('./statics.middleware'));
 
app.use('/auth', require('../auth/auth.router'));

app.use('/api', require('../api/api.router'));


var validFrontendRoutes = ['/', '/users', '/users/:id', '/pick-six', '/spelling-bee'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./error.middleware'));

module.exports = {
  app : app,
  server : server
}