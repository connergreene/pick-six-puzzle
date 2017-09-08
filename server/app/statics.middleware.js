'use strict';

var express = require('express'),
	router = express.Router(),
	path = require('path');

var rootPath = path.join(__dirname, '..', '..');

var publicPath = path.join(rootPath, 'public');

var npmPath = path.join(rootPath, 'node_modules');

router.use(express.static(rootPath));

router.use(express.static(publicPath));

router.use(express.static(npmPath));

module.exports = router;