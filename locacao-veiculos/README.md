# Sistema de Locação de Veículos

Projeto da disciplina **Programação com Frameworks Web**.

Autor: Valdir Caze Silva Netto

Sistema web para cadastro de usuários e veículos, registro de locações e devoluções.

## Tecnologias

- Backend: Node.js, Express, JavaScript, Prisma ORM, MySQL, JWT (jsonwebtoken), bcryptjs e Zod
- Frontend: React 18, Vite, React Router e Axios

## Funcionalidades

- Cadastro e login de usuários com senha criptografada e autenticação por token JWT
- Cadastro, consulta (com busca por marca, modelo ou placa e filtro por status), edição e remoção de veículos
- Registro de locações com data prevista de devolução
- Registro de devoluções com cálculo automático do valor total (diárias × dias, mínimo de 1 dia)
- Controle de disponibilidade: um veículo alugado não pode ser alugado de novo até ser devolvido
- Cada usuário enxerga e devolve apenas as suas próprias locações

## Estrutura

```
locacao-veiculos/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── controllers/
│       ├── lib/
│       ├── middlewares/
│       ├── routes/
│       ├── schemas/
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```

## Como rodar

Pré-requisitos: Node.js 18 ou superior e MySQL 8 em execução.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edite o `.env` com o usuário e a senha do seu MySQL na variável `DATABASE_URL` e troque o `JWT_SECRET` por um valor seu.

Crie as tabelas e (opcionalmente) popule com dados de exemplo:

```bash
npx prisma migrate dev --name init
npm run seed
npm run dev
```

A API sobe em `http://localhost:3333`.

O seed cria 5 veículos e o usuário `demo@locadora.com` com senha `123456`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

O front sobe em `http://localhost:5173`.

## Rotas da API

Todas as rotas, exceto `/saude`, `/auth/registro` e `/auth/login`, exigem o header `Authorization: Bearer <token>`.

| Método | Rota                        | Descrição                              |
| ------ | --------------------------- | -------------------------------------- |
| GET    | `/saude`                    | Verifica se a API está no ar           |
| POST   | `/auth/registro`            | Cadastra usuário e retorna o token     |
| POST   | `/auth/login`               | Autentica e retorna o token            |
| GET    | `/auth/perfil`              | Dados do usuário logado                |
| GET    | `/veiculos`                 | Lista veículos (`?busca=` e `?status=`) |
| GET    | `/veiculos/:id`             | Consulta um veículo                    |
| POST   | `/veiculos`                 | Cadastra veículo                       |
| PUT    | `/veiculos/:id`             | Atualiza veículo                       |
| DELETE | `/veiculos/:id`             | Remove veículo sem locações            |
| POST   | `/locacoes`                 | Registra uma locação                   |
| GET    | `/locacoes`                 | Lista locações do usuário (`?status=`) |
| GET    | `/locacoes/:id`             | Consulta uma locação                   |
| PATCH  | `/locacoes/:id/devolucao`   | Registra a devolução e calcula o total |

### Exemplos de corpo

Registro:

```json
{ "nome": "Valdir", "email": "valdir@email.com", "senha": "123456" }
```

Veículo:

```json
{ "marca": "Toyota", "modelo": "Corolla", "ano": 2022, "placa": "ABC1D23", "cor": "Prata", "valorDiaria": 220 }
```

Locação:

```json
{ "veiculoId": 1, "dataPrevistaDevolucao": "2026-12-05T23:59:59.000Z" }
```

### Códigos de resposta

- `200` / `201` / `204`: sucesso
- `400`: dados inválidos
- `401`: token ausente, inválido ou credenciais incorretas
- `404`: recurso não encontrado
- `409`: conflito (e-mail ou placa já cadastrados, veículo indisponível, locação já finalizada)

## Modelo de dados

- **Usuario**: id, nome, email (único), senha (hash), criadoEm
- **Veiculo**: id, marca, modelo, ano, placa (única), cor, valorDiaria, status (`DISPONIVEL` ou `ALUGADO`)
- **Locacao**: id, usuarioId, veiculoId, dataRetirada, dataPrevistaDevolucao, dataDevolucao, valorDiaria, valorTotal, status (`ATIVA` ou `FINALIZADA`)

Relacionamentos: um usuário tem várias locações e um veículo tem várias locações.
