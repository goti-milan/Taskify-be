# Taskify Backend

A robust REST API for task management built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- User authentication with JWT tokens
- Task CRUD operations
- Task filtering and pagination
- Task statistics
- Input validation
- Rate limiting
- Security middleware (Helmet, CORS)
- PostgreSQL with Sequelize ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: express-validator
- **Security**: Helmet, CORS, bcrypt

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/goti-milan/Taskify-be.git
cd taskify-be
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your_refresh_token"
}
```

#### Get Current User
```http
GET /api/auth/
Authorization: Bearer your_access_token
```

### Tasks

All task endpoints require authentication (Bearer token).

#### Create Task
```http
POST /api/tasks/
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

#### Get All Tasks
```http
GET /api/tasks/?page=1&limit=10&status=pending&priority=high&sortBy=createdAt&sortOrder=DESC
Authorization: Bearer your_access_token
```

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer your_access_token
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer your_access_token
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer your_access_token
```

#### Get Task Statistics
```http
GET /api/tasks/stats
Authorization: Bearer your_access_token
```

## Data Models

### User
```typescript
{
  id: string; // UUID
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
```

### Task
```typescript
{
  id: string; // UUID
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdBy: string; // UUID reference to User
  createdAt: string;
  updatedAt: string;
}
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": { ... } // for paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": [
      {
        "field": "field_name",
        "message": "Field error message"
      }
    ]
  }
}
```

## Validation Rules

### User Registration
- Name: 2-100 characters, letters and spaces only
- Email: Valid email format
- Password: Minimum 8 characters, must contain uppercase, lowercase, and number

### Task Creation
- Title: 1-100 characters, required
- Description: 0-500 characters, optional
- Status: Must be 'pending', 'in_progress', or 'completed'
- Priority: Must be 'low', 'medium', or 'high'
- Due Date: Valid ISO date, cannot be in the past

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- SQL injection prevention via Sequelize

## Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run test-db` - Test database connection

### Project Structure

```
src/
├── config/          # Database and app configuration
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/         # Sequelize models
├── routers/        # Route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── validations/    # Input validation rules
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC