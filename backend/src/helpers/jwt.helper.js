const jwt = require('jsonwebtoken');

function generarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });
}

function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || 'secreto');
}

module.exports = { generarToken, verificarToken };
