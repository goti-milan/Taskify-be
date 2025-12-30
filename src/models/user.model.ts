import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

// Interface for User creation attributes
export interface UserCreationAttributes {
  id?: string;
  name: string;
  email: string;
  password: string;
}

// Interface for User instance
export interface UserInstance extends Model<UserCreationAttributes>, UserCreationAttributes {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}


class User extends Model<UserCreationAttributes> implements UserCreationAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    sequelize,
  }
);

const UserModel = User;

export default UserModel;