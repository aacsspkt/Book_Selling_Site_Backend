const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const validators = require('../utils/validators');

//.get Tests done!!
router.route('/')
.get((req, res, next) => {
	User.find({})
	.then(users => {
		res.status(200).json(users);
	}).catch(next);
});

router.route('/:user_id')
.get((req, res, next) => {
	User.findById(req.params.user_id)
	.populate('profile')
	.then(user => {
		res.status(200).json(user.profile);
	}).catch(next);
});

// Register:Test Done!!
// Login: Test Done !!(Jwt token in generated successfully!)
router.post('/register', (req, res, next) => {
	let { errors, isValid } = validators.RegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json({
            status: 'error',
            message: errors
        });
    }
    let {
        username,
        password,
		email,
		role, 
	} = req.body;
	
	User.findOne({username})
	.then(user => {
        if (user) {
            let err = new Error('User already exists!');
            err.status = 401;
            return next(err);
        } else {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) next(err);
                
                User.create({
                    username,
					password: hash,
					email,
					role,
                }).then(user => {
					res.status(201).json(`Registration of username: ${username} is done!`);
                }).catch(next);
            });
        }
    }).catch(next);
});

router.post('/login', (req, res, next) => {
    let {username, password} = req.body;
	User.findOne({username})
	.then(user => {
        if (!user) {
            let err = new Error('User not found!');
            err.status = 401;
            return next(err);
        }

		bcrypt.compare(password, user.password) // comparing pass from user input and from database.
		.then(isMatched => {
            if (!isMatched) {
                let err = new Error('Password does not match!');
                err.status = 404;
                return next(err);
            }
            let payload = {
                id: user.id,
                username: user.username,
				role: user.role,
			}
            jwt.sign(payload, process.env.SECRET, (err, token) => {
                if (err) {
                    return next(err);
                }
                res.json({status: 'Login Sucessful', token: `Bearer ${token}`})
            });

        }).catch(next);

	}).catch(next);
});


module.exports = router;
