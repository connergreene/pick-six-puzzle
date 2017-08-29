'use strict';

var HttpError = require('../utils/HttpError');
var router = require('express').Router();
var User = require('../api/users/user.model');
var passport = require('passport');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;


// When passport.authenticate('local') is used, this function will receive
// the email and password to run the actual authentication logic.
var strategyFn = function (email, password, done) {
	User.findOne({ email: email })
		.then(function (user) {
			// user.correctPassword is a method from the User schema.
			if (!user || !user.correctPassword(password)) {
				done(null, false);
			} 
			else {
				// Properly authenticated.
				done(null, user);
			}
		}, 
		function (err) {
				done(err);
		});
};

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

// A POST /login route is created to handle login.
router.post('/login', function (req, res, next) {

	var authCb = function (err, user) {

		if (err) return next(err);

		if (!user) {
			var error = new Error('Invalid login credentials.');
			error.status = 401;
			return next(error);
		}

		req.logIn(user, function (loginErr) {
			if (loginErr) return next(loginErr);
			res.status(200).send({
				user: user.sanitize()
			});
		});
	};

	passport.authenticate('local', authCb)(req, res, next);
});

router.get('/logout', function(req, res, next){
		req.logout();
		res.status(200).end()
})



module.exports = router;