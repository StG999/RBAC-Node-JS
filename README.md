# Role-Based Access Control (RBAC) API

A simple Node.js project implementing authentication, authorization, and Role-Based Access Control (RBAC) with secure token-based mechanisms, caching, and middleware.

---
## 📽 Video Tutorial

https://github.com/user-attachments/assets/858cff3d-41c6-46ec-918b-0deb5f840610

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or above
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/StG999/RBAC-Node-JS.git
   cd RBAC-Node-JS
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run server
   ```

The server will start on `http://localhost:3000` (default port).

---

## 📋 API Endpoints

### **Authentication**

| Method | Endpoint         | Description          | Role/Access |
| ------ | ---------------- | -------------------- | ----------- |
| POST   | `/auth/register` | Register a new user  | Public      |
| POST   | `/auth/login`    | Login a user         | Public      |
| POST   | `/auth/logout`   | Logout a user        | User/Admin  |
| POST   | `/auth/refresh`  | Refresh access token | Public      |

### **Fruits**

| Method | Endpoint             | Description        | Role/Access |
| ------ | -------------------- | ------------------ | ----------- |
| GET    | `/api/fruits/view`   | View all fruits    | User/Admin  |
| POST   | `/api/fruits/create` | Create a new fruit | Admin Only  |

### **Heartbeat**

| Method | Endpoint     | Description         | Role/Access |
| ------ | ------------ | ------------------- | ----------- |
| GET    | `/heartbeat` | Check server status | Public      |

---

## 🔧 Middleware

### **Core Middleware**

1. **rateLimiter**: Limits requests per IP to 50 requests per minute.
2. **attachLogger**: Logs all incoming requests using Winston.
3. **authorize**: Authorizes access based on the user's role (e.g., `user` or `admin`).

---

## 🔐 Authentication and Tokens

### **Access Tokens**

- **TTL**: 15 minutes
- Used for accessing protected routes.
- Generated on login.

### **Refresh Tokens**

- **TTL**: 7 days
- Used to refresh access tokens without requiring login.
- Refresh tokens are **rotated** whenever an access token is refreshed, improving security.

---

## 🛠 Technologies Used

1. **Authentication**:

   - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For signing and verifying tokens.
   - [bcrypt](https://www.npmjs.com/package/bcrypt): For securely hashing passwords.

2. **Logging**:

   - [Winston](https://www.npmjs.com/package/winston): For request and error logging.

3. **Caching**:

   - [node-cache](https://www.npmjs.com/package/node-cache): For caching refresh tokens.

4. **Database**:
   - [Supabase](https://supabase.com/): Using a **Cloud PostgreSQL database** to store user data, roles, and other application-related information.

---

## 🛡 Security Features

- **Password Hashing**: User passwords are hashed using bcrypt before storage.
- **JWT Rotation**: Refresh tokens are rotated on every refresh to mitigate replay attacks.
- **Role-Based Access Control**: Routes are secured based on user roles (`user`, `admin`).

---

## 📈 Scalability Features

- **Token Caching**: Refresh tokens are cached to improve performance and scalability.
- **Rate Limiting**: Prevents abuse by limiting the number of requests per IP.
- **Extendable Middleware**: Easy to add new middleware as needed.
---

## tom| POST   | `/auth/refresh`  | Refresh access token | Public      |

### **Fruits**

| Method | Endpoint             | Description        | Role/Access |
| ------ | -------------------- | ------------------ | ----------- |
| GET    | `/api/fruits/view`   | View all fruits    | User/Admin  |
| POST   | `/api/fruits/create` | Create a new fruit | Admin Only  |

### **Heartbeat**

| Method | Endpoint     | Description         | Role/Access |
| ------ | ------------ | ------------------- | ----------- |
| GET    | `/heartbeat` | Check server status | Public      |

---

## 🔧 Middleware

### **Core Middleware**

1. **rateLimiter**: Limits requests per IP to 50 requests per minute.
2. **attachLogger**: Logs all incoming requests using Winston.
3. **authorize**: Authorizes access based on the user's role (e.g., `user` or `admin`).

---

## 🔐 Authentication and Tokens

### **Access Tokens**

- **TTL**: 15 minutes
- Used for accessing protected routes.
- Generated on login.

### **Refresh Tokens**

- **TTL**: 7 days
- Used to refresh access tokens without requiring login.
- Refresh tokens are **rotated** whenever an access token is refreshed, improving security.

---

## 🛠 Technologies Used

1. **Authentication**:

   - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): For signing and verifying tokens.
   - [bcrypt](https://www.npmjs.com/package/bcrypt): For securely hashing passwords.

2. **Logging**:

   - [Winston](https://www.npmjs.com/package/winston): For request and error logging.

3. **Caching**:

   - [node-cache](https://www.npmjs.com/package/node-cache): For caching refresh tokens.

4. **Database**:
   - [Supabase](https://supabase.com/): Using a **Cloud PostgreSQL database** to store user data, roles, and other application-related information.

---

## 🛡 Security Features

- **Password Hashing**: User passwords are hashed using bcrypt before storage.
- **JWT Rotation**: Refresh tokens are rotated on every refresh to mitigate replay attacks.
- **Role-Based Access Control**: Routes are secured based on user roles (`user`, `admin`).

---

## 📈 Scalability Features

- **Token Caching**: Refresh tokens are cached to improve performance and scalability.
- **Rate Limiting**: Prevents abuse by limiting the number of requests per IP.
- **Extendable Middleware**: Easy to add new middleware as needed.
---

## 🎯 Future Scope

- **Request Body Validation**: Restrict request bodies to conform to certain rules using libraries like express-validator.
- **Logout of All Devices**: Add single end-point to logout a particular user from all their devices. Can be done after tweaking the cache format a bit.
