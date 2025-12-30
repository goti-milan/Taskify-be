

import { Request, Response } from 'express';
import {
  createTask as createTaskService,
  getTaskById,
  getAllTasks,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
  getTaskStats,
  TaskFilters,
  TaskQueryOptions
} from '../services/task.service';
import { TaskCreationAttributes } from '../models/task.model';
import { successResponse, errorResponse } from '../utils/api-response';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      return;
    }

    const taskData: TaskCreationAttributes = {
      ...req.body,
      createdBy: userId,
    };

    const task = await createTaskService(taskData);
    successResponse(res, 201, 'Task created successfully', task);
  } catch (error: any) {
    const message = error?.message || 'Failed to create task';
    errorResponse(res, 400, 'REQUEST_ERROR', message);
  }
};

export const fetchTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      return;
    }

    const taskId = req.params.id;
    if (!taskId) {
      errorResponse(res, 400, 'INVALID_ID', 'Task ID is required');
      return;
    }

    const task = await getTaskById(taskId, userId);
    successResponse(res, 200, 'Task fetched successfully', task);
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch task';
    const statusCode = message.includes('not found') ? 404 : 500;
    errorResponse(res, statusCode, 'FETCH_ERROR', message);
  }
};

export const fetchAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      return;
    }

    const filters: TaskFilters = {};
    if (req.query.status) filters.status = req.query.status as any;
    if (req.query.priority) filters.priority = req.query.priority as any;
    if (req.query.dueDateFrom) filters.dueDateFrom = new Date(req.query.dueDateFrom as string);
    if (req.query.dueDateTo) filters.dueDateTo = new Date(req.query.dueDateTo as string);

    const options: TaskQueryOptions = {};
    if (req.query.page) options.page = parseInt(req.query.page as string);
    if (req.query.limit) options.limit = parseInt(req.query.limit as string);
    if (req.query.sortBy) options.sortBy = req.query.sortBy as any;
    if (req.query.sortOrder) options.sortOrder = req.query.sortOrder as any;

    const result = await getAllTasks(userId, filters, options);
    successResponse(res, 200, 'Tasks fetched successfully', result.tasks, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch tasks';
    errorResponse(res, 500, 'FETCH_ERROR', message);
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      return;
    }

    const taskId = req.params.id;
    if (!taskId) {
      errorResponse(res, 400, 'INVALID_ID', 'Task ID is required');
      return;
    }

    const updateData: Partial<TaskCreationAttributes> = req.body;
    const task = await updateTaskService(taskId, userId, updateData);
    successResponse(res, 200, 'Task updated successfully', task);
  } catch (error: any) {
    const message = error?.message || 'Failed to update task';
    const statusCode = message.includes('not found') ? 404 : 400;
    errorResponse(res, statusCode, 'UPDATE_ERROR', message);
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      return;
    }

    const taskId = req.params.id;
    if (!taskId) {
      errorResponse(res, 400, 'INVALID_ID', 'Task ID is required');
      return;
    }

    await deleteTaskService(taskId, userId);
    successResponse(res, 200, 'Task deleted successfully');
  } catch (error: any) {
    const message = error?.message || 'Failed to delete task';
    const statusCode = message.includes('not found') ? 404 : 500;
    errorResponse(res, statusCode, 'DELETE_ERROR', message);
  }
};

export const getTaskStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      errorResponse(res, 401, 'UNAUTHORIZED', 'User not authenticated');
      return;
    }

    const stats = await getTaskStats(userId);
    successResponse(res, 200, 'Task statistics fetched successfully', stats);
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch task statistics';
    errorResponse(res, 500, 'FETCH_ERROR', message);
  }
};