import { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCustomerStore } from '../../store/customerStore';
import { Customer } from '../../types';

type CustomerFormData = Omit<Customer, 'id' | 'created_at' | 'updated_at'>;

interface CustomerDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: () => void;
}

export const CustomerDialog = ({
  open,
  onClose,
  customer,
  onSave,
}: CustomerDialogProps) => {
  const { createCustomer, updateCustomer } = useCustomerStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    defaultValues: customer ? {
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    } : {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset(customer ? {
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
      } : {
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
  }, [open, customer, reset]);

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (customer?.id) {
        await updateCustomer(customer.id, data);
      } else {
        await createCustomer(data);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {customer ? 'Editar Cliente' : 'Novo Cliente'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                {...register('name', { required: 'Nome é obrigatório' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                {...register('phone')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                {...register('address')}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
