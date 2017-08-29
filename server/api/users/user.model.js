'use strict'; 

var mongoose = require('mongoose'),
	shortid = require('shortid'),
	crypto = require('crypto'),
	_ = require('lodash');

var db = require('../../db');

var User = new mongoose.Schema({
	_id: {
		type: String,
		unique: true,
		default: shortid.generate
	},
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: String,
	salt: {
        type: String
    },
	isAdmin: {
		type: Boolean,
		default: false
	}
});

User.methods.sanitize = function () {
    return _.omit(this.toJSON(), ['password', 'salt']);
};

var generateSalt = function () {
	return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (plainText, salt) {
	var hash = crypto.createHash('sha1');
	hash.update(plainText);
	hash.update(salt);
	return hash.digest('hex');
};

User.pre('save', function (next) {
	if (this.isModified('password')) {
		this.salt = this.constructor.generateSalt();
		this.password = this.constructor.encryptPassword(this.password, this.salt);
	}
	next();
});

User.statics.generateSalt = generateSalt;
User.statics.encryptPassword = encryptPassword;

User.method('correctPassword', function (candidatePassword) {
	return encryptPassword(candidatePassword, this.salt) === this.password;
});

module.exports = mongoose.model('User', User);