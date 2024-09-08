// src/routes/userRoutes.ts

import { Router } from 'express';
import {
    registerUser,
    loginUser,
    validateRegister,
    validateLogin,
    handleValidationErrors
} from '../controllers/authController';
import {
    listUsers,
    getUser,
    updateUser,
    deleteUser
} from '../controllers/userController';
import authenticateJWT from '../middleware/authMiddleware'; // Import JWT authentication middleware

const router = Router();

// Authentication routes
router.post('/register', validateRegister, handleValidationErrors, registerUser);
router.post('/login', validateLogin, handleValidationErrors, loginUser);

// Protected user management routes
router.use(authenticateJWT); // Apply authentication middleware

// User management routes
router.get('/list', listUsers); // List all users
router.get('/:id', getUser); // Get a user by ID
router.put('/:id', updateUser); // Update a user by ID
router.delete('/:id', deleteUser); // Delete a user by ID

export default router;

