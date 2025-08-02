// frontend/src/services/documentService.js
import api from './api';
import { validateApiResponse, handleApiError } from './api';

// Get all documents for the user with pagination
const getDocuments = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`documents?page=${page}&limit=${limit}`);
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to fetch documents'));
  }
};

// Upload a new document
const uploadDocument = async (formData) => {
  try {
    const response = await api.post('documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // You can use this for progress indicators
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to upload document'));
  }
};

// Delete a document by ID
const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`documents/${documentId}`);
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to delete document'));
  }
};

// Ask a question about a document
const askQuestion = async (documentId, question) => {
  try {
    const response = await api.post(`documents/${documentId}/ask`, { question });
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to get answer from AI'));
  }
};

// Get a single document by ID
const getDocument = async (documentId) => {
  try {
    const response = await api.get(`documents/${documentId}`);
    return validateApiResponse(response);
  } catch (error) {
    throw new Error(handleApiError(error, 'Failed to fetch document'));
  }
};

const documentService = {
  getDocuments,
  uploadDocument,
  deleteDocument,
  askQuestion,
  getDocument,
};

export default documentService;