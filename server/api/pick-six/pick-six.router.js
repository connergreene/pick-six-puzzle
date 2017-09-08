var router = require('express').Router();
var mongoose = require('mongoose');
var HttpError = require('../../utils/HttpError');
var userModel = require('../users/user.model');
var pickSixModel = require('./pick-six.model');
var sowpods = require('pf-sowpods');


router.param('id', function (req, res, next, id) {
    pickSixModel.findById(id).exec()
    .then(function (pickSix) {
      if (!pickSix) throw HttpError(404);
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

    pickSixModel.find().populate('owner')
        .then(pickSixes => {
            res.send(pickSixes);
        })
        .then(null, next);

});

router.get('/:id', function (req, res, next) {
  res.status(200).json(req.pickSix);
});

router.get('/check/:letters', function(req, res, next){
  var letters = '';
  for(var i = 0; i < 6; i++){
    letters+=req.params.letters;
  }
  var words = sowpods.anagram(letters);
  var results = [];
  for (var i = 0; i < words.length; i++){
    if(words[i].length>=6){
      results.push(words[i])
    }
  }
  res.send(results);
})

router.post('/', (req, res, next) => {

    pickSixModel.create(req.body)
        .then(pickSix => res.json(pickSix))
        .then(null, next);
});

router.put('/:id', (req, res, next) => {

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