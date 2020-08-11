
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
		areaLocation: {    //Value need to ne inserted before creation of User.
			type: mongoose.Schema.Types.ObjectId,
			ref: 'District',
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
			required: true
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
});

module.exports = mongoose.model('Profile', profileSchema);