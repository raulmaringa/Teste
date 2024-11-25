import { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { CustomerDialog } from './CustomerDialog';
import { useCustomerStore } from '../../store/customerStore';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorMessage } from '../Common/ErrorMessage';
import { PageHeader } from '../Common/PageHeader';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { Customer } from '../../types';

export const CustomerList = () => {
  const { customers, loading, error, fetchCustomers, deleteCustomer } = useCustomerStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenDialog = (customer?: Customer) => {
    setSelectedCustomer(customer || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedCustomer(null);
    setOpenDialog(false);
  };

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      await deleteCustomer(customerToDelete);
      setConfirmDelete(false);
      setCustomerToDelete(null);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', flex: 1 },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      valueGetter: (params) => params.row.email || '-'
    },
    { 
      field: 'phone', 
      headerName: 'Telefone', 
      flex: 1,
      valueGetter: (params) => params.row.phone || '-'
    },
    { 
      field: 'address', 
      headerName: 'Endereço', 
      flex: 1.5,
      valueGetter: (params) => params.row.address || '-'
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      renderCell: (params: GridRenderCellParams<Customer>) => (
        <Box>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  if (loading && !customers.length) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box sx={{ height: '100%', width: '100%', p: 3 }}>
      <PageHeader
        title="Clientes"
        onAdd={() => handleOpenDialog()}
        addLabel="Novo Cliente"
      />
      
      <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', bgcolor: 'background.paper' }}>
        <DataGrid
          rows={customers}
          columns={columns}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Box>

      <CustomerDialog
        open={openDialog}
        onClose={handleCloseDialog}
        customer={selectedCustomer}
        onSave={fetchCustomers}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </Box>
  );
};
