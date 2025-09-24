const { supabase } = require('../utils/supabaseClient');

const ClientesService = {
  async getClientes() {
    const { data, error } = await supabase
      .from('tb_cliente')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  },

  async getClienteById(id) {
    const { data, error } = await supabase
      .from('tb_cliente')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async createCliente(cliente) {
    const { data, error } = await supabase
      .from('tb_cliente')
      .insert([{
        nome: cliente.nome,
        cnpj: cliente.cnpj,
        segmento: cliente.segmento,
        cep: cliente.cep,
        endereco: cliente.endereco,
        numero: cliente.numero,
        bairro: cliente.bairro,
        cidade: cliente.cidade,
        estado: cliente.estado
      }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateCliente(id, updates) {
    const { data, error } = await supabase
      .from('tb_cliente')
      .update({
        nome: updates.nome,
        cnpj: updates.cnpj,
        segmento: updates.segmento,
        cep: updates.cep,
        endereco: updates.endereco,
        numero: updates.numero,
        bairro: updates.bairro,
        cidade: updates.cidade,
        estado: updates.estado
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteCliente(id) {
    const { error } = await supabase
      .from('tb_cliente')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
  }
};

module.exports = { ClientesService };