const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 60, // limit each IP to 100 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests, please try again later' });
      }
  });
  
  module.exports = limiter;