const http = require('http');
const app = require('./src/app'); // your app.js

const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 8000;

// Create HTTP server
const server = http.createServer(app);




// Start server
async function startServer() {
  try {
 
    // Start listening
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1); // exit process if DB connection fails
  }
}

startServer();
