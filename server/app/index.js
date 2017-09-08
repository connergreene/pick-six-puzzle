'use strict'; 

var app = require('express')();
var path = require('path');
var User = require('../api/users/user.model');
var PickSix = require('../api/pick-six/pick-six.model');
var SpellingBee = require('../api/spelling-bee/spelling-bee.model');
var request = require('request');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var _ = require('lodash');
var mongoose = require('mongoose');
var passport = require('passport'); 
var session = require('express-session');
var server = require('http').Server(app);
var MongoStore = require('connect-mongo')(session);

app.use(cookieParser());

app.use(require('./logging.middleware'));

app.use(require('./requestState.middleware'));

app.use(bodyParser.json({ type: 'application/*+json' }))

app.use(bodyParser.urlencoded({ extended: true }));

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

app.use(require('./statics.middleware'));
 
app.use('/auth', require('../auth/auth.router'));

app.use('/api', require('../api/api.router'));

var rootPath = path.join(__dirname, '../../');
var indexPath = path.join(rootPath, 'public', 'index.html');

app.get('/*', function (req, res) {
    res.sendFile(indexPath);
});

app.use(require('./error.middleware'));

module.exports = {
  app : app,
  server : server
}