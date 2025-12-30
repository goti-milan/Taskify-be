import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import UserModel from './user.model';

/* ---------- Types ---------- */

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface TaskAttributes {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: Date;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskCreationAttributes extends Optional<TaskAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: string;
  public title!: string;
  public description?: string;
  public status!: TaskStatus;
  public priority?: TaskPriority;
  public dueDate?: Date;
  public createdBy!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}


Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 100],
      },
    },

    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: [0, 500],
      },
    },

    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },

    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: true,
      defaultValue: 'medium',
    },

    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
    underscored: true,
  }
);

const TaskModel = Task;

/* ---------- Associations ---------- */

TaskModel.belongsTo(UserModel, { foreignKey: 'createdBy', as: 'creator' });
UserModel.hasMany(TaskModel, { foreignKey: 'createdBy', as: 'tasks' });

export default TaskModel;
