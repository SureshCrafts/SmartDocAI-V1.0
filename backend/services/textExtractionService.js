// backend/services/textExtractionService.js
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const { PDFDocument } = require('pdf-lib');
const { fromPath } = require('pdf2pic');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorMiddleware');

class TextExtractionService {
    constructor() {
        this.supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/tiff', 'image/bmp'];
        this.supportedPdfTypes = ['application/pdf'];
        this.supportedDocTypes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
    }

    /**
     * Main extraction method that determines the best approach based on file type
     */
    async extractText(filePath, mimetype, options = {}) {
        const startTime = Date.now();
        logger.info('Starting text extraction:', { filePath, mimetype, options });

        try {
            let extractedText = '';

            if (this.supportedPdfTypes.includes(mimetype)) {
                extractedText = await this.extractFromPDF(filePath, options);
            } else if (this.supportedImageTypes.includes(mimetype)) {
                extractedText = await this.extractFromImage(filePath, options);
            } else if (this.supportedDocTypes.includes(mimetype)) {
                extractedText = await this.extractFromDocument(filePath, mimetype);
            } else if (mimetype === 'text/plain') {
                extractedText = await this.extractFromText(filePath);
            } else {
                throw new AppError('Unsupported file type for text extraction', 400);
            }

            const extractionTime = Date.now() - startTime;
            logger.info('Text extraction completed:', {
                filePath,
                textLength: extractedText.length,
                extractionTime: `${extractionTime}ms`
            });

            return this.postProcessText(extractedText);
        } catch (error) {
            logger.error('Text extraction failed:', { filePath, mimetype, error: error.message });
            throw error;
        }
    }

    /**
     * Enhanced PDF text extraction with multiple fallback methods
     */
    async extractFromPDF(filePath, options = {}) {
        const { useOCR = true, language = 'eng', dpi = 300 } = options;
        
        try {
            // Method 1: Direct text extraction
            const dataBuffer = fs.readFileSync(filePath);
            const pdfData = await pdf(dataBuffer);
            let extractedText = pdfData.text;

            // If direct extraction yields meaningful text, return it
            if (extractedText && extractedText.trim().length > 50) {
                logger.info('PDF direct text extraction successful');
                return extractedText;
            }

            // Method 2: OCR for scanned PDFs or image-based PDFs
            if (useOCR) {
                logger.info('Attempting OCR extraction for PDF');
                extractedText = await this.extractFromPDFWithOCR(filePath, language, dpi);
            }

            if (!extractedText || extractedText.trim().length < 10) {
                throw new AppError('Could not extract meaningful text from PDF. The document might be image-based, corrupted, or contain no readable text.', 400);
            }

            return extractedText;
        } catch (error) {
            logger.error('PDF extraction failed:', error);
            throw new AppError(`PDF text extraction failed: ${error.message}`, 500);
        }
    }

    /**
     * OCR-based PDF extraction by converting pages to images
     */
    async extractFromPDFWithOCR(filePath, language = 'eng', dpi = 300) {
        try {
            const options = {
                density: dpi,
                saveFilename: "page",
                savePath: path.dirname(filePath),
                format: "png",
                width: 2048,
                height: 2048
            };

            const convert = fromPath(filePath, options);
            const pages = await convert.bulk(-1); // Convert all pages

            let allText = '';
            
            for (let i = 0; i < pages.length; i++) {
                const pageImagePath = pages[i].path;
                try {
                    const pageText = await this.extractFromImage(pageImagePath, { language });
                    allText += `\n--- Page ${i + 1} ---\n${pageText}\n`;
                    
                    // Clean up temporary page image
                    fs.unlinkSync(pageImagePath);
                } catch (pageError) {
                    logger.warn(`Failed to extract text from page ${i + 1}:`, pageError.message);
                }
            }

            return allText;
        } catch (error) {
            logger.error('PDF OCR extraction failed:', error);
            throw error;
        }
    }

    /**
     * Enhanced image text extraction with preprocessing
     */
    async extractFromImage(filePath, options = {}) {
        const { language = 'eng', preprocess = true } = options;
        
        try {
            let processedImagePath = filePath;

            // Image preprocessing for better OCR results
            if (preprocess) {
                processedImagePath = await this.preprocessImage(filePath);
            }

            const ocrOptions = {
                logger: m => logger.debug('OCR progress:', m),
                lang: language,
                oem: 1, // Use LSTM OCR Engine
                psm: 3, // Fully automatic page segmentation
                dpi: 300
            };

            const { data: { text } } = await Tesseract.recognize(processedImagePath, language, ocrOptions);

            // Clean up processed image if it's different from original
            if (processedImagePath !== filePath && fs.existsSync(processedImagePath)) {
                fs.unlinkSync(processedImagePath);
            }

            return text;
        } catch (error) {
            logger.error('Image OCR extraction failed:', error);
            throw new AppError(`Image text extraction failed: ${error.message}`, 500);
        }
    }

    /**
     * Image preprocessing for better OCR accuracy
     */
    async preprocessImage(filePath) {
        try {
            const outputPath = filePath.replace(/\.[^/.]+$/, '_processed.png');
            
            await sharp(filePath)
                .resize(2048, 2048, { 
                    fit: 'inside',
                    withoutEnlargement: true 
                })
                .sharpen()
                .normalize()
                .threshold(128)
                .png()
                .toFile(outputPath);

            return outputPath;
        } catch (error) {
            logger.warn('Image preprocessing failed, using original:', error.message);
            return filePath;
        }
    }

    /**
     * Document extraction (DOCX, DOC)
     */
    async extractFromDocument(filePath, mimetype) {
        try {
            if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const docxBuffer = fs.readFileSync(filePath);
                const result = await mammoth.extractRawText({ arrayBuffer: docxBuffer });
                return result.value;
            } else if (mimetype === 'application/msword') {
                // For .doc files, we might need additional libraries
                // For now, return a helpful message
                throw new AppError('DOC file support requires additional processing. Please convert to DOCX or PDF.', 400);
            }
        } catch (error) {
            logger.error('Document extraction failed:', error);
            throw new AppError(`Document text extraction failed: ${error.message}`, 500);
        }
    }

    /**
     * Plain text extraction
     */
    async extractFromText(filePath) {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            logger.error('Text file extraction failed:', error);
            throw new AppError(`Text file extraction failed: ${error.message}`, 500);
        }
    }

    /**
     * Post-process extracted text for better quality
     */
    postProcessText(text) {
        if (!text) return '';

        return text
            .replace(/\r\n/g, '\n') // Normalize line endings
            .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    }

    /**
     * Get file information for processing decisions
     */
    async getFileInfo(filePath) {
        try {
            const stats = fs.statSync(filePath);
            const buffer = fs.readFileSync(filePath);
            
            return {
                size: stats.size,
                buffer: buffer,
                extension: path.extname(filePath).toLowerCase()
            };
        } catch (error) {
            logger.error('Failed to get file info:', error);
            throw error;
        }
    }

    /**
     * Validate if file can be processed
     */
    canProcessFile(mimetype, fileSize) {
        const maxSize = 10 * 1024 * 1024; // 10MB for enhanced processing
        
        if (fileSize > maxSize) {
            throw new AppError(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`, 400);
        }

        const supportedTypes = [
            ...this.supportedPdfTypes,
            ...this.supportedImageTypes,
            ...this.supportedDocTypes,
            'text/plain'
        ];

        if (!supportedTypes.includes(mimetype)) {
            throw new AppError('Unsupported file type', 400);
        }

        return true;
    }
}

module.exports = new TextExtractionService(); 