import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import { AttendanceDialog } from './AttendanceDialog';
import { AttendanceCommentsDialog } from './AttendanceCommentsDialog';

interface Attendance {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  customer_id: string;
  attendant_id: string;
  customer: {
    name: string;
  };
  attendant: {
    name: string;
  };
  created_at: string;
}

const statusColors: { [key: string]: string } = {
  open: 'error',
  in_progress: 'primary',
  resolved: 'success',
  closed: 'default',
};

const priorityColors: { [key: string]: string } = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  urgent: 'error',
};

export const AttendanceList: React.FC = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  const fetchAttendances = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendances')
        .select(`
          *,
          customer:customers!inner(name),
          attendant:users!inner(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = (data || []).map(item => ({
        ...item,
        customer: {
          name: item.customer.name
        },
        attendant: {
          name: item.attendant.name
        }
      }));
      
      setAttendances(formattedData);
    } catch (error) {
      console.error('Error fetching attendances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
  }, []);

  const handleOpenDialog = (attendance?: Attendance) => {
    setSelectedAttendance(attendance || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedAttendance(null);
    setOpenDialog(false);
  };

  const handleOpenComments = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setOpenCommentsDialog(true);
  };

  const handleCloseComments = () => {
    setSelectedAttendance(null);
    setOpenCommentsDialog(false);
  };

  const handleDeleteAttendance = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este atendimento?')) {
      try {
        const { error } = await supabase
          .from('attendances')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchAttendances();
      } catch (error) {
        console.error('Error deleting attendance:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'title', 
      headerName: 'Título', 
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.description}>
          <span>{params.value}</span>
        </Tooltip>
      ),
    },
    { 
      field: 'customer',
      headerName: 'Cliente',
      flex: 1,
      valueGetter: (params) => params.row.customer?.name,
    },
    { 
      field: 'attendant',
      headerName: 'Atendente',
      flex: 1,
      valueGetter: (params) => params.row.attendant?.name,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={statusColors[params.value] as any}
          size="small"
        />
      ),
    },
    {
      field: 'priority',
      headerName: 'Prioridade',
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={priorityColors[params.value] as any}
          size="small"
        />
      ),
    },
    {
      field: 'created_at',
      headerName: 'Criado em',
      width: 180,
      valueGetter: (params) => format(new Date(params.value), 'dd/MM/yyyy HH:mm'),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Comentários">
            <IconButton
              size="small"
              onClick={() => handleOpenComments(params.row)}
            >
              <CommentIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => handleOpenDialog(params.row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              onClick={() => handleDeleteAttendance(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Atendimentos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Atendimento
        </Button>
      </Box>
      
      <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
        <DataGrid
          rows={attendances}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Paper>

      <AttendanceDialog
        open={openDialog}
        onClose={handleCloseDialog}
        attendance={selectedAttendance}
        onSave={fetchAttendances}
      />

      {selectedAttendance && (
        <AttendanceCommentsDialog
          open={openCommentsDialog}
          onClose={handleCloseComments}
          attendanceId={selectedAttendance.id}
        />
      )}
    </Box>
  );
};
