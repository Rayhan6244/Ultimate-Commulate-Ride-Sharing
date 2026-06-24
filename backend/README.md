# Backend API Documentation

## `POST /users/register`

Register a new user.

### Description

This endpoint creates a new user account in the system. It validates the incoming payload, hashes the password, stores the user in the database, and returns a JSON response containing the created user and an authentication token.

### Request Headers

- `Content-Type: application/json`

### Request Body

```json
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}
```

### Field Requirements

- `fullname.firstname`: required, minimum 3 characters
- `fullname.lastname`: required, minimum 3 characters
- `email`: required, must be a valid email address
- `password`: required, minimum 6 characters

### Success Response

- Status: `201 Created`
- Body:

```json
{
  "user": {
    "_id": "string",
    "fullname": {
      "firstname": "string",
      "lastname": "string"
    },
    "email": "string",
    "socketId": "string | null"
  },
  "token": "string"
}
```

### Example Response

```json
{
  "user": {
    "_id": "650c9eaf2a5d9a0012345678",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Validation Error Response

- Status: `400 Bad Request`
- Body:

```json
{
  "errors": [
    {
      "msg": "string",
      "param": "string",
      "location": "body"
    }
  ]
}
```

### Notes

- The endpoint currently expects `fullname.firstname` and `fullname.lastname` to be provided.
- The password is hashed before storing in the database.
- The response includes a JWT token generated from `process.env.JWT_SECRET`.
