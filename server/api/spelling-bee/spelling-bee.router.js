var router = require('express').Router();
var mongoose = require('mongoose');
var userModel = require('../users/user.model');
var spellingBeeModel = require('./spelling-bee.model');

router.param('id', function (req, res, next, id) {
    spellingBeeModel.findById(id)
        .populate('owner')
        .then(spellingBee => {
            if (!spellingBee) {
                var err = new Error('spellingBee not found');
                err.status = 404;
                return next(err);
            }
            req.spellingBee = spellingBee;
            next();
        })
        .then(null, next);
});

var ensureOwner = function (req, res, next) {
    console.log('owner: ', req.spellingBee.owner._id);
    console.log('userId: ', req.user._id);
    if (req.spellingBee.owner._id.toString() === req.user._id.toString()) {
        next();
    } else {
        var err = new Error('Not authorized');
        err.status = 401;
        next(err);
    }
}


router.get('/', (req, res, next) => {

    spellingBeeModel.find().populate('class owner')
        .then(spellingBees => {
            res.send(spellingBees);
        })
        .then(null, next);

});

router.get('/:id', (req, res, next) => {
    res.json(req.spellingBee);
});

router.post('/', (req, res, next) => {
    
    spellingBeeModel.create(req.body)
        .then(spellingBee => res.json(spellingBee))
        .then(null, next);
});

router.put('/:id', ensureOwner, (req, res, next) => {

    spellingBeeModel.findByIdAndUpdate(req.params.id,
            req.body, { new: true }).exec()
        .then(updatedspellingBee => {
            res.send(updatedspellingBee);
        })
        .then(null, next);

});


router.delete('/:id', ensureOwner, (req, res, next) => {

    spellingBeeModel.findByIdAndRemove(req.params.id).exec()
        .then(deletedSpellingBee => {
            res.send(deletedSpellingBee);
        })
        .then(null, next);

});

module.exports = router;