var router = require('express').Router();
var mongoose = require('mongoose');
var HttpError = require('../../utils/HttpError');
var userModel = require('../users/user.model');
var spellingBeeModel = require('./spelling-bee.model');
var sowpods = require('pf-sowpods');

router.param('id', function (req, res, next, id) {
  spellingBeeModel.findById(id).exec()
  .then(function (spellingBee) {
    if (!spellingBee) throw HttpError(404);
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

router.get('/check/:letters', function(req, res, next){
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

router.post('/', (req, res, next) => {
    
    spellingBeeModel.create(req.body)
        .then(spellingBee => res.json(spellingBee))
        .then(null, next);
});

router.put('/:id', (req, res, next) => {

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