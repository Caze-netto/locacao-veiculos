require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const veiculos = [
  { marca: 'Toyota', modelo: 'Corolla', ano: 2022, placa: 'ABC1D23', cor: 'Prata', valorDiaria: 220 },
  { marca: 'Honda', modelo: 'Civic', ano: 2021, placa: 'BCD2E34', cor: 'Preto', valorDiaria: 240 },
  { marca: 'Fiat', modelo: 'Mobi', ano: 2023, placa: 'CDE3F45', cor: 'Branco', valorDiaria: 110 },
  { marca: 'Volkswagen', modelo: 'T-Cross', ano: 2022, placa: 'DEF4G56', cor: 'Azul', valorDiaria: 260 },
  { marca: 'Chevrolet', modelo: 'Onix', ano: 2023, placa: 'EFG5H67', cor: 'Vermelho', valorDiaria: 130 },
];

async function main() {
  const senha = await bcrypt.hash('123456', 10);

  await prisma.usuario.upsert({
    where: { email: 'demo@locadora.com' },
    update: {},
    create: { nome: 'Usuário Demo', email: 'demo@locadora.com', senha },
  });

  for (const veiculo of veiculos) {
    await prisma.veiculo.upsert({
      where: { placa: veiculo.placa },
      update: {},
      create: veiculo,
    });
  }

  console.log('Seed concluído');
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
