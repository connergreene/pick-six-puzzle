var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    letters: {
        type: String
    },
    correctAnswers: [{
        type: String
    }],
    answerKeySize: {
        type: Number
    }
});

schema.statics.findSpellingBeeByOwner = function (userId) {
    return this.find({ owner: userId });
};

module.exports = mongoose.model('Spelling-Bee', schema);