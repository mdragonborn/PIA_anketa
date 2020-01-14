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

router.get('/created', isValidUser, function(req, res, next) {
  Tests.find({creatorUsername:req.user.username}, (err, docs) => {
    var testMap = [];

    docs.forEach((test, i) => {
      testMap.push(test);
    });
    res.send(200, testMap);
  })
});

router.get('/available', isValidUser, function(req, res, next) {
  Tests.find({}, (err, testDocs) => {
    Responses.find({username: req.user.username}, (err, responseDocs) => {
      let unavailable = new Set();
      responseDocs.forEach((res, i)=>{
        unavailable.add(res.testId);
      })

      let testMap = [];
      let testAvailable = []
      testDocs.forEach((test,i) => {
        testMap[i] = { test, available: !unavailable.has(test.id)};
        console.log(testMap[i]);
      })

      res.send(200, testMap);

    })
  })
});

router.post('/get', isValidUser, function(req, res, next) {
  console.log(req.body)
  Tests.find({id: req.body.id}, (err, docs) => {
    console.log(docs);
    if(docs.length===0 || err) {
      res.send(404);
    }
    else{
      res.send(200, docs[0]);
    }
  })
})

module.exports = router;

