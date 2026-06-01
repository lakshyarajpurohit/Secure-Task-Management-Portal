const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment configurations securely
dotenv.config();

const app = express();

// Global Cross-Origin and Input Deserialization Utilities
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTIVITY LAYER ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/primetrade';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Production Database Engine Online via MongoDB Atlas Cloud Cluster!'))
  .catch(err => console.error('❌ Cloud Database Connection Refused:', err.message));

// --- DATA SCHEMA SCHEMATICS (MODELS) ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// FEATURE 1: AUTOMATIC HASHING GUARDRAIL (Cryptographic Password Security)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});
const User = mongoose.model('User', UserSchema);

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: 'No context summary details extended.' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String }
}, { timestamps: true });
const Task = mongoose.model('Task', TaskSchema);

// --- SECURE AUTHORIZATION FILTER MIDDLEWARE ---
const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: Missing or broken auth token header blueprint.' });
  }
  try {
    const token = authHeader.split(' ')[1];
    // Verify token legitimacy using our signature secret parameters
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'PRIMETRADE_SECRET_KEY_2026');
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Session validation token expired or mutated.' });
  }
};

// --- API ENDPOINT CORE PATHWAYS ---

// 1. AUTH: User Registration Pipeline
app.post('/api/v1/auth/register', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'All system authentication fields required.' });

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) return res.status(400).json({ message: 'This email coordinate has already been claimed.' });

    // Password will automatically hash behind the scenes via UserSchema pre-save hook
    await User.create({ email, password, role: role || 'user' });
    res.status(201).json({ message: 'User structural identity committed successfully!' });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
});

// 2. AUTH: Secure Session Key Login Generation
app.post('/api/v1/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Use bcrypt to safely check the encrypted password match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid authentication credentials matching map.' });
    }

    // Sign a cryptographically secure token using standard JWT structures
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'PRIMETRADE_SECRET_KEY_2026', { expiresIn: '24h' });
    res.json({ token, role: user.role, email: user.email });
  } catch (err) {
    next(err);
  }
});

// 3. CRUD: Create Task Entry
app.post('/api/v1/tasks', checkAuth, async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: 'Task operational header title required.' });

    const activeUser = await User.findById(req.user.id);
    const newTask = await Task.create({
      title,
      description,
      userId: req.user.id,
      userEmail: activeUser ? activeUser.email : 'Unknown Operator'
    });

    // Formatting output payload signature properties so our frontend matches seamlessly
    res.status(201).json({
      _id: newTask._id,
      title: newTask.title,
      description: newTask.description,
      user: { email: newTask.userEmail },
      userId: newTask.userId
    });
  } catch (err) {
    next(err);
  }
});

// 4. CRUD: Read Tasks (Enforcing RBAC Isolation Constraints)
app.get('/api/v1/tasks', checkAuth, async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      // System Administrators inherit global visibility overrides to track all workspace tasks
      const allTasks = await Task.find({});
      const formattedTasks = allTasks.map(t => ({ _id: t._id, title: t.title, description: t.description, user: { email: t.userEmail }, userId: t.userId }));
      return res.json(formattedTasks);
    } else {
      // Standard users are confined exclusively to their own data scopes
      const userTasks = await Task.find({ userId: req.user.id });
      const formattedTasks = userTasks.map(t => ({ _id: t._id, title: t.title, description: t.description, user: { email: t.userEmail }, userId: t.userId }));
      return res.json(formattedTasks);
    }
  } catch (err) {
    next(err);
  }
});

// 5. CRUD: Delete Task Instance (RBAC Restricted via Execution Guardrail Check)
app.delete('/api/v1/tasks/:id', checkAuth, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Action rejected: Admin system privileges required.' });
    }
    const targetTask = await Task.findByIdAndDelete(req.params.id);
    if (!targetTask) return res.status(404).json({ message: 'Target database entry instance missing.' });
    
    res.json({ message: 'Task entry permanently dropped from database arrays by Admin.' });
  } catch (err) {
    next(err);
  }
});

// FEATURE 2: GLOBAL CENTRALIZED ERROR HANDLING FUNNEL
app.use((err, req, res, next) => {
  console.error('💥 System Intercepted Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'An internal architectural transaction failed execution.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Production server cluster completely online on port ${PORT}`));