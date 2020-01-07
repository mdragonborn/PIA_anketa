var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



router.post('/register', function(req, res, next) {
  addToDB(req, res);
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

router.get('/user',isValidUser,function(req,res,next){
  return res.status(200).json(req.user);
});

router.get('/logout',isValidUser, function(req,res,next){
  req.logout();
  return res.status(200).json({message:'Logout Success'});
})

function isValidUser(req,res,next){
  if(req.isAuthenticated()) next();
  else return res.status(401).json({message:'Unauthorized Request'});
}

router.post('/change', isValidUser, function(req, res, next){
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

router.get('/requests', isValidUser, function(req, res, next){
  User.find({odobren:false}, function(err, docs){
    console.log(docs);
    var userMap = [];

    docs.forEach(function(user, i) {
      userMap.push(user);
    });
    res.send(200, userMap);
  })
});

router.get('/confirm/:username', isValidUser, function(req, res, next){
  if(req.user['kategorija']!=='A')   return res.status(401);
  User.findOne({username:req.params.username}, function(err, doc){
    if(err){
      res.send(304, {error: err});
    }
    else {
      doc.odobren = true;
      doc.save();
      req.logout();
      res.send(200, {message: 'success'});
    }
  });
  console.log(req.params.username);
});

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

module.exports = router;
