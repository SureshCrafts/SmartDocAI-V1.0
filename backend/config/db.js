// backend/config/db.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smartdoc-ai-test';
        
        // Enhanced connection options for corporate environments
        const connectionOptions = {
            maxPoolSize: 10, // Maximum number of connections in the pool
            serverSelectionTimeoutMS: 30000, // Timeout for server selection
            socketTimeoutMS: 30000, // Timeout for socket operations
            connectTimeoutMS: 30000, // Timeout for initial connection
            retryWrites: true,
            w: 'majority',
            // Corporate network specific options
            ssl: process.env.MONGO_SSL === 'true',
            // sslValidate is deprecated in newer MongoDB versions
            sslCA: process.env.MONGO_SSL_CA,
            sslCert: process.env.MONGO_SSL_CERT,
            sslKey: process.env.MONGO_SSL_KEY,
            sslPass: process.env.MONGO_SSL_PASS,
            // Authentication options
            authSource: process.env.MONGO_AUTH_SOURCE || 'admin',
            // Replica set options
            replicaSet: process.env.MONGO_REPLICA_SET,
            readPreference: process.env.MONGO_READ_PREFERENCE || 'primary',
            // Connection pool options
            maxIdleTimeMS: 30000,
            minPoolSize: 2,
            // Write concern options
            writeConcern: {
                w: 'majority',
                j: true,
                wtimeout: 10000
            }
        };

        // Remove undefined options to avoid connection issues
        Object.keys(connectionOptions).forEach(key => {
            if (connectionOptions[key] === undefined) {
                delete connectionOptions[key];
            }
        });

        logger.info('Attempting to connect to MongoDB...', {
            uri: mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Hide credentials in logs
            options: connectionOptions
        });

        const conn = await mongoose.connect(mongoURI, connectionOptions);

        logger.info(`MongoDB Connected: ${conn.connection.host}`, {
            database: conn.connection.name,
            host: conn.connection.host,
            port: conn.connection.port
        });

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                logger.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        logger.error('MongoDB connection failed:', {
            error: error.message,
            code: error.code,
            name: error.name
        });

        // Provide helpful error messages for common issues
        if (error.code === 'ECONNREFUSED') {
            logger.error('MongoDB connection refused. Please check:');
            logger.error('1. MongoDB server is running');
            logger.error('2. Connection string is correct');
            logger.error('3. Firewall allows connections to MongoDB port');
        } else if (error.code === 'ENOTFOUND') {
            logger.error('MongoDB host not found. Please check:');
            logger.error('1. Hostname in connection string is correct');
            logger.error('2. DNS resolution is working');
            logger.error('3. Network connectivity to MongoDB host');
        } else if (error.code === 'ETIMEDOUT') {
            logger.error('MongoDB connection timeout. Please check:');
            logger.error('1. Network connectivity');
            logger.error('2. Firewall settings');
            logger.error('3. MongoDB server is accessible');
        } else if (error.name === 'MongoServerSelectionError') {
            logger.error('MongoDB server selection failed. Please check:');
            logger.error('1. MongoDB server is running and accessible');
            logger.error('2. Authentication credentials are correct');
            logger.error('3. Network connectivity and firewall rules');
        }

        // In development, exit the process
        if (process.env.NODE_ENV === 'development') {
            process.exit(1);
        }
        
        // In production, throw the error to be handled by the application
        throw error;
    }
};

module.exports = connectDB;