var express = require('express');
var router = express.Router();
var moment = require('moment');

var Tests = require('../models/test');
var Responses = require('../models/responses');
var Questions = require('../models/question');
var Counter = require('../models/counter');
var Reports = require('../models/report');

var util = require('../util');

router.get('/', function(req, res, next) {
  res.send('Tests route');
});

router.post('/new', util.isValidUser, function(req, res, next) {
  var creator = req.user.username;
  Counter.counter('tests', (id) => {
    var testData = {
      ...req.body,
      creatorUsername: creator,
      maxScore: 0,
      id: id.next
    };
    if(testData.type==='T'){
      util.processQuestions(testData)
    }
    var test = new Tests(testData);
    var report = new Reports({
      testId: testData.id,
      type: testData.type,
      maxScore: testData.maxScore,
      average: 0,
      scores: new Array(10).fill(0),
      questions: util.genReportQuestions(testData.questions)
    })
    test.validate((err)=>{
      if(err){
        res.send(400, {});
      }
      else {
        test.save();
        report.save();
        res.send(200, {});
      }
    })
  });
})

router.get('/created', util.isValidUser, function(req, res, next) {
  Tests.find({creatorUsername:req.user.username}, (err, docs) => {
    var testMap = [];

    docs.forEach((test, i) => {
      testMap.push(test);
    });
    res.send(200, testMap);
  })
});

router.get('/available', util.isValidUser, function(req, res, next) {
  Tests.find({}, (err, testDocs) => {
    Responses.find({username: req.user.username, finished: true}, (err, responseDocs) => {
      let unavailable = new Set();
      let scores = new Map();
      responseDocs.forEach((res, i)=>{
        unavailable.add(res.testId);
        scores.set(res.testId, res.score);
      })

      let testMap = [];
      testDocs.forEach((test,i) => {
        util.cleanAnswers(test);
        testMap[i] = { test, available: !unavailable.has(test.id), score: scores.get(test.id)};
      })

      res.send(200, testMap);

    })
  })
});

router.post('/get', util.isValidUser, function(req, res, next) {
  Tests.find({id: req.body.id}, (err, docs) => {
    if(docs.length===0 || err) {
      res.send(404);
    }
    else{
      util.cleanAnswers(docs[0]);
      res.send(200, docs[0]);
    }
  })
})

router.post('/getresponse', util.isValidUser, function(req, res, next) {
  Responses.find({username: req.user.username, testId: req.body.id}, 
    (err, data) => {
      if(err){ res.send(404)}
      else if(data.length===0) {
        Tests.find({id:req.body.id}, (err, testData) => {
          if(err || testData.length===0) {
            res.send(405)
          } else{
            let answers = testData[0].questions.map(q => new Array(q.answerFields.length).fill(null))

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

router.post('/saveresponse', util.isValidUser, function(req, res, next) {
  // Validation? Compute score if finished?
  if(req.body.response.finished) {
    util.gradeTest(req, res, saveResponse);
  }
  else util.saveResponse(req, res)
})

router.post('/start', util.isValidUser, function(req, res, next) {
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

