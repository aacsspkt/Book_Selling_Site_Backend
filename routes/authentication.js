const jwt = require('jsonwebtoken');

// jwt verifyUser done testing on 30th June!
function verifyUser(req, res, next) {
	let authHeader = req.headers.authorization;
	console.log(authHeader);
    if (! authHeader) {
        let err = new Error('No authentication information!');
		err.status = 401;
		console.log("not verified user")
        return next(err);
    }

    let token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) {
            let err = new Error('Token could not be found!');
            err.status = 401;
            return next(err);
        } else { // verified!
			req.user = payload;
			console.log(req.user);
            next();
        }
    })
};

function verifyAdmin(req, res, next) {

    if (!req.user) {
        let err = new Error('No authentication information');
		err.status = 401;
        return next(err);
    }
    if (req.user.role !== 'admin') {
        let err = new Error('Forbidden');
        err.status = 403;
        return next(err);
	}
    next();
}

function verifyOwnerOfInquiry(inquiryAuthor, user_id) {
	console.log(inquiryAuthor  + " " + user_id);
	
    if (inquiryAuthor.toString() !== user_id) {
        let err = new Error('You are allowed to update/delete own inquiry only.');
        err.status = 401;
        return err;
    } 
	return;	
};

function verifyOwnerOfBook(owner, user_id) {
	
	if (owner.toString() !== user_id) {
        let err = new Error('You are allowed to update/delete own book only.');
        err.status = 401;
        return err;
    }
	return;
}

module.exports = {
    verifyUser, verifyAdmin, verifyOwnerOfBook, verifyOwnerOfInquiry
}
