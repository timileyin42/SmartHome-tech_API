import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';

// Validation middleware for user registration
export const validateRegister = [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').isLength({ min: 6 })
];

// Validation middleware for user login
export const validateLogin = [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').isLength({ min: 6 })
];

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const registerUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({ username, password });
        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.json({ token });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Register User Error:', error.message); // Log the error message
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            console.error('Register User Error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.json({ token });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Login User Error:', error.message); // Log the error message
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            console.error('Login User Error:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    }
};

