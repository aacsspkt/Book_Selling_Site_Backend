const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('./authentication');

router.route('/')
.get((req, res, next) => {
	Book.find()
	.populate('category')
    .then((books) => {
        res.status(200).json(books);
    }).catch(next);
})
.post(auth.verifyUser, (req, res, next) => {
	Book.create({... req.body, owner: req.user.profileId})
    .then((book) => {
        res.status(201).json(book);
    }).catch(next);
});

router.route('/:book_id')
.get((req, res, next) => {
	Book.findById(req.params.book_id)
	.populate('category')
	.populate('owner')
    .then(book => {
        res.status(200).json(book);
    }).catch(next);
})
.put(auth.verifyUser, (req, res, next) => {
	Book.findById(req.params.book_id)
	.then(book => {
		const err = auth.verifyOwnerOfBook(book.owner, req.user.profileId);
		if (err) return next(err);
		book.title = req.body.title;
		book.author = req.body.author;
		book.publication = req.body.publication;
		book.image = req.body.image;
		book.condition = req.body.condition;
		book.category = req.body.category;
		book.cost = req.body.cost;
		book.deliveryArea = req.body.deliveryArea;

		book.save()
		.then(book => {
			res.status(200).json(book);
		}).catch(next);
	}).catch(next);
	   
})

.delete(auth.verifyUser, (req, res, next) => {
	Book.findById(req.params.book_id)
	.then(book => {
		const err = auth.verifyOwnerOfBook(book.owner, req.user.profileId);
		if (err) 
			return next(err);
			book.remove()
			.then(reply => {
				res.json(reply);	
			})
	}).catch(next);
});	

router.route('/user/book')
.get(auth.verifyUser, (req, res, next) => {
	Book.find({owner: req.user.profileId})
	.populate('category')
    .then((books) => {
        res.status(200).json(books);
    }).catch(next);
})

module.exports = router;
