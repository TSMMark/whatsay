var express = require('express')
  , bodyParser = require('body-parser')
  , router = express.Router()
  ;

router.get('/', function(req, res) {
  res.render('index', { title: 'WhatSay' });
});


module.exports = router;
