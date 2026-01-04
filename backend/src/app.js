const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
})

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to VacayLanka API!' });
});

app.use((req, res) => {
  console.warn(`404 Error: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack || err.message);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
