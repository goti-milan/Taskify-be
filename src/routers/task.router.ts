import { Router } from 'express';
import {
  createTask,
  updateTask,
  deleteTask,
  fetchAllTasks,
  fetchTask,
  getTaskStatistics
} from '../controllers/task.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';
import {
  validateTaskCreation,
  validateTaskUpdate,
  validateTaskId,
  validateTaskFilters
} from '../validations/task.validation';

const router = Router();

// All task routes require authentication
router.use(authenticateToken);

// Task CRUD routes
router.get('/', validateTaskFilters, handleValidationErrors, fetchAllTasks);
router.get('/:id', validateTaskId, handleValidationErrors, fetchTask);
router.post('/', validateTaskCreation, handleValidationErrors, createTask);
router.put('/:id', validateTaskUpdate, handleValidationErrors, updateTask);
router.delete('/:id', validateTaskId, handleValidationErrors, deleteTask);

export default router;
