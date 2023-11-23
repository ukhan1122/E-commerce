const jwt = require('jsonwebtoken');
const jwtSecret = require('../config/config.js').jwtSecret;


const isAdmin = (req, res, next) => {
  const token = req.header('Authorization');
   // Assuming you pass the token in the 'Authorization' header

  if (!token) {
    return res.status(404).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    
console.log('Decoded Token Payload:', decoded); // Verify the token using your secret key
    const { role } = decoded.user;


    if (role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied. Only admin users can access this resource.' });
    }

    // User is an admin, continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};


  
  module.exports = isAdmin;
  