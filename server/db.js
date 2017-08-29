'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird'); 
var chalk = require('chalk');

Promise.promisifyAll(mongoose);

var DATABASE_URI = "mongodb://localhost:27017/pick-six";

if(process.env['MONGODB_URI']){
	var db = mongoose.connect(process.env['MONGODB_URI']).connection;
}
else{
	var db = mongoose.connect(DATABASE_URI).connection;
}


var startDbPromise = new Promise(function (resolve, reject) {
    db.on('open', resolve);
    db.on('error', reject);
});

console.log(chalk.yellow('Opening connection to MongoDB . . .'));
startDbPromise.then(function () {
    console.log(chalk.green('MongoDB connection opened!'));
});

module.exports = startDbPromise;