const fs = require('fs').promises;
const pdf = require('pdf-parse');
const Tesseract = require('tesseract.js');
const mammoth = require('mammoth');
const path = require('path');

// The minimum number of characters to consider a standard extraction successful.
// This prevents using costly OCR on documents that are just very short.
const MIN_TEXT_LENGTH_FOR_SUCCESSFUL_PARSE = 150;

/**
 * Extracts text from a PDF using a standard, fast parsing library.
 * @param {string} filePath - The path to the PDF file.
 * @returns {Promise<string>} The extracted text.
 */
async function extractTextFromStandardPdf(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('Error during standard PDF text extraction:', error);
    return ''; // Return empty string on error to allow fallback
  }
}

/**
 * Extracts text from an image-based document using OCR (Tesseract.js).
 * @param {string} filePath - The path to the PDF or image file.
 * @returns {Promise<string>} The extracted text.
 */
async function extractTextWithOcr(filePath) {
  try {
    console.log(`Performing OCR on ${filePath}. This may take a moment...`);
    const { data: { text } } = await Tesseract.recognize(
      filePath,
      'eng', // Language code (e.g., 'eng' for English)
      { logger: m => console.log(`[OCR Progress] ${m.status}: ${Math.round(m.progress * 100)}%`) }
    );
    console.log('OCR processing finished.');
    return text;
  } catch (error) {
    console.error('Error during OCR text extraction:', error);
    throw new Error('Failed to process document with OCR.');
  }
}

/**
 * Attempts to extract text from a document, handling different file types
 * and falling back to OCR for PDFs if needed.
 * @param {string} filePath - The path to the document file.
 * @returns {Promise<string>} The extracted text from the document.
 */
async function extractTextWithOcrFallback(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  let documentText = '';

  switch (extension) {
    case '.pdf':
      // Step 1: Try the fast, standard text extraction method first for PDFs.
      documentText = await extractTextFromStandardPdf(filePath);

      // Step 2: If not enough text was found, it's likely a scanned/image-based PDF.
      if (!documentText || documentText.trim().length < MIN_TEXT_LENGTH_FOR_SUCCESSFUL_PARSE) {
        const initialLength = documentText ? documentText.trim().length : 0;
        console.log(`Standard PDF parsing yielded only ${initialLength} characters. Falling back to OCR.`);
        documentText = await extractTextWithOcr(filePath);
        console.log(`OCR processing completed. Extracted ${documentText.trim().length} characters.`);
      } else {
        console.log(`Successfully extracted ${documentText.trim().length} characters using standard PDF parsing.`);
      }
      break;
    case '.docx':
      console.log(`Extracting text from DOCX file: ${filePath}`);
      const docxResult = await mammoth.extractRawText({ path: filePath });
      documentText = docxResult.value;
      break;
    case '.txt':
      console.log(`Reading text from TXT file: ${filePath}`);
      documentText = await fs.readFile(filePath, 'utf8');
      break;
    default:
      // Throw a clear error for unsupported types to provide better user feedback
      // and prevent long, failing operations on unsuitable files.
      throw new Error(`Unsupported file type: '${extension}'. Please upload a PDF, DOCX, or TXT file.`);
  }
  return documentText;
}

module.exports = { extractTextWithOcrFallback };