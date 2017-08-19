var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    path = require('path'),
    request = require('request'),
    sowpods = require('pf-sowpods');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname + '/browser'));
app.use(express.static(__dirname + '/node_modules'));

var validFrontendRoutes = ['/', '/check'];
var indexPath = path.join(__dirname, 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});


var port = 8080;
var server = app.listen(process.env.PORT || port, function () {
  console.log('HTTP server patiently listening on port', port);
});

app.get('/check/:letters', function(req, res, next){
  var letters = '';
  for(var i = 0; i < 6; i++){
    letters+=req.params.letters;
  }
  var words = sowpods.anagram(letters);
  var results = [];
  for (var i = 0; i < words.length; i++){
    if(words[i].length>=6){
      results.push(words[i])
      // if(words[i][0] === "D" && words[i][1] === "O"){
      //   console.log(words[i])
      // }
    }
  }
  res.send(results);
})

console.log('pick six is running on 8080');
exports = module.exports = app;