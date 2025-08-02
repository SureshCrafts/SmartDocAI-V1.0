// backend/controllers/documentController.js
const asyncHandler = require('express-async-handler');
const Document = require('../models/documentModel');
const User = require('../models/userModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const { queryChatModel } = require('../services/openaiService');
const { AppError } = require('../middleware/errorMiddleware');
const logger = require('../utils/logger');
const { validateFileUpload } = require('../middleware/validationMiddleware');
const textExtractionService = require('../services/textExtractionService');

// Configure Multer storage with better security
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate secure filename with timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path.extname(file.originalname);
        const filename = `doc-${timestamp}-${randomString}${extension}`;
        cb(null, filename);
    },
});

// Enhanced file filter with better validation
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
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

    const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.jpeg', '.jpg', '.png', '.tiff', '.bmp'];

    const fileExtension = path.extname(file.originalname).toLowerCase();
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype);
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (isValidMimeType && isValidExtension) {
        cb(null, true);
    } else {
        cb(new AppError('Invalid file type. Only PDF, DOCX, DOC, TXT, and image files (JPEG, PNG, TIFF, BMP) are allowed.', 400));
    }
};

const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB for enhanced processing
        files: 1
    },
    fileFilter: fileFilter
}).single('document');

// Enhanced AI summarization with better error handling
async function getSummaryFromAI(text) {
    try {
        // Check if OpenAI API key is properly configured
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-for-development') {
            return 'AI summarization is not available. Please configure a valid OpenAI API key.';
        }

        const messages = [
            { role: 'system', content: 'You are a helpful assistant that summarizes documents concisely and accurately.' },
            { role: 'user', content: `Please provide a concise summary of the following document content:\n\n${text}` }
        ];
        return await queryChatModel(messages, 'gpt-3.5-turbo', 200);
    } catch (error) {
        logger.error('AI summarization failed:', error);
        
        // Handle specific OpenAI API errors
        if (error.message.includes('API key') || error.message.includes('authentication')) {
            return 'AI summarization is not available. Please check your OpenAI API configuration.';
        }
        
        if (error.message.includes('rate limit') || error.message.includes('quota')) {
            return 'AI service is temporarily unavailable due to rate limits. Please try again later.';
        }
        
        return 'AI summarization failed. Please try again later.';
    }
}

// Enhanced text extraction using the new service
async function extractTextFromFile(filePath, mimetype, options = {}) {
    try {
        // Validate file can be processed
        const fileInfo = await textExtractionService.getFileInfo(filePath);
        textExtractionService.canProcessFile(mimetype, fileInfo.size);

        // Extract text using the enhanced service
        const extractedText = await textExtractionService.extractText(filePath, mimetype, options);
        
        if (!extractedText || extractedText.trim().length < 10) {
            logger.warn('Extracted text too short:', { length: extractedText?.length || 0 });
            throw new AppError('Could not extract meaningful text from the document. The file might be image-based, corrupted, or contain no readable text.', 400);
        }

        logger.info('Text extraction successful:', { 
            filePath,
            mimetype,
            textLength: extractedText.length
        });

        return extractedText;
    } catch (error) {
        logger.error('Text extraction failed:', { 
            error: error.message, 
            filePath, 
            mimetype 
        });
        
        if (error instanceof AppError) {
            throw error;
        }
        
        throw new AppError(`Failed to extract text from document: ${error.message}`, 500);
    }
}

// @desc    Upload a new document and process with AI
// @route   POST /api/documents
// @access  Private
const uploadDocument = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err instanceof AppError) {
                throw err;
            }
            throw new AppError(err.message || 'File upload failed', 400);
        }

        // Validate file upload
        validateFileUpload(req, res, async () => {
            const { originalname, filename, path: filePath, mimetype, size } = req.file;

            try {
                // Extract text from document
                let extractedText = '';
                let summary = '';
                
                try {
                    extractedText = await extractTextFromFile(filePath, mimetype);
                    
                    // Limit text for AI processing to avoid token limits
                    const textForAI = extractedText.substring(0, 4000);
                    
                    // Generate AI summary
                    if (textForAI.length > 50) {
                        summary = await getSummaryFromAI(textForAI);
                    } else {
                        summary = 'Document too short for meaningful summarization.';
                    }
                } catch (extractionError) {
                    logger.warn('Text extraction failed, saving document without text:', {
                        fileName: originalname,
                        error: extractionError.message
                    });
                    
                    // Still save the document but with a note about extraction failure
                    extractedText = '';
                    summary = 'Text extraction failed. This document may be image-based or contain no readable text.';
                }

                // Save document to database
                const document = await Document.create({
                    user: req.user.id,
                    fileName: originalname,
                    filePath: filePath,
                    fileType: mimetype,
                    fileSize: size,
                    extractedText: extractedText,
                    summary: summary,
                    processingStatus: extractedText ? 'completed' : 'failed',
                    processingError: extractedText ? null : 'Text extraction failed'
                });

                logger.info('Document uploaded successfully:', {
                    documentId: document._id,
                    fileName: originalname,
                    textLength: extractedText.length,
                    userId: req.user.id
                });

                res.status(201).json({
                    success: true,
                    data: {
                        _id: document._id,
                        fileName: document.fileName,
                        fileType: document.fileType,
                        fileSize: document.fileSize,
                        summary: document.summary,
                        createdAt: document.createdAt,
                        textExtracted: extractedText.length > 0
                    }
                });
            } catch (error) {
                // Clean up uploaded file if processing fails
                try {
                    fs.unlinkSync(filePath);
                    logger.info('Cleaned up uploaded file after processing failure:', filePath);
                } catch (cleanupError) {
                    logger.error('Failed to clean up uploaded file:', cleanupError);
                }

                logger.error('Document upload failed:', error);
                throw error;
            }
        });
    });
});

