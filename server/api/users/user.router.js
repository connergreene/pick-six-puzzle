'use strict';

var router = require('express').Router()
var _ = require('lodash');
var HttpError = require('../../utils/HttpError');
var userModel = require('./user.model');
var pickSixModel = require('../pick-six/pick-six.model');
var spellingBeeModel = require('../spelling-bee/spelling-bee.model');

router.param('id', function (req, res, next, id) {
	userModel.findById(id).exec()
	.then(function (user) {
		if (!user) throw HttpError(404);
		req.requestedUser = user;
		next();
	})
	.then(null, next);
});

router.get('/', function (req, res, next) {
	userModel.find({}).exec()
	.then(function (users) {
		res.json(users);
	})
	.then(null, next);
});

router.post('/', function (req, res, next) {
	userModel.create(req.body)
		.then(user => {
			req.logIn(user, function(loginErr) {
				if (loginErr) return next(loginErr);
				res.status(200).send(
					user.sanitize()
				);
			});
		})
	.then(null, next);
});

router.get('/me', function(req, res, next){
	userModel.findById(req.session.userId).exec()
	.then(function(loggedInUser){
		res.json(loggedInUser)
	})
	.then(null, next)
})

router.get('/:id', function (req, res, next) {
	res.status(200).json(req.requestedUser);
});

router.get('/:id/pick-sixes', function (req, res, next) {
	pickSixModel.findPickSixByOwner(req.params.id)
	.then(pickSixes => res.json(pickSixes))
	.then(null, next);
});

router.get('/:id/spelling-bees', function (req, res, next) {
	spellingBeeModel.findSpellingBeeByOwner(req.params.id)
	.then(spellingBees => res.json(spellingBees))
	.then(null, next);
});

router.put('/:id', function (req, res, next) {
	_.extend(req.requestedUser, req.body);
	req.requestedUser.save()
	.then(function (user) {
		res.json(user);
	})
	.then(null, next);
});

router.delete('/:id', function (req, res, next) {
	req.requestedUser.remove()
	.then(function () {
		res.status(204).end();
	})
	.then(null, next);
});

module.exports = router;