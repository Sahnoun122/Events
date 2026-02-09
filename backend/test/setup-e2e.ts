// E2E Test Setup
// Set environment variables to avoid database connections during E2E tests

process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-e2e-tests';

// Increase Jest timeout for async operations
jest.setTimeout(60000);