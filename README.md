# Secure Full-Stack Task Management Portal

A secure and scalable full-stack Task Management Portal built using the MERN stack. The application demonstrates industry-standard authentication, Role-Based Access Control (RBAC), RESTful API architecture, and cloud database integration using MongoDB Atlas.

---

## 🚀 Features

### Authentication & Security

- Secure user registration and login
- Password hashing using bcryptjs
- JWT-based authentication
- Protected API routes
- Environment-based secret management

### Role-Based Access Control (RBAC)

#### User

- Create tasks
- View only their own tasks
- Access resources assigned to them

#### Admin

- View all tasks
- Delete any task
- Full administrative visibility

### Task Management

- Create tasks
- View tasks
- Delete tasks (Admin only)
- User-specific task ownership

### Error Handling

- Centralized error handling middleware
- Consistent API responses
- Secure exception management
- Prevention of sensitive information leakage

---

## 🏗️ Tech Stack

### Frontend

- React.js
- Vite
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas

### Authentication

- JWT (JSON Web Token)
- bcryptjs

---

## 🏛️ System Architecture

### Frontend Layer

The frontend is built as a Single Page Application (SPA) using React. It manages authentication state, handles JWT tokens, and conditionally renders features based on user roles.

### Backend Layer

The backend is built using Node.js and Express.js following RESTful architecture principles. All APIs are versioned under `/api/v1`.

### Database Layer

MongoDB Atlas is used as the cloud database for storing users and tasks with secure and scalable document-based storage.

---

## 📁 Project Structure

```text
primetrade-assignment/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── primetrade_api_collection.json
└── README.md
```

---

## 🔐 Authentication Workflow

### User Registration

1. User submits registration details.
2. Password is hashed using bcryptjs.
3. User data is securely stored in MongoDB Atlas.

### User Login

1. User enters credentials.
2. Password hash is verified.
3. JWT token is generated.
4. Token is returned to the client.
5. Protected routes require a valid Bearer token.

---

## 👥 Role-Based Access Control

| Role | Permissions |
|--------|------------|
| User | Create tasks and view own tasks |
| Admin | View all tasks and delete tasks |

Authorization is enforced through middleware before protected operations are executed.

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/primetrade

```

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repository-name.git

cd primetrade-assignment
```

### 2. Backend Setup

```bash
cd backend

npm install

node server.js
```

Expected Output:

```bash
Database Connected Successfully
Server Running on Port 5000
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

npm install

npm run dev
```

Expected Output:

```bash
http://localhost:5173
```

---

## 📡 API Documentation

### Authentication Routes

#### Register User

```http
POST /api/v1/auth/register
```

**Access:** Public

#### Login User

```http
POST /api/v1/auth/login
```

**Access:** Public

---

### Task Routes

#### Create Task

```http
POST /api/v1/tasks
```

**Access:** Authenticated Users

#### Get Tasks

```http
GET /api/v1/tasks
```

**Access:** Authenticated Users

Behavior:

- Users can view only their own tasks.
- Admins can view all tasks.

#### Delete Task

```http
DELETE /api/v1/tasks/:id
```

**Access:** Admin Only

---

## 🧪 API Testing

A pre-configured API collection is included in the project:

```text
primetrade_api_collection.json
```

Import it into:

- Postman
- Thunder Client
- Insomnia

for quick endpoint testing.

---

## 🔒 Security Features

### Password Security

- Passwords are hashed using bcryptjs.
- Plain-text passwords are never stored.

### Authentication

- JWT-based authentication.
- Secure token validation middleware.
- Protected API endpoints.

### Authorization

- Middleware-driven RBAC implementation.
- Role validation before sensitive operations.

### Error Handling

- Centralized exception handling.
- Consistent API response format.
- Prevention of internal stack trace exposure.

---

## 📊 API Flow

```text
Client
   │
   ▼
Frontend (React)
   │
   ▼
JWT Authentication
   │
   ▼
Express Middleware
   │
   ▼
RBAC Authorization
   │
   ▼
REST API Controllers
   │
   ▼
MongoDB Atlas
```

---

## 📈 Future Enhancements

### Redis Caching

Implement Redis to reduce database lookups and improve response times.

### Message Queues

Integrate Kafka or RabbitMQ for asynchronous event processing.

### Dockerization

Containerize services using Docker for portability and deployment consistency.

### Load Balancing

Deploy behind Nginx to support horizontal scaling.

### CI/CD Pipeline

Automate testing and deployment using GitHub Actions.

---

## 🎯 Learning Outcomes

This project demonstrates:

- Full-Stack Development
- REST API Design
- JWT Authentication
- Role-Based Access Control (RBAC)
- MongoDB Atlas Integration
- Middleware Architecture
- Error Handling
- Secure Software Development

---

## 🏆 Key Highlights

- JWT Authentication
- Secure Password Hashing
- Role-Based Access Control
- Protected API Routes
- MongoDB Atlas Integration
- RESTful API Design
- React Frontend
- Express Backend
- Scalable Project Structure

---

## 📄 License

This project is developed for educational, learning, and portfolio purposes.

---

## 👨‍💻 Author

### Lakshya Rajpurohit

Bachelor of Engineering (Electronics & Communication Engineering)  
Thapar Institute of Engineering & Technology

#### Skills

- SQL
- Power BI
- Python
- Machine Learning
- Data Analytics
- Full-Stack Development

---

⭐ If you found this project useful, consider giving it a star on GitHub.