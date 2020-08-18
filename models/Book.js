const mongoose = require('mongoose');
const User = require('./User');

const inquirySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    inquiry: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const bookSchema = new mongoose.Schema({
	title: {
        type: String,
        maxlength: 100,
        required: true,
    },
    author: {
        type: String,
        maxlength: 50,
        required: true
    },
    publication: {
        type: String,
        maxlength: 50,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        enum: ['New', 'Old']
    },
    deliveryArea: {
        type: String,
		enum: ['Near my area', 'Within city', 'All over Nepal'],
		required: true
    },
	cost: {
		type: Number,
		required: true
	},
    category: {  // reference: One to Squillion
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
	},
	inquiries: [ inquirySchema ], //Embedding: One to few
	owner: {
		type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
	}
},
{timestamps: true});

module.exports = mongoose.model('Book', bookSchema); 