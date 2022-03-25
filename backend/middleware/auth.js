const jwt = require('jsonwebtoken');
const user = require('../models/user');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        req.token = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        
        
          next();
      
      } catch {
        res.status(401).json({
          error: new Error('Invalid request!')
        });
      }
    };