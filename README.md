# Backend API

A modern, production-ready Node.js/Express backend API with authentication, rate limiting, and MongoDB integration.

## Features

- ✅ RESTful API architecture
- ✅ JWT authentication
- ✅ MongoDB database integration
- ✅ Rate limiting and security headers
- ✅ Input validation
- ✅ Error handling middleware
- ✅ User management
- ✅ CRUD operations for items
- ✅ Password hashing with bcrypt
- ✅ Environment-based configuration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

## Project Structure

```
backend-api/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js   # Authentication logic
│   │   ├── user.controller.js   # User management
│   │   └── item.controller.js   # Item CRUD operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   └── rateLimiter.js       # Rate limiting configuration
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Item.js              # Item schema
│   ├── routes/
│   │   ├── index.js             # Main router
│   │   ├── auth.routes.js       # Auth routes
│   │   ├── user.routes.js       # User routes
│   │   └── item.routes.js       # Item routes
│   ├── utils/
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   └── ApiError.js          # Custom error class
│   └── server.js                # Application entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/backend-db
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
```

5. Make sure MongoDB is running (if using local MongoDB):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users (Protected)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID

### Items
- `GET /api/items` - Get all items (Public)
- `GET /api/items/:id` - Get item by ID (Public)
- `POST /api/items` - Create new item (Protected)
- `PUT /api/items/:id` - Update item (Protected)
- `DELETE /api/items/:id` - Delete item (Protected)

## API Usage Examples

### Register a new user
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create an item (requires authentication)
```bash
POST /api/items
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Sample Item",
  "description": "This is a sample item",
  "price": 29.99
}
```

### Get all items
```bash
GET /api/items
```

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevents abuse with configurable limits
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Express-validator for request validation
- **Error Handling**: Centralized error handling

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/backend-db |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Error Handling

The API uses a centralized error handling system with custom error classes. All errors return a consistent JSON format:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error message here"
}
```

## Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please open an issue in the repository.
