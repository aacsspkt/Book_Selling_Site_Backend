const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('./authentication');
const User = require('../models/User');

//-----------------------------Done Debug on June 24th after adding router book/book:id/inquiries/:inquiry_id ---------------------------

router.route('/')
.get((req, res, next) => {
	Book.find()
	.populate('category')
    .then((books) => {
        res.status(200).json(books);
    }).catch(next);
})
//done Debug
.post(auth.verifyUser, (req, res, next) => {
	console.log(req.body);
	Book.create({... req.body, owner: req.user.profileId})
    .then((book) => {
        res.status(201).json(book);
    }).catch(next);
});

//Done Debug
router.route('/:book_id')
.get((req, res, next) => {
	Book.findById(req.params.book_id)
	.populate('category')
	.populate('owner')
    .then(book => {
        res.status(200).json(book);
    }).catch(next);
})
//Done Debug
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
//Done Debug
.delete(auth.verifyUser, (req, res, next) => {
	Book.findById(req.params.book_id)
	.then(book => {
		const err = auth.verifyOwnerOfBook(book.owner, req.user.id);
		if (err) 
			return next(err);
			book.remove()
			.then(reply => {
				res.json(reply);	
			})
	}).catch(next);
});	
//Done Debug
router.route('/:book_id/inquiries')
.get(auth.verifyUser, (req, res, next) => {
    Book.findById(req.params.book_id)
    .then(book => {
        res.status(200).json(book.inquiries);
    }).catch(next);
})

//Done Debug
.post(auth.verifyUser, (req, res, next) => {
    Book.findById(req.params.book_id)
    .then(book => {
		const inquiry = req.body.inquiry;
         book.inquiries.push({inquiry, author: req.user.id});
         book.save()
         .then((book) => {
             res.status(201).json(book.inquiries);
         }).catch(next);   
    }).catch(next);
})

.delete(auth.verifyUser, (req, res, next) => {
    Book.findById(req.params.book_id)
    .then(book => {
        book.inquiries = [];
        book.save()
        .then(book => {
            res.status(200).json(book.inquiries);
        }).catch(next);
    }).catch(next);
})
//working
router.route("/:book_id/inquiries/:inquiry_id")
.get(auth.verifyUser, (req, res, next) => {
    Book.findById(req.params.book_id)
    .then(book =>  {
        const inquiry = book.inquiries.id(req.params.inquiry_id); 
        res.status(200).json(inquiry);
    })
})
//Done Debug
.put(auth.verifyUser, (req, res, next) => {
    Book.findById(req.params.book_id)
    .then(book => {
		let inq = book.inquiries.id(req.params.inquiry_id);

		const err = auth.verifyOwnerOfInquiry(inq.author, req.user.id);
		if (err) 
			return next(err);
		
		inq.inquiry = req.body.inquiry; //only allow changes to inquiry
		book.save().then((book) => {
			res.status(200).json(book.inquiries);
		}).catch(next);
    })
})
//Working
.delete(auth.verifyUser, (req, res, next) => {

    Book.findById(req.params.book_id)
    .then(book => {
		const err = auth.verifyOwnerOfInquiry(book.inquiries.id(req.params.inquiry_id).author, req.user.id);
		if (err) 
			return next(err);

        book.inquiries = book.inquiries.filter(inquiry => {
            return inquiry.id !== req.params.inquiry_id;
		})
        book.save()
        .then((updatedBook) => {
            res.status(200).json(updatedBook.inquiries);
        }).catch(next);
    }).catch(next);
})

//------Done Debug UPTO HERE---------



module.exports = router;
