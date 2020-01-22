var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

var util = require('../util');

router.get('/', function(req, res, next) {
  res.send('User route');
});

router.post('/register', function(req, res, next) {
  util.addToDB(req, res);
});

router.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(501).json(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.status(200).json({message:'Login Success'});
    });
  })(req, res, next);
})

router.get('/user',util.isValidUser,function(req,res,next){
  return res.status(200).json(req.user);
});

router.get('/logout',util.isValidUser, function(req,res,next){
  req.logout();
  return res.status(200).json({message:'Logout Success'});
})

router.post('/change', util.isValidUser, function(req, res, next){
  console.log("username ", req.user.username);
  let ret = 304;
  User.findOne({username:req.user.username}, function(err, doc){
    if(err){
      res.send(304, {error: err});
    }
    if(!User.comparePassword(req.body.oldpassword, doc.password)){
     res.send(401, {error: "Wrong password."});
    }
    else {
      doc.password = User.hashPassword(req.body.password);
      doc.save();
      req.logout();
      res.send(200, {message: 'success'});
    }
  });
})

router.get('/requests', util.isValidUser, function(req, res, next){
  User.find({odobren:false}, function(err, docs){
    console.log(docs);
    var userMap = [];

    docs.forEach(function(user, i) {
      userMap.push(user);
    });
    res.send(200, userMap);
  })
});

router.get('/confirm/:username', util.isValidUser, function(req, res, next){
  if(req.user['kategorija']!=='A')   return res.send(401, {});
  User.findOne({username:req.params.username}, function(err, doc){
    if(err){
      res.send(304, {error: err});
    }
    else {
      doc.odobren = true;
      doc.save();
      res.send(200, {message: 'success'});
    }
  });
});

module.exports = router;
