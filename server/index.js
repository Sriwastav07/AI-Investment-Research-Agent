require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ai-investment-research-agent-tau-one.vercel.app"
  ],
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));

// Set mock mode early
process.env.MOCK_MODE = 'true';

// MongoDB Connection Mock for environments without MongoDB
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mock') {
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => {
        console.log('Connected to MongoDB');
        process.env.MOCK_MODE = 'false';
    })
    .catch((err) => {
      console.error('MongoDB connection error, staying in mock mode:', err.message);
    });
} else {
  console.log('No MONGODB_URI provided, starting in mock mode');
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/research', require('./routes/research'));

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'AI Investment Research Agent API' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} (MOCK_MODE=${process.env.MOCK_MODE})`);
});

module.exports = app;
