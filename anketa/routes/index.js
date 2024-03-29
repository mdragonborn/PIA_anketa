var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var randomstring = require('just.randomstring');

router.get('/captcha', function(req, res, next){
  res.send({captcha: randomstring(6)});
})

module.exports = router;
