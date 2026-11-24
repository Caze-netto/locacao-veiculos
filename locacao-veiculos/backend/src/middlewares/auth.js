const jwt = require('jsonwebtoken');
const AppError = require('../lib/AppError');

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw new AppError('Token não informado', 401);
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = Number(payload.sub);
    next();
  } catch (erro) {
    throw new AppError('Token inválido ou expirado', 401);
  }
}

module.exports = auth;
