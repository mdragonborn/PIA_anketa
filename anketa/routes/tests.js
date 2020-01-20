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
      let finished = new Set();
      let scores = new Map();
      responseDocs.forEach((res, i)=>{
        finished.add(res.testId);
        scores.set(res.testId, res.score);
      })

      let testMap = [];
      testDocs.forEach((test,i) => {
        util.cleanAnswers(test);
        if(test.type==='T')
          testMap[i] = { test, finished: finished.has(test.id), score: scores.get(test.id)};
        else 
          testMap[i] = {test, finished: finished.has(test.id)}
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
  let user = req.body.username!==''?req.body.username:req.user.username;
  Responses.find({username: user, testId: req.body.id}, 
    (err, data) => {
      if(err){ res.send(404, {})}
      Tests.find({id:req.body.id}, (err, testData) => {
        if(err || testData.length===0) {
          res.send(405, {})
        } else{
          if(testData[0].creatorUsername!==req.user.username && (data.length !==0 && data[0].username !==req.user.username)) {
              res.send(401, {});
              return;
          }
          let resp = null;
          if(data.length) {
            resp = data[0];
          } else{
            let answers = testData[0].questions.map(q => new Array(q.answerFields.length).fill(null))

            resp = new Responses({
              testId: req.body.id,
              username: user,
              answers: answers,
              beginning: null,
              finished: false,
              durationMin: testData[0].durationMin,
              score: 0
            });
            resp.save();
          }
          res.send(200, resp);
        }
      })
    })
})

router.post('/saveresponse', util.isValidUser, function(req, res, next) {
  // Validation? Compute score if finished?
  if(req.body.response.finished) {
    util.gradeTest(req, res, util.saveResponse);
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

router.post('/report', util.isValidUser, function(req, res, next) {
  Tests.find({id: req.body.testId}, (err0, test) => {
    if(err0 || test.length===0) res.send(400, {});
    else if(test[0].creatorUsername!==req.user.username) res.send(401, {});
    else {
      Responses.find({testId: req.body.testId, finished: false, 
        beginning: { $ne: null}, 
        end: { $lte: new Date().toISOString()}}, (err, responsesNf) => {
          if(responsesNf.length) {
            for(let i in responsesNf) {
              responsesNf[i].finished = true;
              util.gradeTest({body: {response: responsesNf[i]}}, null, (rq, rs) => {
                if(+i===(responsesNf.length-1)) {
                  util.saveResponse(rq, null, () => {util.getReport(req, res, test[0])});
                }
                else util.saveResponse(rq, null)
              })
            }
          }
        else {
          util.getReport(req, res, test[0]);
        }
      })
    }
  })
})

router.post('/fullResponse', util.isValidUser, function(req, res, next) {

  Responses.findOne({testId: req.body.testId, username: req.body.username}, (err, res) => {
    if(err || res.length===0) {
      res.send(400, {})
    } else{
      res.send(200, res[0]);
    }
  })

})

module.exports = router;

