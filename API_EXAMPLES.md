# API Examples and Testing Guide

## Using cURL

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile (Protected)

```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Create an Item (Protected)

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop",
    "description": "High-performance laptop for developers",
    "price": 1299.99
  }'
```

### 5. Get All Items (Public)

```bash
curl -X GET http://localhost:3000/api/items
```

### 6. Update an Item (Protected)

```bash
curl -X PUT http://localhost:3000/api/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Laptop",
    "price": 1199.99
  }'
```

### 7. Delete an Item (Protected)

```bash
curl -X DELETE http://localhost:3000/api/items/ITEM_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Using Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: Create an environment variable `base_url` = `http://localhost:3000`
3. **Save Token**: After login/register, save the token in an environment variable
4. **Use Token**: In protected routes, add header: `Authorization: Bearer {{token}}`

## Using JavaScript (Fetch API)

### Register User

```javascript
const registerUser = async () => {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  console.log(data);
  
  // Save token for later use
  localStorage.setItem('token', data.data.token);
};
```

### Get Items with Authentication

```javascript
const getItems = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/items', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  console.log(data);
};
```

## Testing Workflow

1. **Start the server**: `npm run dev`
2. **Register a user**: Use the register endpoint
3. **Save the JWT token** from the response
4. **Use the token** in Authorization header for protected routes
5. **Test CRUD operations** on items

## Common Response Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not authorized to perform action)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error
