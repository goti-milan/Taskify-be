import { body, param, query } from 'express-validator';

export const validateTaskCreation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be one of: pending, in_progress, completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
];

export const validateTaskUpdate = [
  param('id')
    .isUUID()
    .withMessage('Task ID must be a valid UUID'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),

  body('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be one of: pending, in_progress, completed'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Due date cannot be in the past');
      }
      return true;
    }),
];

export const validateTaskId = [
  param('id')
    .isUUID()
    .withMessage('Task ID must be a valid UUID'),
];

export const validateTaskFilters = [
  query('status')
    .optional()
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be one of: pending, in_progress, completed'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be one of: low, medium, high'),

  query('dueDateFrom')
    .optional()
    .isISO8601()
    .withMessage('Due date from must be a valid ISO 8601 date'),

  query('dueDateTo')
    .optional()
    .isISO8601()
    .withMessage('Due date to must be a valid ISO 8601 date'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'dueDate', 'priority'])
    .withMessage('Sort by must be one of: createdAt, updatedAt, dueDate, priority'),

  query('sortOrder')
    .optional()
    .isIn(['ASC', 'DESC'])
    .withMessage('Sort order must be ASC or DESC'),
];