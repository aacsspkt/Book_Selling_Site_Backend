
const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
	firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
	address: {
		streetAddress: {
			type: String,
			required: true
		},
		cityName: {
			type: String,
			required: true
		},
		areaLocation: {   
			type: mongoose.Schema.Types.ObjectId,
			ref: 'District',
			required: true
		}
	},
	contact: { 
		mobileNo: {
			type: String,
		},
		phoneNo: {
			type: String,
		},
		hidePhone: {
			type: Boolean,
			default: false
		}
	},
	profilePhoto: {
		type: String,
	},
	numberOfActiveAds: {
        type: Number,
        min: 0,
        default: 0
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref:'User'
	}
});

module.exports = mongoose.model('Profile', profileSchema);