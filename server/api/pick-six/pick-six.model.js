var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    states: {
        type: Object
    },
    correctAnswers: [{
        type: String
    }],
    answerKeySize: {
        type: Number
    }
});

schema.statics.findPickSixByOwner = function (userId) {
    return this.find({ owner: userId });
};

module.exports = mongoose.model('Pick-Six', schema);