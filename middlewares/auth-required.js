const { authTokenSecret } = require("../config");
const jwt = require('jsonwebtoken');

const authRequired = async (req, res, next) => {
  if (!req.headers.auth) res.status(403).json({ 'message': 'Token not provided!' });
  if (req.headers.auth) {
    jwt.verify(req.headers.auth, authTokenSecret, (err, value) => {
      if (err) return res.status(500).json({ error: "Failed to authanticate!" })
      req.user = value.data;
      next()
    });
  }
}

module.exports = authRequired