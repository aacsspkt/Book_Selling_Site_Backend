const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

//Storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
		console.log("storage: " + file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

//Filter
const imageFilter = (req, file, cb) => {
	console.log("imageFilter: " + file);
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        let err = new Error('Only image files are allowed!');
        err.status = 400;
        return cb(err, false);
	}
    cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 1024 * 1024
    }
})

router.route('/')
.post(upload.single('myFile'), (req, res, next) => {
    res.json({file: req.file});
});

// router.route('/:imgName')
// .get((req, res, next) => {
// 	const options = {
// 		root: './public/uploads',
// 		dotfiles: 'deny',
// 		headers: {
// 		  'x-timestamp': Date.now(),
// 		  'x-sent': true
// 		}
// 	  }
// 	  const fileName = req.params.imgName;

// 	  res.sendFile(fileName, options, function (err) {
// 		if (err) {
// 		  next(err)
// 		} else {
// 		  console.log('Sent:', fileName)
// 		}
// 	  });
// })

module.exports = router; 