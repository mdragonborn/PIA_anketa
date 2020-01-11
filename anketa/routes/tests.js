var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

var Tests = require('../models/test');
var Responses = require('../models/responses');
var Questions = require('../models/question');
var Counter = require('../models/counter');

router.get('/', function(req, res, next) {
  res.send('Tests route');
});

