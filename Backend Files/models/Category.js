const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    // Font Awesome icon class e.g. "fa-camera"
    icon: {
        type: String,
        default: 'fa-images'
    },
    // Count of media items in this category — denormalised for fast display
    mediaCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', categorySchema);