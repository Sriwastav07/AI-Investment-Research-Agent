const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Check for token in header or query param (for SSE)
  const token = req.header('x-auth-token') || req.query['x-auth-token'];
  
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
