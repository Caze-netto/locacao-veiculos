const prisma = require('../lib/prisma');
const AppError = require('../lib/AppError');
const schemas = require('../schemas');

const MS_POR_DIA = 24 * 60 * 60 * 1000;

const incluir = {
  veiculo: { select: { id: true, marca: true, modelo: true, placa: true, cor: true } },
};

function calcularDias(inicio, fim) {
  const dias = Math.ceil((fim.getTime() - inicio.getTime()) / MS_POR_DIA);
  return Math.max(1, dias);
}

function arredondar(valor) {
  return Math.round(valor * 100) / 100;
}

async function criar(req, res) {
  const { veiculoId, dataPrevistaDevolucao } = schemas.locacaoCriacao.parse(req.body);

  if (dataPrevistaDevolucao.getTime() <= Date.now()) {
    throw new AppError('A data prevista de devolução deve ser futura', 400);
  }

  const locacao = await prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({ where: { id: veiculoId } });
    if (!veiculo) {
      throw new AppError('Veículo não encontrado', 404);
    }

    const reservado = await tx.veiculo.updateMany({
      where: { id: veiculoId, status: 'DISPONIVEL' },
      data: { status: 'ALUGADO' },
    });

    if (reservado.count === 0) {
      throw new AppError('Veículo indisponível para locação', 409);
    }

    return tx.locacao.create({
      data: {
        usuarioId: req.usuarioId,
        veiculoId,
        dataPrevistaDevolucao,
        valorDiaria: veiculo.valorDiaria,
      },
      include: incluir,
    });
  });

  res.status(201).json(locacao);
}

async function listar(req, res) {
  const status = ['ATIVA', 'FINALIZADA'].includes(req.query.status) ? req.query.status : undefined;

  const locacoes = await prisma.locacao.findMany({
    where: { usuarioId: req.usuarioId, ...(status && { status }) },
    include: incluir,
    orderBy: { id: 'desc' },
  });

  res.json(locacoes);
}

async function buscar(req, res) {
  const { id } = schemas.idParam.parse(req.params);

  const locacao = await prisma.locacao.findFirst({
    where: { id, usuarioId: req.usuarioId },
    include: incluir,
  });

  if (!locacao) {
    throw new AppError('Locação não encontrada', 404);
  }

  res.json(locacao);
}

async function devolver(req, res) {
  const { id } = schemas.idParam.parse(req.params);

  const locacao = await prisma.$transaction(async (tx) => {
    const atual = await tx.locacao.findFirst({ where: { id, usuarioId: req.usuarioId } });
    if (!atual) {
      throw new AppError('Locação não encontrada', 404);
    }

    const agora = new Date();
    const dias = calcularDias(atual.dataRetirada, agora);
    const valorTotal = arredondar(Number(atual.valorDiaria) * dias);

    const finalizada = await tx.locacao.updateMany({
      where: { id, status: 'ATIVA' },
      data: { status: 'FINALIZADA', dataDevolucao: agora, valorTotal },
    });

    if (finalizada.count === 0) {
      throw new AppError('Locação já foi finalizada', 409);
    }

    await tx.veiculo.update({ where: { id: atual.veiculoId }, data: { status: 'DISPONIVEL' } });

    return tx.locacao.findUnique({ where: { id }, include: incluir });
  });

  res.json(locacao);
}

module.exports = { criar, listar, buscar, devolver };
