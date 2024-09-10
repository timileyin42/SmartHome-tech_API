// src/controllers/automationController.ts
import { Request, Response, NextFunction } from 'express';
import AutomationRule from '../models/AutomationRule'; // Adjust the import path as necessary

// Create an automation rule
export const createAutomationRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newRule = new AutomationRule(req.body);
    await newRule.save();
    res.status(201).json({ message: 'Automation rule created successfully', data: newRule });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Get all automation rules
export const getAutomationRules = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rules = await AutomationRule.find();
    res.status(200).json({ data: rules });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Get a single automation rule by ID
export const getAutomationRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await AutomationRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    res.status(200).json({ data: rule });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Update an automation rule by ID
export const updateAutomationRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await AutomationRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    res.status(200).json({ message: 'Automation rule updated successfully', data: rule });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

// Delete an automation rule by ID
export const deleteAutomationRule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rule = await AutomationRule.findByIdAndDelete(req.params.id);
    if (!rule) {
      return res.status(404).json({ message: 'Automation rule not found' });
    }
    res.status(200).json({ message: 'Automation rule deleted successfully' });
  } catch (error) {
    next(error); // Pass the error to the global error handler
  }
};

