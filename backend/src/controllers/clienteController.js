// src/controllers/clienteController.js

const { ClientesService } = require('../services/clienteService');

// Função de validação
const validateCliente = (cliente) => {
  if (
    !cliente ||
    !cliente.nome ||
    !cliente.cnpj ||
    !cliente.segmento ||
    !cliente.cep ||
    !cliente.endereco ||
    !cliente.numero ||
    !cliente.bairro ||
    !cliente.cidade ||
    !cliente.estado
  ) {
    return 'Todos os campos (nome, cnpj, segmento, cep, endereco, numero, bairro, cidade, estado) são obrigatórios.';
  }
  if (typeof cliente.nome !== 'string' || cliente.nome.length < 3) {
    return 'O nome do cliente deve ser uma string com pelo menos 3 caracteres.';
  }
  if (typeof cliente.cnpj !== 'string' || !/^\d{14}$/.test(cliente.cnpj)) {
    return 'O CNPJ deve ser uma string com 14 dígitos numéricos.';
  }
  if (typeof cliente.segmento !== 'string' || cliente.segmento.length < 2) {
    return 'O segmento deve ser uma string com pelo menos 2 caracteres.';
  }
  if (typeof cliente.cep !== 'string' || !/^\d{8}$/.test(cliente.cep)) {
    return 'O CEP deve ser uma string com 8 dígitos numéricos.';
  }
  if (typeof cliente.endereco !== 'string' || cliente.endereco.length < 3) {
    return 'O endereço deve ser uma string com pelo menos 3 caracteres.';
  }
  if (typeof cliente.numero !== 'string' || cliente.numero.length < 1) {
    return 'O número deve ser uma string não vazia.';
  }
  if (typeof cliente.bairro !== 'string' || cliente.bairro.length < 3) {
    return 'O bairro deve ser uma string com pelo menos 3 caracteres.';
  }
  if (typeof cliente.cidade !== 'string' || cliente.cidade.length < 3) {
    return 'A cidade deve ser uma string com pelo menos 3 caracteres.';
  }
  if (typeof cliente.estado !== 'string' || !/^[A-Z]{2}$/.test(cliente.estado)) {
    return 'O estado deve ser uma string com exatamente 2 letras maiúsculas (UF).';
  }
  return null;
};

const ClientesController = {
  async getClientes(req, res) {
    try {
      const clientes = await ClientesService.getClientes();
      res.status(200).json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getClienteById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'O ID do cliente deve ser um número válido.' });
      }

      const cliente = await ClientesService.getClienteById(id);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      res.status(200).json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createCliente(req, res) {
    try {
      const validationError = validateCliente(req.body);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const cliente = await ClientesService.createCliente(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      if (error.message.includes('tb_cliente_cnpj_key')) {
        return res.status(400).json({ error: 'CNPJ já cadastrado.' });
      }
      if (error.message.includes('tb_cliente_nome_key')) {
        return res.status(400).json({ error: 'Nome já cadastrado.' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async updateCliente(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'O ID do cliente deve ser um número válido.' });
      }

      const updates = req.body;
      const validationError = validateCliente(updates);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const cliente = await ClientesService.updateCliente(id, updates);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      res.status(200).json(cliente);
    } catch (error) {
      if (error.message.includes('tb_cliente_cnpj_key')) {
        return res.status(400).json({ error: 'CNPJ já cadastrado.' });
      }
      if (error.message.includes('tb_cliente_nome_key')) {
        return res.status(400).json({ error: 'Nome já cadastrado.' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async deleteCliente(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'O ID do cliente deve ser um número válido.' });
      }

      const cliente = await ClientesService.getClienteById(id);
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      await ClientesService.deleteCliente(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = { ClientesController };