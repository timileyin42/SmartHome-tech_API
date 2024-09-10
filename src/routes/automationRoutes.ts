import { Router } from 'express';
import {
  createAutomationRule,
  getAutomationRules,
  getAutomationRule,
  updateAutomationRule,
  deleteAutomationRule
} from '../controllers/automationController';
import {
  validateCreateAutomationRule,
  validateUpdateAutomationRule
} from '../middleware/validationMiddleware';

const router = Router();

// Route to create a new automation rule with validation
router.post('/', validateCreateAutomationRule, createAutomationRule); // POST /api/automation-rules

// Route to get all automation rules
router.get('/', getAutomationRules);    // GET /api/automation-rules

// Route to get a specific automation rule by ID
router.get('/:id', getAutomationRule); // GET /api/automation-rules/:id

// Route to update an automation rule by ID with validation
router.put('/:id', validateUpdateAutomationRule, updateAutomationRule); // PUT /api/automation-rules/:id

// Route to delete an automation rule by ID
router.delete('/:id', deleteAutomationRule); // DELETE /api/automation-rules/:id

export default router;

