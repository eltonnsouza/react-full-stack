const { supabase } = require('../utils/supabaseClient');

/** Lista todos os produtos */
const ProdutoService = {
    async getProdutos(){
        const {data, error} = await supabase
        .from('tb_produto')
        .select('*')
        
        if( error ) throw new Error(error.message);

        return data;
    },
}

/** busca um produto por id */

/** Inserir na tabela tb_produto */

/** Atualiza um produto */

/** Apaga um produto */

module.exports = { ProdutoService }