const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 100,
        required: true,
    },
    author: {
        type: String,
        maxlength: 50,
        required: true,
    },
    publication: {
        type: String,
        maxlength: 50,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        enum: ["New", "Old"],
        required: true,
    },
    deliveryArea: {
        type: String,
        enum: ["Near my area", "Within city", "All over Nepal"],
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
