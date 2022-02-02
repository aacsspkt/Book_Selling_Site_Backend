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
		Book.create({ ...req.body, owner: req.user.profileId })
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
		Book.findByIdAndUpdate(req.params.book_id, { $set: req.body }, { new: true })
			.then(updatedBook => {
				res.status(200).send(updatedBook);
			}).catch(next);
	})
	.delete(auth.verifyUser, (req, res, next) => {
		Book.findByIdAndDelete(req.params.book_id)
			.then(book => {
				res.status(200).send(book);
			}).catch(next);
	});

router.route('/user/book')
	.get(auth.verifyUser, (req, res, next) => {
		Book.find({ owner: req.user.profileId })
			.populate('category')
			.then((books) => {
				res.status(200).json(books);
			}).catch(next);
	})

module.exports = router;
