import TaskModel, { TaskAttributes, TaskCreationAttributes, TaskStatus, TaskPriority } from '../models/task.model';
import { Op } from 'sequelize';

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface TaskQueryOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority';
  sortOrder?: 'ASC' | 'DESC';
}

export const createTask = async (taskData: TaskCreationAttributes): Promise<TaskAttributes> => {
  try {
    const task = await TaskModel.create(taskData);
    return task.toJSON() as TaskAttributes;
  } catch (error) {
    throw new Error('Failed to create task');
  }
};

export const getTaskById = async (taskId: string, userId: string): Promise<TaskAttributes> => {
  try {
    const task = await TaskModel.findOne({
      where: { id: taskId, createdBy: userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    return task.toJSON() as TaskAttributes;
  } catch (error) {
    throw new Error('Failed to fetch task');
  }
};

export const getAllTasks = async (
  userId: string,
  filters: TaskFilters = {},
  options: TaskQueryOptions = {}
): Promise<{ tasks: TaskAttributes[]; total: number; page: number; limit: number; totalPages: number }> => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = options;
    const offset = (page - 1) * limit;

    const whereClause: any = { createdBy: userId };

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.priority) {
      whereClause.priority = filters.priority;
    }

    if (filters.dueDateFrom || filters.dueDateTo) {
      whereClause.dueDate = {};
      if (filters.dueDateFrom) {
        whereClause.dueDate[Op.gte] = filters.dueDateFrom;
      }
      if (filters.dueDateTo) {
        whereClause.dueDate[Op.lte] = filters.dueDateTo;
      }
    }

    const { count, rows } = await TaskModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, sortOrder]],
    });

    const totalPages = Math.ceil(count / limit);

    return {
      tasks: rows.map(task => task.toJSON() as TaskAttributes),
      total: count,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
};

export const updateTask = async (
  taskId: string,
  userId: string,
  updateData: Partial<TaskCreationAttributes>
): Promise<TaskAttributes> => {
  try {
    const task = await TaskModel.findOne({
      where: { id: taskId, createdBy: userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    await task.update(updateData);
    return task.toJSON() as TaskAttributes;
  } catch (error) {
    throw new Error('Failed to update task');
  }
};

export const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  try {
    const task = await TaskModel.findOne({
      where: { id: taskId, createdBy: userId },
    });

    if (!task) {
      throw new Error('Task not found');
    }

    await task.destroy();
  } catch (error) {
    throw new Error('Failed to delete task');
  }
};

export const getTaskStats = async (userId: string): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}> => {
  try {
    const [total, pending, inProgress, completed] = await Promise.all([
      TaskModel.count({ where: { createdBy: userId } }),
      TaskModel.count({ where: { createdBy: userId, status: 'pending' } }),
      TaskModel.count({ where: { createdBy: userId, status: 'in_progress' } }),
      TaskModel.count({ where: { createdBy: userId, status: 'completed' } }),
    ]);

    return { total, pending, inProgress, completed };
  } catch (error) {
    throw new Error('Failed to fetch task statistics');
  }
};