var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Candidate = mongoose.model('Candidate');

router.get('/voting', function(req, res, next) {
  Candidate.find(function(err, candidates){
    if(err){ return next(err); }
    res.json(candidates);
  });
});

router.post('/voting', function(req, res, next) {
  var candidate = new Candidate(req.body);
  candidate.save(function(err, candidate){
    if(err){ return next(err); }
    res.json(candidate);
  });
});

router.param('candidate', function(req, res, next, id) {
  var query = Candidate.findById(id);
  query.exec(function (err, candidate){
    if (err) { return next(err); }
    if (!candidate) { return next(new Error("can't find candidate")); }
    req.candidate = candidate;
    return next();
  });
});

router.get('/voting/:candidate', function(req, res) {
  res.json(req.candidate);
});

//:comment calls the middleware (router.param)
router.put('/voting/:candidate/upvote', function(req, res, next) {
  req.candidate.upvote(function(err, candidate){
    if (err) { return next(err); }
    res.json(candidate);
  });
});

router.delete('/voting/:candidate', function(req, res) {
  console.log("in Delete");
  req.candidate.remove();
  res.json(req.candidate);
});
module.exports = router;

