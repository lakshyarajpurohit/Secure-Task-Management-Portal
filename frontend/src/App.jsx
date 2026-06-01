import React, { useState, useEffect } from 'react';
import axios from 'axios';

// API base URL pointing to your backend server port
const API_URL = 'http://localhost:5000/api/v1';

export default function App() {
  // Authentication & Session States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || '');

  // Entity Data & Message States
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState({ text: '', isError: false });

  // Helper to flash API notifications on screen
  const showNotification = (text, isError = false) => {
    setStatusMessage({ text, isError });
    setTimeout(() => setStatusMessage({ text: '', isError: false }), 5000);
  };

  // 1. Core API: User Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) return showNotification('Please fill in all auth fields', true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { email, password, role });
      showNotification(res.data.message || 'Registration successful! Please login.', false);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Registration failed', true);
    }
  };

  // 2. Core API: User Login & Session Persistence
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return showNotification('Please fill in all auth fields', true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      // Save data to state and localStorage to preserve state on page reload
      setToken(res.data.token);
      setUserRole(res.data.role);
      setUserEmail(res.data.email);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('email', res.data.email);
      
      showNotification('Successfully authenticated!', false);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Invalid email or password', true);
    }
  };

  // 3. Session Destroyer (Logout)
  const handleLogout = () => {
    setToken('');
    setUserRole('');
    setUserEmail('');
    localStorage.clear();
    setTasks([]);
    showNotification('Session terminated safely.');
  };

  // 4. Core API: Read Tasks (Protected Router)
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      showNotification('Failed to sync data dashboard records', true);
    }
  };

  // 5. Core API: Create Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title) return showNotification('Task title is required', true);
    try {
      await axios.post(`${API_URL}/tasks`, { title, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
      setTitle('');
      setDescription('');
      showNotification('New task added successfully!');
    } catch (err) {
      showNotification('Failed to write new task mapping', true);
    }
  };

  // 6. Core API: Delete Task (RBAC Restricted to Admin)
  const handleDeleteTask = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
      showNotification(res.data.message || 'Task deleted successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Action rejected: Admin privilege required', true);
    }
  };

  // Lifecycle hook to pull database context if user session token exists
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', backgroundColor: '#1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      
      {/* Header Banner */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #334155', paddingBottom: '20px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#38bdf8' }}>PrimeTrade Analytics Portal</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>Secure Role-Based Control Panel</p>
        </div>
        {token && (
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Terminate Session
          </button>
        )}
      </header>

      {/* Global Toast Alert Notifications */}
      {statusMessage.text && (
        <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', backgroundColor: statusMessage.isError ? '#7f1d1d' : '#064e3b', borderLeft: `6px solid ${statusMessage.isError ? '#ef4444' : '#10b981'}`, color: '#f8fafc', fontWeight: '500' }}>
          {statusMessage.text}
        </div>
      )}

      {/* Conditional Layout Routing Block */}
      {!token ? (
        /* AUTH SECTION */
        <div style={{ backgroundColor: '#0f172a', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h2 style={{ marginTop: 0, fontSize: '18px', color: '#f1f5f9' }}>Secure Access Layer</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#94a3b8' }}>Email Address</label>
              <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '97%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#94a3b8' }}>Account Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '97%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#94a3b8' }}>System Access Role assignment</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white', cursor: 'pointer' }}>
                <option value="user">Standard User (Read/Write Own Data)</option>
                <option value="admin">System Administrator (Global View & Delete)</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button onClick={handleLogin} style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sign In</button>
              <button onClick={handleRegister} style={{ flex: 1, padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Create Account</button>
            </div>
          </form>
        </div>
      ) : (
        /* PROTECTED PROTECTED DASHBOARD ENGINE */
        <div>
          {/* Active Context Banner */}
          <div style={{ backgroundColor: '#0f172a', padding: '12px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #334155', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Authenticated User: <strong style={{ color: '#f1f5f9' }}>{userEmail}</strong></span>
            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '12px', backgroundColor: userRole === 'admin' ? '#7f1d1d' : '#1e3a8a', color: userRole === 'admin' ? '#fca5a5' : '#bfdbfe', fontWeight: 'bold', textTransform: 'uppercase' }}>{userRole}</span>
          </div>

          {/* Create Task Workspace */}
          <div style={{ backgroundColor: '#0f172a', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px', color: '#f1f5f9' }}>Deploy New Secondary Entity (Task Mapping)</h3>
            <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" placeholder="Task Reference Title" value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' }} />
              <input type="text" placeholder="Scope Specification Details (Description)" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#1e293b', color: 'white' }} />
              <button type="submit" style={{ padding: '10px', backgroundColor: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Commit Record to Database</button>
            </form>
          </div>

          {/* Task Render Stream */}
          <div>
            <h3 style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '12px' }}>Live Database Operations Canvas</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', border: '2px dashed #334155', borderRadius: '8px' }}>No instances populated inside current authorization pool bounds.</div>
              ) : (
                tasks.map(task => (
                  <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', color: '#f1f5f9', fontSize: '16px' }}>{task.title}</h4>
                      <p style={{ margin: '0 0 8px 0', color: '#94a3b8', fontSize: '14px' }}>{task.description || 'No context summary details extended.'}</p>
                      {task.user?.email && <span style={{ fontSize: '11px', color: '#38bdf8', backgroundColor: '#0c4a6e', padding: '2px 6px', borderRadius: '4px' }}>Data Owner: {task.user.email}</span>}
                    </div>
                    {userRole === 'admin' && (
                      <button onClick={() => handleDeleteTask(task._id)} style={{ padding: '6px 12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>Drop Record</button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}