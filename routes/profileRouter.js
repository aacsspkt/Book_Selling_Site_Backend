const express = require('express');
const Profile = require('../models/Profile.js');
const router = express.Router();
const auth = require('./authentication');

router.route('/')
.get((req, res, next) => {
	Profile.find()
	.then(profiles => res.status(200).json(profiles));
})
.post(auth.verifyUser, (req, res, next) => {
	 const {
		firstName, lastName, address,
		contact, profilePhoto, 
	} = req.body;
	Profile.create({firstName, lastName, address, contact, profilePhoto, user: req.user.id})
	.then(profile => res.status(201).json(profile))
	.catch(next);
});

router.route('/:profile_id')
.get((req, res, next) => {
	Profile.findById(req.params.profile_id)
	.populate('address.areaLocation')
	.then(profile => res.status(200).json(profile))
	.catch(next);
})
.put((req, res, next) => {
	const profile = {
		firstName, lastName, address,
		contact, profilePhoto
		} = req.body;	

	Profile.findByIdAndUpdate(req.params.profile_id, {$set: profile}, {new: true})
	.then(updatedProfile => {
		res.status(200).send(updatedProfile);
	}).catch(next);
});

module.exports = router;
