const { z } = require('zod');

const registro = z.object({
  nome: z.string().trim().min(2, 'Nome deve ter ao menos 2 caracteres').max(120),
  email: z.string().trim().toLowerCase().email('E-mail inválido').max(150),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres').max(72),
});

const login = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

const anoAtual = new Date().getFullYear();

const veiculoBase = z.object({
  marca: z.string().trim().min(1, 'Marca é obrigatória').max(60),
  modelo: z.string().trim().min(1, 'Modelo é obrigatório').max(80),
  ano: z.coerce.number().int().min(1950).max(anoAtual + 1),
  placa: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}-?[0-9][A-Z0-9][0-9]{2}$/, 'Placa inválida')
    .transform((valor) => valor.replace('-', '')),
  cor: z.string().trim().min(1, 'Cor é obrigatória').max(30),
  valorDiaria: z.coerce.number().positive('Valor da diária deve ser maior que zero').max(99999999),
});

const veiculoCriacao = veiculoBase;

const veiculoAtualizacao = veiculoBase.partial().refine((dados) => Object.keys(dados).length > 0, {
  message: 'Informe ao menos um campo para atualizar',
});

const filtroVeiculos = z.object({
  status: z.enum(['DISPONIVEL', 'ALUGADO']).optional(),
  busca: z.string().trim().optional(),
});

const locacaoCriacao = z.object({
  veiculoId: z.coerce.number().int().positive(),
  dataPrevistaDevolucao: z.coerce.date({ invalid_type_error: 'Data inválida' }),
});

const idParam = z.object({
  id: z.coerce.number().int().positive('Id inválido'),
});

module.exports = {
  registro,
  login,
  veiculoCriacao,
  veiculoAtualizacao,
  filtroVeiculos,
  locacaoCriacao,
  idParam,
};
