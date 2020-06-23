const express = require('express');
const router = express.Router();
const District = require('../models/District');

//DONE TESTING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

router.route('/')
.get((req, res, next) =>{
    District.find()
    .then((districts) => {
        res.status(200).json(districts); //status = success!
    }).catch(next);
})
.post((req, res, next) => {
    District.create(req.body)
    .then(district => {
        res.status(201).json(district);//status = created!!
    }).catch(err => next(err));
})

.delete((req, res, next) => {
    District.deleteMany({})
    .then(reply => {
        res.json(reply);
    }).catch(err => next(err));
})

router.route('/:district_id')
.get((req, res, next) => {
    District.findById(req.params.district_id)
    .then(district => {
        res.json(district);
    }).catch(err => next(err));
})
.put((req,res,next) => {
    District.findByIdAndUpdate(req.params.district_id, {$set: req.body},{new: true})
    .then(district => {
        res.json(district);
    }).catch(err => next(err));
})
.delete((req,res,next) => {
    District.deleteOne({ _id: req.params.district_id})
    .then(reply => {
        res.json(reply);
    }).catch(err => next(err));
});

module.exports = router;
