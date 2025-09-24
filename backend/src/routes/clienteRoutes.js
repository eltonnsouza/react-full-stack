// src/routes/clienteRoutes.js

const { Router } = require('express');
const { ClientesController } = require('../controllers/clienteController');

const router = Router();

// Rota para buscar todos os clientes
/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Retorna a lista de todos os clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       500:
 *         description: Erro no servidor.
 */
router.get('/', ClientesController.getClientes);

// Rota para buscar um cliente por ID
/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Retorna um cliente pelo seu ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.get('/:id', ClientesController.getClienteById);

// Rota para criar um novo cliente
/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       201:
 *         description: Cliente criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Dados do cliente inválidos.
 *       500:
 *         description: Erro no servidor.
 */
router.post('/', ClientesController.createCliente);

// Rota para atualizar um cliente
/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Atualiza um cliente existente
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteInput'
 *     responses:
 *       200:
 *         description: Cliente atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: ID ou dados do cliente inválidos.
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.put('/:id', ClientesController.updateCliente);

// Rota para deletar um cliente
/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Deleta um cliente pelo seu ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do cliente
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Cliente deletado com sucesso.
 *       400:
 *         description: ID inválido.
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.delete('/:id', ClientesController.deleteCliente);

module.exports = router;