var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var moment = require('moment');

var Tests = require('../models/test');
var Responses = require('../models/responses');
var Questions = require('../models/question');
var Counter = require('../models/counter');

function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

function cleanAnswers(test) {
  for(let q of test.questions){
    for(let a of q.answerFields){
      a.answer = null;
    }
  }
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
    test.validate((err)=>{
      if(err){
        res.send(400, {});
      }
      else {
        test.save();
        res.send(200, {});
      }
    })
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
    Responses.find({username: req.user.username, finished: true}, (err, responseDocs) => {
      let unavailable = new Set();
      responseDocs.forEach((res, i)=>{
        unavailable.add(res.testId);
      })

      let testMap = [];
      let testAvailable = []
      testDocs.forEach((test,i) => {
        cleanAnswers(test);
        testMap[i] = { test, available: !unavailable.has(test.id)};
      })

      res.send(200, testMap);

    })
  })
});

router.post('/get', isValidUser, function(req, res, next) {
  Tests.find({id: req.body.id}, (err, docs) => {
    if(docs.length===0 || err) {
      res.send(404);
    }
    else{
      cleanAnswers(docs[0]);
      res.send(200, docs[0]);
    }
  })
})

router.post('/getresponse', isValidUser, function(req, res, next) {
  Responses.find({username: req.user.username, testId: req.body.id}, 
    (err, data) => {
      if(err){ res.send(404)}
      else if(data.length===0) {
        Tests.find({id:req.body.id}, (err, testData) => {
          if(err || testData.length===0) {
            res.send(405)
          } else{
            let answers = [];
            let temp = [];
            for(let q of testData[0].questions) {
              for(let a of q.answerFields) {
                temp.push(null);
              }
              answers.push(temp);
              temp = [];
            }

            let resp = new Responses({
              testId: req.body.id,
              username: req.user.username,
              answers: answers,
              beginning: null,
              finished: false,
              durationMin: testData[0].durationMin,
              score: 0
            });
            resp.save();
            res.send(200, resp);
          }
        })
      }
      else{
        res.send(data[0]);
      }
    })
})

router.post('/saveresponse', isValidUser, function(req, res, next) {
  // Validation? Compute score if finished?
  Responses.findOneAndUpdate({_id:req.body.response._id}, 
    {$set:{answers: req.body.response.answers, finished: req.body.response.finished }}, {'new':true, 
    useFindAndModify: false,
    upsert: true}, 
    (err, result) => {
      if(err) res.send(400,{});
      res.send(200, {});
})
})

router.post('/start', isValidUser, function(req, res, next) {
  Responses.find({_id: req.body._id}, (err, doc) => {
    if(err || doc.length===0) { res.send(404)}
    else {
      if(req.user.username!==doc[0].username) res.send(401);
      else {
        let beginning = new Date();
        let end = moment(beginning).add(doc[0].durationMin, 'm').toDate();

        Responses.findOneAndUpdate({_id:req.body._id}, 
          {$set:{started:true, beginning: beginning, end: end}}, {'new':true, 
          useFindAndModify: false,
          upsert: true}, 
          (err, result) => {
          res.send(200, result);
      })
    }
  }})
})
module.exports = router;

