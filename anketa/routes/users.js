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
