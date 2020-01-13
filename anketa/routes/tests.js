var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

var Tests = require('../models/test');
var Responses = require('../models/responses');
var Questions = require('../models/question');
var Counter = require('../models/counter');

function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

router.get('/', function(req, res, next) {
  res.send('Tests route');
});

router.post('/new', isValidUser, function(req, res, next) {
  var creator = req.user.username;
  var counterNext = Counter.counter('tests', (id) => {
    var testData = {
      ...req.body,
      creatorUsername: creator,
      id: id.next
    };
    var test = new Tests(testData);
  
    test.save();
    res.send(200);
  });
  
})

module.exports = router;

