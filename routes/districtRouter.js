const express = require('express');
const router = express.Router();
const District = require('../models/District');
const auth = require('./authentication');

router.route('/')
    .get((req, res, next) => {
        District.find()
            .then((districts) => {
                res.status(200).json(districts);
            }).catch(next);
    })
    .post(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        District.findOne({ name: req.body.name })
            .then(district => {
                if (district) {
                    let err = new Error('District already exists!');
                    err.status = 403;
                    next(err);
                } else {
                    District.create(req.body)
                        .then(district => { res.status(201).json(district) })
                        .catch(err => next(err));
                }
            }).catch(next);
    })

    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
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
    .put(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        District.findByIdAndUpdate(req.params.district_id, { $set: req.body }, { new: true })
            .then(district => {
                res.json(district);
            }).catch(err => next(err));
    })
    .delete(auth.verifyUser, auth.verifyAdmin, (req, res, next) => {
        District.deleteOne({ _id: req.params.district_id })
            .then(reply => {
                res.json(reply);
            }).catch(err => next(err));
    });

module.exports = router;
