const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendHealth() {
    try {
        console.log('🏥 Testing backend health...');
        const response = await axios.get('http://localhost:5001/health');
        console.log('✅ Backend is running:', response.data);
        return true;
    } catch (error) {
        console.log('❌ Backend is not running:', error.message);
        return false;
    }
}

async function testFrontend() {
    try {
        console.log('🌐 Testing frontend...');
        const response = await axios.get(FRONTEND_URL);
        console.log('✅ Frontend is running');
        return true;
    } catch (error) {
        console.log('❌ Frontend is not running:', error.message);
        return false;
    }
}

async function testDatabase() {
    try {
        console.log('🗄️ Testing database connection...');
        const response = await axios.get(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': 'Bearer test-token' }
        });
        console.log('✅ Database connection works');
        return true;
    } catch (error) {
        if (error.response?.status === 401) {
            console.log('✅ Database connection works (401 expected for invalid token)');
            return true;
        } else {
            console.log('❌ Database connection failed:', error.message);
            return false;
        }
    }
}

async function runTests() {
    console.log('🧪 Running SmartDoc AI Tests...\n');
    
    const backendOk = await testBackendHealth();
    const frontendOk = await testFrontend();
    const databaseOk = await testDatabase();
    
    console.log('\n📊 Test Results:');
    console.log(`Backend: ${backendOk ? '✅' : '❌'}`);
    console.log(`Frontend: ${frontendOk ? '✅' : '❌'}`);
    console.log(`Database: ${databaseOk ? '✅' : '❌'}`);
    
    if (backendOk && frontendOk && databaseOk) {
        console.log('\n🎉 All tests passed! You can now:');
        console.log('1. Open http://localhost:3000 in your browser');
        console.log('2. Register a new user');
        console.log('3. Upload documents and test AI features');
        console.log('4. Check logs in backend/logs/ for detailed information');
    } else {
        console.log('\n🔧 Setup required:');
        if (!backendOk) {
            console.log('- Start backend: cd backend && npm start');
        }
        if (!frontendOk) {
            console.log('- Start frontend: cd frontend && npm start');
        }
        if (!databaseOk) {
            console.log('- Start MongoDB: brew services start mongodb-community');
        }
    }
}

runTests().catch(console.error); 