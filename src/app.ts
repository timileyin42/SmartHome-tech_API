import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config';
import deviceRoutes from './routes/deviceRoutes';
import userRoutes from './routes/userRoutes'; // Import user routes for authentication
import automationRoutes from './routes/automationRoutes'; // Import automation routes
import cameraRoutes from './routes/cameraRoutes';
import tvRoutes from './routes/tvRoutes'; // Import TV routes
import authenticateJWT from './middleware/authMiddleware'; // Import JWT authentication middleware
import errorMiddleware from './middleware/errorMiddleware'; // Import error middleware

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
connectDB()
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

// Middleware to log request details
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`Request received: ${req.method} to ${req.url}`);
    next();
});

// Define API routes
app.use('/api/devices', authenticateJWT, deviceRoutes);  // Apply authentication to device routes
app.use('/api/users', userRoutes);  // Public routes for registration and login
app.use('/api/automation-rules', authenticateJWT, automationRoutes); // Add automation rules routes
app.use('/api/devices/camera', cameraRoutes);
app.use('/api/tv', authenticateJWT, tvRoutes); // Add TV routes

// Use error middleware (global error handler)
app.use(errorMiddleware);

// Start script
const PORT = process.env.PORT || 3000;
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

// Run the server
startServer();

