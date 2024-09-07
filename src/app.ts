import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config';
import deviceRoutes from './routes/deviceRoutes';
import userRoutes from './routes/userRoutes'; // Import user routes for authentication
import authenticateJWT from './middleware/authMiddleware'; // Import JWT authentication middleware

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

// Middleware to log request details
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`Request received: ${req.method} to ${req.url}`);
    next();
});

// Define API routes
// Apply authentication middleware only to routes that need it
app.use('/api/devices', authenticateJWT, deviceRoutes);
app.use('/api/users', userRoutes); // Public routes for registration and login

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error occurred:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start script
const PORT = process.env.PORT || 3000;
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

// Run the server
startServer();

