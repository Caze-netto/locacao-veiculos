const { Router } = require('express');
const asyncHandler = require('../lib/asyncHandler');
const auth = require('../middlewares/auth');
const authController = require('../controllers/authController');
const veiculoController = require('../controllers/veiculoController');
const locacaoController = require('../controllers/locacaoController');

const routes = Router();

routes.get('/saude', (req, res) => res.json({ status: 'ok' }));

routes.post('/auth/registro', asyncHandler(authController.registrar));
routes.post('/auth/login', asyncHandler(authController.entrar));
routes.get('/auth/perfil', auth, asyncHandler(authController.perfil));

routes.get('/veiculos', auth, asyncHandler(veiculoController.listar));
routes.get('/veiculos/:id', auth, asyncHandler(veiculoController.buscar));
routes.post('/veiculos', auth, asyncHandler(veiculoController.criar));
routes.put('/veiculos/:id', auth, asyncHandler(veiculoController.atualizar));
routes.delete('/veiculos/:id', auth, asyncHandler(veiculoController.remover));

routes.post('/locacoes', auth, asyncHandler(locacaoController.criar));
routes.get('/locacoes', auth, asyncHandler(locacaoController.listar));
routes.get('/locacoes/:id', auth, asyncHandler(locacaoController.buscar));
routes.patch('/locacoes/:id/devolucao', auth, asyncHandler(locacaoController.devolver));

module.exports = routes;
