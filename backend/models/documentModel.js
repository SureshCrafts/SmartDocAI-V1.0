// backend/models/documentModel.js
const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true // Add index for faster queries
        },
        fileName: {
            type: String,
            required: [true, 'Please add a file name'],
            maxlength: [255, 'File name cannot exceed 255 characters']
        },
        filePath: {
            type: String,
            required: [true, 'Please add a file path'],
            maxlength: [500, 'File path cannot exceed 500 characters']
        },
        fileType: {
            type: String,
            required: [true, 'Please add a file type'],
            enum: {
                values: [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword',
                    'text/plain',
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/tiff',
                    'image/bmp'
                ],
                message: 'Invalid file type'
            }
        },
        fileSize: {
            type: Number,
            required: [true, 'Please add a file size'],
            min: [1, 'File size must be greater than 0'],
            max: [10485760, 'File size cannot exceed 10MB'] // 10MB in bytes
        },
        extractedText: {
            type: String,
            maxlength: [50000, 'Extracted text cannot exceed 50,000 characters']
        },
        summary: {
            type: String,
            maxlength: [2000, 'Summary cannot exceed 2,000 characters']
        },
        processingStatus: {
            type: String,
            enum: ['pending', 'processing', 'completed', 'failed'],
            default: 'pending'
        },
        processingError: {
            type: String,
            maxlength: [500, 'Error message cannot exceed 500 characters']
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Compound index for efficient user-based queries with sorting
documentSchema.index({ user: 1, createdAt: -1 });

// Index for file type queries
documentSchema.index({ fileType: 1 });

// Index for processing status queries
documentSchema.index({ processingStatus: 1 });

// Virtual for formatted file size
documentSchema.virtual('formattedFileSize').get(function() {
    const bytes = this.fileSize;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for file extension
documentSchema.virtual('fileExtension').get(function() {
    return this.fileName.split('.').pop().toLowerCase();
});

// Pre-save middleware to validate file size
documentSchema.pre('save', function(next) {
    if (this.fileSize > 10485760) { // 10MB
        next(new Error('File size exceeds maximum allowed size of 10MB'));
    } else {
        next();
    }
});

// Instance method to check if document is processable
documentSchema.methods.isProcessable = function() {
    const processableTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/tiff',
        'image/bmp'
    ];
    return processableTypes.includes(this.fileType);
};

// Static method to get user's document count
documentSchema.statics.getUserDocumentCount = function(userId) {
    return this.countDocuments({ user: userId });
};

// Static method to get user's total storage used
documentSchema.statics.getUserStorageUsed = function(userId) {
    return this.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
    ]);
};

module.exports = mongoose.model('Document', documentSchema);