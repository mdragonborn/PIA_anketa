var Tests = require('../models/test');
var Responses = require('../models/responses');
var Questions = require('../models/question');
var Counter = require('../models/counter');
var Reports = require('../models/report');
var express = require('express');

function isValidUser(req,res,next){
    if(req.isAuthenticated()) next();
    else return res.status(401).json({message:'Unauthorized Request'});
}


async function addToDB(req, res) {
    var user = new User({
        email:req.body.email,
        username:req.body.username,
        ime: req.body.ime,
        prezime: req.body.prezime,
        jmbg:req.body.jmbg,
        datum_rodjenja: req.body.birthdate,
        mesto_rodjenja: req.body.place,
        phone: req.body.phone,
        password:User.hashPassword(req.body.password),
        kategorija:"I",
        odobren: false,
        creation_dt: Date.now()
    });

    try{
        doc = await user.save();
        return  res.status(201).json(doc);
    }
    catch(err) {
        return res.status(501).json(err);
    }
}
  
  function cleanAnswers(test) {
    test.questions.forEach(q => {
      q.answerFields.forEach(a => a.answer=null);
    })
  }
  
  function gradeTest(req, res, callback) {
    Tests.find({id: req.body.response.testId}, (err, test) => {
      if(test[0].type==='T') {
        let i=0;
        let totalScore = 0;
        for(let question of test[0].questions) {
          let k = 0;
          let score = 0;
          if(question.type===1 || question.type===2 || question.type===5) {
            if(!question.ordered && question.type!==5) {
              req.body.response.answers[i].sort();
            }
            if(question.type===2) 
              req.body.response.answers[i] = req.body.response.answers[i].map(a => {return a!==null?a.toLowerCase():a})
            for(let k=0, j=0; k<question.answerFields.length && j<question.answerFields.length; k++, j++) {
              while(!question.ordered
                && question.answerFields[k].answer>req.body.response.answers[i][j]
                && j<question.answerFields.length-1) j++;
              if(question.answerFields[k].answer===req.body.response.answers[i][j])
                score += 1.0/question.answerFields.length;
                console.log(question.answerFields, req.body.response.answers, i, k)
            }
          }
  
          if(question.type===4) {
            for(let k=0; k<question.answerFields.length; k++) {
              if(question.answerFields[k].answer &&req.body.response.answers[i][k]) {
                score = 1;
                break;
              }
            }
          }
          totalScore += score*question.weight;
          console.log(i, totalScore)
          i++;
        }
  
        req.body.response.score = totalScore;
      }
        callback(req, res);
    })
  }

  function genReportQuestions(testQuestions) {
    let questions = testQuestions.map(question => {
      return {
        question: question.question,
        type: question.type,
        answerFields: question.answerFields.map(field => {
          return {
            extraInfo: field.extraInfo,
            answers: question.type>3?[{occurrences: 0}]:[]
          }
        })
      }
    });
    return questions;
  }
  
  function processQuestions(testData) {
    let max = 0;
    for(let question of testData.questions) {
      max += question.weight;
      if(question.type<3 && !question.ordered) {
        question.answerFields.sort((a,b) => (a.answer>b.answer)?1:-1)
      }
    }
  
    testData.maxScore = max;
  }

  module.exports = {
      isValidUser,
      cleanAnswers,
      gradeTest, 
      insertToReport,
      genReportQuestions,
      processQuestions,
      addToDB
  }