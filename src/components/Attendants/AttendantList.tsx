import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { supabase } from '../../supabaseClient';
import AttendantDialog from './AttendantDialog';

interface Attendant {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export const AttendantList = () => {
  const [attendants, setAttendants] = useState<Attendant[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAttendant, setSelectedAttendant] = useState<Attendant | null>(null);

  const fetchAttendants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAttendants(data || []);
    } catch (error) {
      console.error('Error fetching attendants:', error);
      alert('Erro ao carregar atendentes. Por favor, recarregue a página.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este atendente?')) {
      return;
    }

    try {
      // First delete the user profile
      const { error: profileError } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;

      // Then delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      fetchAttendants();
    } catch (error) {
      console.error('Error deleting attendant:', error);
      alert('Erro ao excluir atendente. Por favor, tente novamente.');
    }
  };

  const handleEdit = (attendant: Attendant) => {
    setSelectedAttendant(attendant);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAttendant(null);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'role', headerName: 'Função', flex: 1 },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton
              onClick={() => handleEdit(params.row)}
              color="primary"
              size="small"
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchAttendants();
  }, []);

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Atendentes</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Novo Atendente
        </Button>
      </Box>

      <DataGrid
        rows={attendants}
        columns={columns}
        loading={loading}
        autoHeight
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />

      <AttendantDialog
        open={openDialog}
        onClose={handleCloseDialog}
        attendant={selectedAttendant}
        onSave={fetchAttendants}
      />
    </Paper>
  );
};

export default AttendantList;
