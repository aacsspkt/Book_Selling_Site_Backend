const express = require('express');
const router = express.Router();
const Category = require('../models/Category')

router.route('/')
.get((req, res, next) => {
    Category.find({})
    .then(categories => {
        res.status(200).json(categories);
    }).catch(next);
})

.post((req, res, next) => {
    Category.create(req.body)
    .then(category => {
        res.status(201).json(category);
    }).catch(next);
})

.delete((req, res, next) => {
    Category.deleteMany({})
    .then(reply => {
        res.status(200).json(reply);
    }).catch(next);
})

router.route('/:category_id')
.get((req, res, next) => {
    Category.findById(req.params.category_id)
    .then(category => {
        res.status(200).json(category);
    }).catch(next);
})

.put((req, res, next) => {
    Category.findByIdAndUpdate(req.params.category_id, {$set: req.body}, {new: true})
    .then(updatedCategory => {
        res.status(200).send(updatedCategory);
    }).catch(next);
})

.delete((req, res, next) => {
    Category.findByIdAndRemove(req.params.category_id)
    .then(reply => {
        res.json(reply);
    }).catch(next);
});

module.exports = router;