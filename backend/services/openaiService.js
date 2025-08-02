// backend/services/openaiService.js
const axios = require('axios');
const logger = require('../utils/logger');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

// Configuration
const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS) || 200;
const MAX_RETRIES = parseInt(process.env.OPENAI_MAX_RETRIES) || 3;
const RETRY_DELAY = parseInt(process.env.OPENAI_RETRY_DELAY) || 1000;

if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not set in environment variables.');
}

// Create axios instance with timeout
const openaiClient = axios.create({
    baseURL: 'https://api.openai.com/v1',
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
});

// Retry logic with exponential backoff
const retryWithBackoff = async (fn, retries = MAX_RETRIES) => {
    try {
        return await fn();
    } catch (error) {
        if (retries > 0 && (error.response?.status >= 500 || error.code === 'ECONNRESET')) {
            logger.warn(`OpenAI API call failed, retrying... (${retries} attempts left)`, {
                error: error.message,
                status: error.response?.status
            });
            
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return retryWithBackoff(fn, retries - 1);
        }
        throw error;
    }
};

/**
 * Generic function to query the OpenAI Chat Completions API with enhanced error handling
 * @param {Array<object>} messages - The array of message objects for the chat
 * @param {string} [modelId] - The model to use
 * @param {number} [max_tokens] - The maximum number of tokens to generate
 * @returns {Promise<string>} The content of the response message
 */
const queryChatModel = async (messages, modelId = DEFAULT_MODEL, max_tokens = DEFAULT_MAX_TOKENS) => {
    const requestData = {
        model: modelId,
        messages,
        max_tokens,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };

    try {
        const response = await retryWithBackoff(async () => {
            const result = await openaiClient.post('/chat/completions', requestData);
            return result;
        });

        const content = response.data.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error('No content received from OpenAI API');
        }

        logger.info('OpenAI API call successful', {
            model: modelId,
            tokensUsed: response.data.usage?.total_tokens,
            promptTokens: response.data.usage?.prompt_tokens,
            completionTokens: response.data.usage?.completion_tokens
        });

        return content.trim();
    } catch (error) {
        logger.error('OpenAI API call failed:', {
            error: error.message,
            status: error.response?.status,
            data: error.response?.data,
            model: modelId,
            maxTokens: max_tokens
        });

        // Handle specific OpenAI errors
        if (error.response?.data?.error) {
            const openaiError = error.response.data.error;
            
            switch (openaiError.type) {
                case 'invalid_request_error':
                    throw new Error(`Invalid request: ${openaiError.message}`);
                case 'rate_limit_error':
                    throw new Error('Rate limit exceeded. Please try again later.');
                case 'quota_exceeded':
                    throw new Error('API quota exceeded. Please check your OpenAI account.');
                case 'server_error':
                    throw new Error('OpenAI server error. Please try again later.');
                default:
                    throw new Error(`OpenAI API error: ${openaiError.message}`);
            }
        }

        // Handle network errors
        if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
            throw new Error('Connection to OpenAI API failed. Please try again.');
        }

        throw new Error(`OpenAI API call failed: ${error.message}`);
    }
};

/**
 * Generate a summary of the provided text
 * @param {string} text - The text to summarize
 * @param {number} [maxTokens] - Maximum tokens for the summary
 * @returns {Promise<string>} The generated summary
 */
const generateSummary = async (text, maxTokens = 200) => {
    const messages = [
        {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, accurate summaries of documents. Focus on the main points and key information.'
        },
        {
            role: 'user',
            content: `Please provide a clear and concise summary of the following text:\n\n${text}`
        }
    ];

    return await queryChatModel(messages, DEFAULT_MODEL, maxTokens);
};

/**
 * Answer a question based on the provided document text
 * @param {string} documentText - The document text to search in
 * @param {string} question - The question to answer
 * @param {number} [maxTokens] - Maximum tokens for the answer
 * @returns {Promise<string>} The generated answer
 */
const answerQuestion = async (documentText, question, maxTokens = 300) => {
    const messages = [
        {
            role: 'system',
            content: 'You are a helpful assistant that answers questions based strictly on the provided document content. If the information is not in the document, say "I cannot find information about that in the document." Do not make up information or use external knowledge.'
        },
        {
            role: 'user',
            content: `Based ONLY on the following document text, answer this question: "${question}"\n\nDocument text:\n${documentText}`
        }
    ];

    return await queryChatModel(messages, DEFAULT_MODEL, maxTokens);
};

/**
 * Extract key information from document text
 * @param {string} text - The text to analyze
 * @param {number} [maxTokens] - Maximum tokens for the extraction
 * @returns {Promise<string>} The extracted key information
 */
const extractKeyInfo = async (text, maxTokens = 150) => {
    const messages = [
        {
            role: 'system',
            content: 'You are a helpful assistant that extracts key information from documents. Identify the most important facts, dates, names, and concepts.'
        },
        {
            role: 'user',
            content: `Please extract the key information from this text:\n\n${text}`
        }
    ];

    return await queryChatModel(messages, DEFAULT_MODEL, maxTokens);
};

module.exports = {
    queryChatModel,
    generateSummary,
    answerQuestion,
    extractKeyInfo
};
