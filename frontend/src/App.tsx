import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer,TableHead,
  useMediaQuery, useTheme, Typography, Dialog, DialogActions, DialogContent,
  DialogTitle, TextField, Snackbar, Alert } from '@mui/material';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';

// Tipo Cliente baseado na tabela tb_cliente.
type Cliente = {
  id?: number;
  nome: string;
  cnpj: string;
  segmento: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};

// Usar motion.create() em vez de motion()
const MotionTableRow = motion.create(TableRow);
const MotionIconButton = motion.create(IconButton);

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const iconButtonVariants: Variants = {
  rest: { scale: 1, opacity: 0.8 },
  hover: { scale: 1.2, opacity: 1, transition: { duration: 0.2 } },
  tap: { scale: 0.9 },
};

const dialogVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 200, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

// Começa aqui
function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState<Cliente[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [clienteEdicao, setClienteEdicao] = useState<Cliente | null>(null);
  const [erros, setErros] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // URL base da API
  const API_URL = 'http://localhost:3000/api/cliente';

  // Função para buscar clientes da API
  const fetchClientes = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log('Resposta da API:', response.data); // Log para depuração
      setRows(response.data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erro ao buscar clientes';
      console.error('Erro ao buscar clientes:', error); // Log para depuração
      setApiError(errorMsg);
    }
  };

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClientes();
  }, []);

  // Abrir o modal
  const handleOpenModal = (cliente: Cliente | null) => {
    setClienteEdicao(
      cliente || {
        nome: '',
        cnpj: '',
        segmento: '',
        cep: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
      }
    );
    setOpenModal(true);
    setErros({});
    setApiError(null);
  };

  // Fecha o modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setClienteEdicao(null);
    setErros({});
    setApiError(null);
  };

  // Valida os campos
  const validateCliente = (cliente: Cliente) => {
    const errors: { [key: string]: string } = {};
    if (!cliente.nome || cliente.nome.length < 3) errors.nome = 'Nome deve ter pelo menos 3 caracteres';
    if (!cliente.cnpj || !/^\d{14}$/.test(cliente.cnpj)) errors.cnpj = 'CNPJ deve ter 14 dígitos';
    if (!cliente.segmento || cliente.segmento.length < 2) errors.segmento = 'Segmento deve ter pelo menos 2 caracteres';
    if (!cliente.cep || !/^\d{8}$/.test(cliente.cep)) errors.cep = 'CEP deve ter 8 dígitos';
    if (!cliente.endereco || cliente.endereco.length < 3) errors.endereco = 'Endereço deve ter pelo menos 3 caracteres';
    if (!cliente.numero) errors.numero = 'Número é obrigatório';
    if (!cliente.bairro || cliente.bairro.length < 3) errors.bairro = 'Bairro deve ter pelo menos 3 caracteres';
    if (!cliente.cidade || cliente.cidade.length < 3) errors.cidade = 'Cidade deve ter pelo menos 3 caracteres';
    if (!cliente.estado || !/^[A-Z]{2}$/.test(cliente.estado)) errors.estado = 'Estado deve ter 2 letras maiúsculas';
    return errors;
  };

  // Função para salvar
  const handleSave = async () => {
    if (!clienteEdicao) return;

    const validationErrors = validateCliente(clienteEdicao);
    if (Object.keys(validationErrors).length > 0) {
      setErros(validationErrors);
      return;
    }

    try {
      if (clienteEdicao.id) {
        // Atualizar cliente
        const response = await axios.put(`${API_URL}/${clienteEdicao.id}`, clienteEdicao);
        setRows(rows.map((row) => (row.id === clienteEdicao.id ? response.data : row)));
      } else {
        // Criar cliente
        const response = await axios.post(API_URL, clienteEdicao);
        setRows([...rows, response.data]);
      }
      handleCloseModal();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erro ao salvar cliente';
      console.error('Erro ao salvar cliente:', error); // Log para depuração
      setApiError(errorMsg);
    }
  };

  // Função para apagar
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setRows(rows.filter((row) => row.id !== id));
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Erro ao excluir cliente';
      console.error('Erro ao excluir cliente:', error); // Log para depuração
      setApiError(errorMsg);
    }
  };

  // Alteração
  const handleChange = (field: keyof Cliente) => (event: React.ChangeEvent<HTMLInputElement>) => {
     if (!clienteEdicao) return;

  const value = event.target.value;

  if (field === 'cnpj') {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 14) return;

    setClienteEdicao({
      ...clienteEdicao,
      [field]: numericValue,
    });
  } else if (field === 'cep') {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length > 8) return;

    setClienteEdicao({
      ...clienteEdicao,
      [field]: numericValue,
    });
  } else {
    setClienteEdicao({
      ...clienteEdicao,
      [field]: value,
    });
  }
};

  // Mostr para o usuário
  return (
    <div className="md:px-20 md:mt-10">
      <Box p={2}>
        <Typography variant="h4" gutterBottom className="flex justify-between">
          Lista de Clientes
          <button
            className="w-10 h-10 hidden md:flex justify-center items-center cursor-pointer bg-green-500 text-white rounded-full p-2 animate-pulse"
            onClick={() => handleOpenModal(null)}
          >
            +
          </button>
          <button
            className="w-10 h-10 flex md:hidden justify-center items-center fixed bottom-16 right-6 cursor-pointer bg-green-500 text-white rounded-full p-2 z-10 animate-pulse"
            onClick={() => handleOpenModal(null)}
          >
            +
          </button>
        </Typography>

        <TableContainer component={Paper} className="h-[80svh] overflow-y-auto relative flex flex-col items-center">
          <div className="w-full flex-1">
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead className="bg-green-500 h-12">
                <TableRow>
                  <TableCell className="w-full"><strong>Nome</strong></TableCell>
                  <TableCell className="min-w-28" align="center"><strong>CNPJ</strong></TableCell>
                  <TableCell className="min-w-28" align="center"><strong>Segmento</strong></TableCell>
                  <TableCell className="min-w-28" align="center"><strong>Ações</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {rows.map((row, index) => (
                    <MotionTableRow
                      key={row.id}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="w-full"
                      variants={rowVariants}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TableCell component="th" scope="row">{row.nome}</TableCell>
                      <TableCell align="right" className="min-w-28">{row.cnpj}</TableCell>
                      <TableCell align="right" className="min-w-28">{row.segmento}</TableCell>
                      <TableCell align="right">
                        <MotionIconButton
                          variants={iconButtonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          color="primary"
                          aria-label="editar"
                          onClick={() => handleOpenModal(row)}
                        >
                          <ModeEditOutlinedIcon />
                        </MotionIconButton>
                        <MotionIconButton
                          variants={iconButtonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          color="error"
                          aria-label="excluir"
                          onClick={() => handleDelete(row.id!)}
                        >
                          <DeleteIcon />
                        </MotionIconButton>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
          <div className="bg-green-200 w-full h-12 rounded-b-md">
            <strong className="text-green-600 ml-3 flex justify-between items-center">
              <h3>Total de Clientes:</h3>
              <div className="h-10 w-10 mt-1 mr-2 text-white flex items-center bg-green-500 justify-center rounded-full animate-pulse">
                {rows.length}
              </div>
            </strong>
          </div>
        </TableContainer>

        <AnimatePresence>
          {openModal && (
            <motion.div initial="hidden" animate="visible" exit="exit" variants={dialogVariants}>
              <Dialog open={openModal} onClose={handleCloseModal} className="flex flex-col">
                <DialogTitle className="bg-green-500">{clienteEdicao?.id ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
                <DialogContent>
                  <Typography color="error" gutterBottom>
                    {apiError}
                  </Typography>
                  <TextField
                    label="Nome"
                    value={clienteEdicao?.nome || ''}
                    onChange={handleChange('nome')}
                    fullWidth
                    margin="normal"
                    error={!!erros.nome}
                    helperText={erros.nome}
                  />
                  <div className='flex-row md:flex-col gap-2'>
                    <TextField
                    label="CNPJ"
                    value={clienteEdicao?.cnpj || ''}
                    onChange={handleChange('cnpj')}
                    fullWidth
                    margin="normal"
                    error={!!erros.cnpj}
                    helperText={erros.cnpj}
                  />
                  <TextField
                    label="Segmento"
                    value={clienteEdicao?.segmento || ''}
                    onChange={handleChange('segmento')}
                    fullWidth
                    margin="normal"
                    error={!!erros.segmento}
                    helperText={erros.segmento}
                  />
                  </div>
                  <div className='flex gap-2'>
                    <TextField
                    label="CEP"
                    value={clienteEdicao?.cep || ''}
                    onChange={handleChange('cep')}
                    fullWidth
                    margin="normal"
                    error={!!erros.cep}
                    helperText={erros.cep}
                  />
                  <TextField
                    label="Endereço"
                    value={clienteEdicao?.endereco || ''}
                    onChange={handleChange('endereco')}
                    fullWidth
                    margin="normal"
                    error={!!erros.endereco}
                    helperText={erros.endereco}
                  />
                  </div>

                  <div className='flex md:flex-col gap-2'>
                    <TextField
                    label="Número"
                    value={clienteEdicao?.numero || ''}
                    onChange={handleChange('numero')}
                    fullWidth
                    margin="normal"
                    error={!!erros.numero}
                    helperText={erros.numero}
                  />
                  <TextField
                    label="Bairro"
                    value={clienteEdicao?.bairro || ''}
                    onChange={handleChange('bairro')}
                    fullWidth
                    margin="normal"
                    error={!!erros.bairro}
                    helperText={erros.bairro}
                  />
                  </div>
                  <div className='flex-row md:flex-col gap-2'>
                  <TextField
                    label="Cidade"
                    value={clienteEdicao?.cidade || ''}
                    onChange={handleChange('cidade')}
                    fullWidth
                    margin="normal"
                    error={!!erros.cidade}
                    helperText={erros.cidade}
                  />
                  <TextField
                    label="Estado (UF)"
                    value={clienteEdicao?.estado || ''}
                    onChange={handleChange('estado')}
                    fullWidth
                    margin="normal"
                    error={!!erros.estado}
                    helperText={erros.estado}
                  />
                  </div>
                </DialogContent>
                <DialogActions className="w-[93%] mx-auto mb-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-2 rounded-sm px-3 border-1 border-green-500 hover:bg-green-500 transition hover:text-white cursor-pointer"
                  >
                    {clienteEdicao?.id ? 'Salvar' : 'Adicionar'}
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 py-2 rounded-sm px-3 border-1 border-red-500 hover:bg-red-400 transition hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                </DialogActions>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>

        <Snackbar
          open={!!apiError}
          autoHideDuration={6000}
          onClose={() => setApiError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" onClose={() => setApiError(null)}>
            {apiError}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}

export default App;