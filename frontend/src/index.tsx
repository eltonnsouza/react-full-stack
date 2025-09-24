import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import { motion, AnimatePresence, Variants } from 'framer-motion';

import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';

type Produto = {
  nome: string;
  valor: number;
};

function createData(nome: string, valor: number): Produto {
  return { nome, valor };
}

const initialRows: Produto[] = [
  createData('Calça Masculina 44', 159),
  createData('Calça Masculina 42', 159),
  createData('Calça Masculina 40', 159),
  createData('Calça Masculina 39', 159),
  createData('Calça Masculina 38', 159),
  createData('Calça Masculina 37', 159),
  createData('Calça Masculina 36', 159),
];

const MotionTableRow = motion(TableRow);
const MotionIconButton = motion(IconButton);

// Aqui corrigimos a tipagem para Variants
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
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

function App2() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [rows, setRows] = useState<Produto[]>(initialRows);
  const [openModal, setOpenModal] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [erroNome, setErroNome] = useState(false);
  const [erroValor, setErroValor] = useState(false);

  const handleOpenModal = (produto: Produto | null) => {
    setProdutoEdicao(produto);
    setOpenModal(true);
    setErroNome(false);
    setErroValor(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProdutoEdicao(null);
  };

  const handleSave = () => {
    if (!produtoEdicao?.nome || produtoEdicao.valor <= 0) {
      if (!produtoEdicao?.nome) setErroNome(true);
      if (produtoEdicao!.valor <= 0) setErroValor(true);
      return;
    }

    if (produtoEdicao) {
      const existingProduct = rows.find(p => p.nome === produtoEdicao.nome);
      if (existingProduct) {
        setRows(rows.map(p => (p.nome === produtoEdicao.nome ? produtoEdicao : p)));
      } else {
        setRows([...rows, produtoEdicao]);
      }
    }

    handleCloseModal();
  };

  const handleDelete = (nome: string) => {
    setRows(rows.filter(row => row.nome !== nome));
  };

  const handleChange = (field: keyof Produto) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (produtoEdicao) {
      setProdutoEdicao({
        ...produtoEdicao,
        [field]: field === 'valor' ? parseFloat(event.target.value) : event.target.value,
      });
    }
  };

  return (
    <div className='md:px-20 md:mt-10'>
      <Box p={2}>
        <Typography variant="h5" gutterBottom className='flex justify-between'>
          <h1 className='text-center mx-auto mt-0 md:mx-0'>Lista de Produtos</h1>
          {/* Botão de adicionar na versão desktop */}
          <button
            className='w-10 h-10 hidden md:flex justify-center items-center cursor-pointer bg-green-500
             text-white rounded-full p-2 animate-pulse'
            onClick={() => handleOpenModal(null)}
          >
            +
          </button>
          {/* Botão de adicionar na versão mobile */}
          <button
            className='w-10 h-10 flex md:hidden justify-center items-center fixed bottom-10 right-7 cursor-pointer 
            bg-green-500 text-white rounded-full p-2 z-10 animate-pulse'
            onClick={() => handleOpenModal(null)}
          >
            +
          </button>
        </Typography>

        <TableContainer component={Paper} className='h-[80svh] overflow-y-auto relative flex flex-col items-center'>
          <div className='w-full flex-1'>
            <Table size={isMobile ? 'small' : 'medium'}>
            <TableHead className='bg-green-500 h-12'>
              <TableRow>
                <TableCell className='w-full'><strong>Nome do Produto</strong></TableCell>
                <TableCell className='min-w-28' align="center" ><strong>Preço</strong></TableCell>
                <TableCell className='min-w-28' align="center"><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {rows.map((row, index) => (
                  <MotionTableRow
                    key={row.nome}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className='w-full'
                    variants={rowVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TableCell component="th" scope="row">
                      {row.nome}
                    </TableCell>
                    <TableCell align="right" className='min-w-28 '>R$ {row.valor.toFixed(2)}</TableCell>
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
                        onClick={() => handleDelete(row.nome)}
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
          <div className='bg-green-200 w-full h-12 rounded-b-md'>
            <strong className='text-green-600 ml-3 flex justify-between items-center'>
              <h3>Total de Produtos:</h3> <div className='h-10 w-10 mt-1 mr-2 text-white flex items-center bg-green-500 justify-center rounded-full animate-pulse'>
                {rows.length}</div>
              </strong>
          </div>
        </TableContainer>

        <AnimatePresence>
          {openModal && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dialogVariants}
            >
              <Dialog open={openModal} onClose={handleCloseModal} className='flex flex-col'>
                <DialogTitle className='bg-green-500'>{produtoEdicao ? 'Editar Produto' : 'Adicionar Produto'}</DialogTitle>
                <DialogContent>
                  <TextField
                    label="Nome"
                    value={produtoEdicao?.nome || ''}
                    onChange={handleChange('nome')}
                    fullWidth
                    margin="normal"
                    className='w-full'
                    error={erroNome}
                    helperText={erroNome ? 'Por favor, preencha o nome do produto' : ''}
                  />
                  <TextField
                    label="Preço"
                    type="number"
                    value={produtoEdicao?.valor || ''}
                    onChange={handleChange('valor')}
                    fullWidth
                    margin="normal"
                    error={erroValor}
                    helperText={erroValor ? 'Por favor, insira um valor válido' : ''}
                  />
                </DialogContent>
                <DialogActions className='w-[93%] mx-auto mb-3'>
                  <button onClick={handleSave} className='flex-1 py-2 rounded-sm px-3 border-1 border-green-500 hover:bg-green-500 transition hover:text-white cursor-pointer'>
                    {produtoEdicao ? 'Salvar' : 'Adicionar'}
                  </button>
                  <button onClick={handleCloseModal} className='flex-1 py-2 rounded-sm px-3 border-1 border-red-500 hover:bg-red-400 transition hover:text-white cursor-pointer'> Cancelar </button>
                </DialogActions>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </div>
  );
}

export default App2;