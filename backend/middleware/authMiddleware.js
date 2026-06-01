const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer')) {
    try {
      token = token.split(' ')[1];
      const decoded = jwt.verify(token, 'PRIMETRADE_SECRET_KEY_2026');
      req.user = decoded; // Attaches user identity and permissions to the request
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Session expired or invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Action rejected: Admin privileges required' });
    }
    next();
  };
};

module.exports = { protect, authorize };