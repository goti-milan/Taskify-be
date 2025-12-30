import { Sequelize } from 'sequelize';
import { DATABASE_URL } from './index';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required for Neon DB');
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    connectTimeout: 20000,
    statement_timeout: 60000,
    idle_in_transaction_session_timeout: 300000,
  },

  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

/* ---------------------------------- */
/* Utils                              */
/* ---------------------------------- */

export const testConnection = async (): Promise<void> => {
  await sequelize.authenticate();
  console.log('Neon database connected');
};

export const syncDatabase = async (force = false): Promise<void> => {
  await sequelize.sync({ force });
  console.log('Database synced');
};

export const initializeDatabase = async (): Promise<void> => {
  await testConnection();
  await syncDatabase();
  console.log('Database initialized');
};

export default sequelize;
export { sequelize };
