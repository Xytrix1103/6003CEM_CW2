import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
// Import routes
import testRoutes from './routes/test';
import axios from 'axios';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Add CORS middleware (before routes)
app.use(cors());

app.get('/', (_req, res) => {
	res.status(200).json({message: 'Welcome to the API!'});
});

// Use routes
app.use('/test', testRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

// Set up periodic request (every 10 minutes)
const TARGET_URL = 'https://six003cem-cw2-be.onrender.com';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

setInterval(async () => {
  try {
    console.log(`Pinging ${TARGET_URL} at ${new Date().toISOString()}`);
    const response = await axios.get(TARGET_URL);
    console.log(`Ping successful: ${response.status}`);
  } catch (error) {
    console.error('Error pinging server:', error);
  }
}, PING_INTERVAL);

export default app;