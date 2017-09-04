var router = require('express').Router();
var mongoose = require('mongoose');
var userModel = require('../users/user.model');
var pickSixModel = require('./pick-six.model');

router.param('id', function (req, res, next, id) {
    pickSixModel.findById(id)
        .populate('owner')
        .then(pickSix => {
            if (!pickSix) {
                var err = new Error('pickSix not found');
                err.status = 404;
                return next(err);
            }
            req.pickSix = pickSix;
            next();
        })
        .then(null, next);
});

var ensureOwner = function (req, res, next) {
    console.log('owner: ', req.pickSix.owner._id);
    console.log('userId: ', req.user._id);
    if (req.pickSix.owner._id.toString() === req.user._id.toString()) {
        next();
    } else {
        var err = new Error('Not authorized');
        err.status = 401;
        next(err);
    }
}

router.get('/', (req, res, next) => {

    pickSixModel.find().populate('class owner')
        .then(pickSixes => {
            res.send(pickSixes);
        })
        .then(null, next);

});

router.get('/:id', (req, res, next) => {
    res.json(req.pickSix);
});

router.post('/', (req, res, next) => {

    pickSixModel.create(req.body)
        .then(pickSix => res.json(pickSix))
        .then(null, next);
});

router.put('/:id', ensureOwner, (req, res, next) => {

    pickSixModel.findByIdAndUpdate(req.params.id,
            req.body, { new: true }).exec()
        .then(updatedPickSix => {
            res.send(updatedPickSix);
        })
        .then(null, next);

});

router.delete('/:id', ensureOwner, (req, res, next) => {

    pickSixModel.findByIdAndRemove(req.params.id).exec()
        .then(deletedPickSix => {
            res.send(deletedPickSix);
        })
        .then(null, next);

});

module.exports = router;