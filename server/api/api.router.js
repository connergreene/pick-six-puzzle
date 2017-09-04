'use strict';

var router = require('express').Router();

router.use('/users', require('./users/user.router'));

router.use('/pick-six', require('./pick-six/pick-six.router'));

router.use('/spelling-bee', require('./spelling-bee/spelling-bee.router'));

module.exports = router;