const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const AppError = require('../lib/AppError');
const schemas = require('../schemas');

function gerarToken(usuario) {
  return jwt.sign({ email: usuario.email }, process.env.JWT_SECRET, {
    subject: String(usuario.id),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
}

function publico(usuario) {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

async function registrar(req, res) {
  const { nome, email, senha } = schemas.registro.parse(req.body);

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    throw new AppError('E-mail já cadastrado', 409);
  }

  const hash = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({ data: { nome, email, senha: hash } });

  res.status(201).json({ usuario: publico(usuario), token: gerarToken(usuario) });
}

async function entrar(req, res) {
  const { email, senha } = schemas.login.parse(req.body);

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const senhaCorreta = usuario ? await bcrypt.compare(senha, usuario.senha) : false;

  if (!usuario || !senhaCorreta) {
    throw new AppError('E-mail ou senha incorretos', 401);
  }

  res.json({ usuario: publico(usuario), token: gerarToken(usuario) });
}

async function perfil(req, res) {
  const usuario = await prisma.usuario.findUnique({ where: { id: req.usuarioId } });

  if (!usuario) {
    throw new AppError('Usuário não encontrado', 404);
  }

  res.json({ usuario: publico(usuario) });
}

module.exports = { registrar, entrar, perfil };
