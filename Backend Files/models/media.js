const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    // ── Core fields ──────────────────────────────────────────
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 2000
    },

    // ── Storage ───────────────────────────────────────────────
    // Full Azure Blob Storage URL  e.g. https://snapspherestore.blob.core.windows.net/uploads/xyz.jpg
    imagePath: {
        type: String,
        required: true
    },
    // Original filename the user uploaded
    originalFilename: {
        type: String
    },
    // MIME type e.g. image/jpeg
    mimeType: {
        type: String
    },
    // File size in bytes
    fileSize: {
        type: Number
    },
    // Image dimensions e.g. "1920 × 1080"
    resolution: {
        type: String
    },
    // Width and height as numbers for filtering/sorting
    imageWidth: {
        type: Number
    },
    imageHeight: {
        type: Number
    },

    // ── Location & context ───────────────────────────────────
    location: {
        type: String,
        trim: true
    },
    // Optional GPS coordinates
    coordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    // When the photo was actually taken (may differ from upload date)
    dateTaken: {
        type: Date
    },

    // ── Classification ───────────────────────────────────────
    category: {
        type: String,
        required: true,
        enum: ['Photography', 'Nature', 'Travel', 'Architecture', 'Wildlife', 'Street', 'Portrait', 'Abstract']
    },
    // Free-form tags e.g. ["sunset", "mountains", "Iceland"]
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    // Camera/device info
    cameraModel: {
        type: String,
        trim: true
    },
    // Basic EXIF-style settings
    focalLength: {
        type: String   // e.g. "50mm"
    },
    aperture: {
        type: String   // e.g. "f/2.8"
    },
    iso: {
        type: Number
    },
    shutterSpeed: {
        type: String   // e.g. "1/500s"
    },

    // ── Ownership ────────────────────────────────────────────
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },

    // ── Engagement ───────────────────────────────────────────
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },

    // ── Visibility ───────────────────────────────────────────
    // public = visible to all, private = only owner
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    featured: {
        type: Boolean,
        default: false
    }
});

// Text indexes for full-text search across key fields
mediaSchema.index({
    title: 'text',
    description: 'text',
    location: 'text',
    tags: 'text',
    cameraModel: 'text'
});

// Other indexes for common queries
mediaSchema.index({ userId: 1, uploadDate: -1 });
mediaSchema.index({ category: 1, uploadDate: -1 });
mediaSchema.index({ uploadDate: -1 });
mediaSchema.index({ likes: -1 });

// Auto-update lastModified on save
mediaSchema.pre('save', function (next) {
    this.lastModified = new Date();
    next();
});

module.exports = mongoose.model('Media', mediaSchema);