// @desc    Get all user documents with pagination
// @route   GET /api/documents
// @access  Private
const getDocuments = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const documents = await Document.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-extractedText'); // Don't send full text in list

    const total = await Document.countDocuments({ user: req.user.id });

    res.status(200).json({
        success: true,
        data: documents,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new AppError('Document not found', 404);
    }

    // Check ownership
    if (document.user.toString() !== req.user.id) {
        throw new AppError('Not authorized to view this document', 401);
    }

    res.status(200).json({
        success: true,
        data: document
    });
});

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        throw new AppError('Document not found', 404);
    }

    // Check ownership
    if (document.user.toString() !== req.user.id) {
        throw new AppError('Not authorized to delete this document', 401);
    }

    // Delete file from filesystem
    try {
        if (fs.existsSync(document.filePath)) {
            await fsPromises.unlink(document.filePath);
        }
    } catch (error) {
        logger.error('Failed to delete file from filesystem:', error);
        // Continue with database deletion even if file deletion fails
    }

    await Document.deleteOne({ _id: req.params.id });

    logger.info('Document deleted:', {
        documentId: req.params.id,
        userId: req.user.id
    });

    res.status(200).json({
        success: true,
        message: 'Document removed successfully'
    });
});

// Enhanced AI Q&A with better prompting
async function getAnswerFromAI(documentText, question) {
    try {
        // Check if OpenAI API key is properly configured
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-test-key-for-development') {
            return 'AI Q&A is not available. Please configure a valid OpenAI API key.';
        }

        const prompt = `Based ONLY on the following document text, answer the question. If the answer cannot be found in the text, respond with "I cannot find information about that in the document." Do not make up information or use external knowledge.

Document Text:
"""
${documentText}
"""

Question: ${question}

Answer:`;

        const messages = [
            { role: 'system', content: 'You are a helpful assistant that answers questions based strictly on provided document content.' },
            { role: 'user', content: prompt }
        ];
        
        return await queryChatModel(messages, 'gpt-3.5-turbo', 300);
    } catch (error) {
        logger.error('AI Q&A failed:', error);
        
        // Handle specific OpenAI API errors
        if (error.message.includes('API key') || error.message.includes('authentication')) {
            return 'AI Q&A is not available. Please check your OpenAI API configuration.';
        }
        
        if (error.message.includes('rate limit') || error.message.includes('quota')) {
            return 'AI service is temporarily unavailable due to rate limits. Please try again later.';
        }
        
        return 'AI Q&A failed. Please try again later.';
    }
}

// @desc    Ask a question about a document
// @route   POST /api/documents/:id/ask
// @access  Private
const askDocumentQuestion = asyncHandler(async (req, res) => {
    const documentId = req.params.id;
    const { question } = req.body;

    const document = await Document.findById(documentId);

    if (!document) {
        throw new AppError('Document not found', 404);
    }

    // Check ownership
    if (document.user.toString() !== req.user.id) {
        throw new AppError('Not authorized to ask questions about this document', 401);
    }

    if (!document.extractedText || document.extractedText.length < 50) {
        logger.warn('Q&A attempted on document with insufficient text:', {
            documentId,
            textLength: document.extractedText?.length || 0,
            processingStatus: document.processingStatus
        });
        
        throw new AppError(
            'This document does not contain enough text for Q&A. ' +
            (document.processingStatus === 'failed' 
                ? 'Text extraction failed during upload. The document may be image-based or contain no readable text.'
                : 'The document text is too short for meaningful Q&A.'),
            400
        );
    }

    const answer = await getAnswerFromAI(document.extractedText, question);

    logger.info('Q&A processed:', {
        documentId,
        question: question.substring(0, 100),
        userId: req.user.id
    });

    res.status(200).json({
        success: true,
        data: { answer }
    });
});

module.exports = {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    askDocumentQuestion
};