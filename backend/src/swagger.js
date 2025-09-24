const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'API de Clientes',
    description: 'Documentação da API CRUD para as tabelas de clientes com Node.js e Supabase.',
    version: '1.0.0'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Servidor local' }
  ],
  tags: [
    { name: 'Cliente', description: 'Endpoints para gerenciar clientes' }
  ],
  components: {
    schemas: {
      Cliente: {
        type: 'object',
        properties: {
          id: { type: 'integer', description: 'ID do cliente', example: 1 },
          created_at: { type: 'string', format: 'date-time', description: 'Data de criação', example: '2025-09-17T12:00:00Z' },
          nome: { type: 'string', description: 'Nome do cliente', example: 'Empresa XYZ' },
          cnpj: { type: 'string', description: 'CNPJ do cliente', example: '12345678000195' },
          segmento: { type: 'string', description: 'Segmento do cliente', example: 'Varejo' },
          cep: { type: 'string', description: 'CEP do cliente', example: '12345678' },
          endereco: { type: 'string', description: 'Endereço do cliente', example: 'Rua Principal' },
          numero: { type: 'string', description: 'Número do endereço', example: '100' },
          bairro: { type: 'string', description: 'Bairro do cliente', example: 'Centro' },
          cidade: { type: 'string', description: 'Cidade do cliente', example: 'São Paulo' },
          estado: { type: 'string', description: 'Estado do cliente (UF)', example: 'SP' }
        }
      },
      ClienteInput: {
        type: 'object',
        required: ['nome', 'cnpj', 'segmento', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado'],
        properties: {
          nome: { type: 'string', description: 'Nome do cliente', example: 'Empresa XYZ' },
          cnpj: { type: 'string', description: 'CNPJ do cliente', example: '12345678000195' },
          segmento: { type: 'string', description: 'Segmento do cliente', example: 'Varejo' },
          cep: { type: 'string', description: 'CEP do cliente', example: '12345678' },
          endereco: { type: 'string', description: 'Endereço do cliente', example: 'Rua Principal' },
          numero: { type: 'string', description: 'Número do endereço', example: '100' },
          bairro: { type: 'string', description: 'Bairro do cliente', example: 'Centro' },
          cidade: { type: 'string', description: 'Cidade do cliente', example: 'São Paulo' },
          estado: { type: 'string', description: 'Estado do cliente (UF)', example: 'SP' }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.js', './src/routes/*.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully!');
  require('./index.js');
});