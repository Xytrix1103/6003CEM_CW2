import express from 'express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
// Import routes
import testRoutes from './routes/test';

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Add CORS middleware (before routes)
app.use(cors());

// Use routes
app.use('/test', testRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;