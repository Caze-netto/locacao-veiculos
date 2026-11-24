const { ZodError } = require('zod');
const AppError = require('../lib/AppError');

function naoEncontrado(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' });
}

function errorHandler(erro, req, res, next) {
  if (erro instanceof ZodError) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: erro.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      })),
    });
  }

  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }

  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON malformado' });
  }

  console.error(erro);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = { naoEncontrado, errorHandler };
