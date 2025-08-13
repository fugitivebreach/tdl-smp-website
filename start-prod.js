// Production server startup script
require('dotenv').config();

// Set production environment
process.env.NODE_ENV = 'production';

// Start the main server
require('./server.js');
