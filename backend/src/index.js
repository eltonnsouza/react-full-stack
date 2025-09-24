const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const clienteRoutes = require('./routes/clienteRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para permitir requisições do frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Updated to match Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Rota de saúde para verificar se a API está funcionando
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Rotas da API
app.use('/api/cliente', clienteRoutes);

// Documentação da API com Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message.includes('tb_cliente_cnpj_key')) {
    return res.status(400).json({ error: 'CNPJ já cadastrado.' });
  }
  if (err.message.includes('tb_cliente_nome_key')) {
    return res.status(400).json({ error: 'Nome já cadastrado.' });
  }
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📚 Documentação da API em http://localhost:${port}/api-docs`);
  console.log(`🩺 Verifique a saúde da API em http://localhost:${port}/health`);
});