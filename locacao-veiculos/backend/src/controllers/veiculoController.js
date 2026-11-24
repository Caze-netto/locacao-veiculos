const prisma = require('../lib/prisma');
const AppError = require('../lib/AppError');
const schemas = require('../schemas');

function tratarPlacaDuplicada(erro) {
  if (erro.code === 'P2002') {
    throw new AppError('Placa já cadastrada', 409);
  }
  throw erro;
}

async function listar(req, res) {
  const { status, busca } = schemas.filtroVeiculos.parse(req.query);

  const where = {};
  if (status) {
    where.status = status;
  }
  if (busca) {
    where.OR = [
      { marca: { contains: busca } },
      { modelo: { contains: busca } },
      { placa: { contains: busca } },
    ];
  }

  const veiculos = await prisma.veiculo.findMany({ where, orderBy: { id: 'desc' } });
  res.json(veiculos);
}

async function buscar(req, res) {
  const { id } = schemas.idParam.parse(req.params);

  const veiculo = await prisma.veiculo.findUnique({ where: { id } });
  if (!veiculo) {
    throw new AppError('Veículo não encontrado', 404);
  }

  res.json(veiculo);
}

async function criar(req, res) {
  const dados = schemas.veiculoCriacao.parse(req.body);

  const veiculo = await prisma.veiculo.create({ data: dados }).catch(tratarPlacaDuplicada);
  res.status(201).json(veiculo);
}

async function atualizar(req, res) {
  const { id } = schemas.idParam.parse(req.params);
  const dados = schemas.veiculoAtualizacao.parse(req.body);

  const existente = await prisma.veiculo.findUnique({ where: { id } });
  if (!existente) {
    throw new AppError('Veículo não encontrado', 404);
  }

  const veiculo = await prisma.veiculo
    .update({ where: { id }, data: dados })
    .catch(tratarPlacaDuplicada);

  res.json(veiculo);
}

async function remover(req, res) {
  const { id } = schemas.idParam.parse(req.params);

  const existente = await prisma.veiculo.findUnique({
    where: { id },
    include: { _count: { select: { locacoes: true } } },
  });

  if (!existente) {
    throw new AppError('Veículo não encontrado', 404);
  }

  if (existente._count.locacoes > 0) {
    throw new AppError('Veículo possui locações registradas e não pode ser removido', 409);
  }

  await prisma.veiculo.delete({ where: { id } });
  res.status(204).send();
}

module.exports = { listar, buscar, criar, atualizar, remover };
