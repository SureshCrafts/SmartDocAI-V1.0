// backend/routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { validateQuestion } = require('../middleware/validationMiddleware');
const {
    uploadDocument,
    getDocuments,
    getDocument,
    deleteDocument,
    askDocumentQuestion
} = require('../controllers/documentController');

router.route('/')
    .post(protect, uploadDocument)
    .get(protect, getDocuments);

router.route('/:id')
    .get(protect, getDocument)
    .delete(protect, deleteDocument);

router.post('/:id/ask', protect, validateQuestion, askDocumentQuestion);

module.exports = router;