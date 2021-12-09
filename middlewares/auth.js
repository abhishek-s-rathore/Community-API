let jwt = require('jsonwebtoken');

module.exports = {
  verifyToken: async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(400).json({ error: 'token required' });
    }

    try {
      let payload = await jwt.verify(token, 'thisissecret');
      req.user = payload;
      next();
    } catch (error) {
      next(error);
    }
  },
};
