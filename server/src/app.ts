import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import testRoutes from './routes/test';
import authRoutes from './routes/auth';
import discoverRoutes from './routes/discover';
import genreRoutes from './routes/genre';
import axios from 'axios';
import { requestLogger } from './middlewares/logger';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Backend (app.ts)
const allowedOrigins = [
	'https://6003cem.vercel.app',
	'http://localhost:5173',
];

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
}));

app.get('/', (_req, res) => {
	res.status(200).json({ message: 'Welcome to the API!' });
});

// Use routes
app.use('/test', testRoutes);
app.use('/auth', authRoutes);
app.use('/discover', discoverRoutes);
app.use('/genre', genreRoutes);

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