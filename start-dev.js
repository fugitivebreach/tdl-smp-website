// Development server startup script
require('dotenv').config();

// Set development environment
process.env.NODE_ENV = 'development';

// Start the main server
require('./server.js');
