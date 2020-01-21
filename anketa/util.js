var Tests = require('./models/test');
var User = require('./models/user');
var Responses = require('./models/responses');
var Reports = require('./models/report');
var Counter = require('./models/counter');
var Questions = require('./models/question')

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
        if(err) {
            req.status(400);
            return;
        }
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
          i++;
        }
  
        req.body.response.score = totalScore;
      }
      insertToReport(req, res, ()=> {
        callback(req, res);
      });
    })
  }


function insertToReport(req, res, callback) {
    Reports.find({testId: req.body.response.testId}, (err, report) => {
        if(err || !report.length) {
            res.send(400, {});
        }
        else {
            let i = 0;
            report[0].responseCount++;
            if(report[0].type==='T'){
                report[0].average = (report[0].average*(report[0].responseCount-1))+req.body.response.score;
                report[0].average /= report[0].responseCount;
                report[0].scores[req.body.response.score===0?0:Math.floor((req.body.response.score/report[0].maxScore-0.01)*10)]++;
            }
            let answers = req.body.response.answers;
            for(let question of report[0].questions) {
                switch(question.type) {
                case 1:
                case 2:
                    let k = 0;
                    if(question.ordered){
                      for(let field of question.answerFields) {
                          let index = field.answers.findIndex(element => element.content===answers[i][k]);
                          if(index!==-1){
                              field.answers[index].occurrences++;
                          }
                          else {
                              field.answers.push({content:answers[i][k], occurrences: 1});
                          }
                          k++;
                      }
                    }
                    else {
                      let field = question.answerFields[0];
                      for(let answer of answers[i]){
                        let index = field.answers.findIndex(element => element.content===answer);
                        if(index!==-1){
                            field.answers[index].occurrences++;
                        }
                        else {
                            field.answers.push({content:answer, occurrences: 1});
                        }
                      }
                    }
                    break;
                    case 4:
                    case 5:
                        for(let j in question.answerFields)
                            if(answers[i][j])
                                question.answerFields[j].answers[0].occurrences++;
                    
                    break;
                }
                i++;
            }
            Reports.findOneAndUpdate({testId: report[0].testId}, 
                {$set:{
                    scores: report[0].scores,
                    questions: report[0].questions,
                    average: report[0].average,
                    responseCount: report[0].responseCount
                 }}, {'new':true, useFindAndModify: false, upsert: true}, 
                (err, result) => {
                    callback(req, res);
                });
            }
    })
  }

  function genReportQuestions(testQuestions) {
    let questions = testQuestions.map(question => {
      return {
        question: question.question,
        type: question.type,
        ordered: question.ordered,
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

  function saveResponse(req, res, callback) {

    Responses.findOneAndUpdate({_id:req.body.response._id}, 
      {$set:{answers: req.body.response.answers, finished: req.body.response.finished, score: req.body.response.score }}, {'new':true, 
      useFindAndModify: false,
      upsert: true}, 
      (err, result) => {
        if(callback) {
          callback()
        }
        if(res){
          if(err) res.send(400,{});
          else res.send(200, { score: req.body.response.score });
        }
      });
  }

function getReport(req, res, test) {
  Reports.find({testId: req.body.testId}, (err, report) => {
    // check creator id and body user id
    Responses.find({testId: req.body.testId, finished: true}, (err2, responses) => {
      if(err || err2 || report.length===0) {
        res.send(400, {});
      } else {
        let baseInfo = responses.map(r => {return {username: r.username, endTime: r.endTime, score: r.score}});
        res.send(200, {test: test, report: report[0], responsesInfo: baseInfo});
      }
    })
  })
}

function saveQuestions(questions) {
  for(let q of questions) {
    if(q.id) {
      continue;
    }
    Counter.counter('question', (id) => {
      let question = new Questions({
        id: id.next,
        ...q
      });
      question.save();
    });
  }
}


  module.exports = {
      isValidUser,
      cleanAnswers,
      gradeTest, 
      genReportQuestions,
      processQuestions,
      addToDB,
      saveResponse,
      getReport,
      saveQuestions,
  }