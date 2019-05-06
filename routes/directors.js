const express = require('express');
const router = express.Router();


//MODEL
let Director = require('../models/Director');

/* POST director add. */
router.post('/',(req,res)=>{
  let director = new Director(req.body);
  let promise = director.save();
  promise.then((data)=>{
    res.json(data);
  }).catch((err)=>{
    res.json(err);
  });
});

module.exports = router;
