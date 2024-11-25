import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface AttendanceFormData {
  customer_id: string;
  attendant_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
}

interface AttendanceDialogProps {
  open: boolean;
  onClose: () => void;
  attendance: {
    id: string;
    customer_id: string;
    attendant_id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
  } | null;
  onSave: () => void;
}

export const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  open,
  onClose,
  attendance,
  onSave,
}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [attendants, setAttendants] = useState<User[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    defaultValues: attendance || {
      customer_id: '',
      attendant_id: '',
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
    },
  });

  useEffect(() => {
    if (open) {
      reset(attendance || {
        customer_id: '',
        attendant_id: '',
        title: '',
        description: '',
        status: 'open',
        priority: 'medium',
      });
      fetchCustomers();
      fetchAttendants();
    }
  }, [open, attendance, reset]);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchAttendants = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .eq('role', 'attendant')
        .order('name');

      if (error) throw error;
      setAttendants(data || []);
    } catch (error) {
      console.error('Error fetching attendants:', error);
    }
  };

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      if (attendance?.id) {
        // Update
        const { error } = await supabase
          .from('attendances')
          .update(data)
          .eq('id', attendance.id);
        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase.from('attendances').insert([data]);
        if (error) throw error;
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving attendance:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {attendance ? 'Editar Atendimento' : 'Novo Atendimento'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.customer_id}>
                <InputLabel>Cliente</InputLabel>
                <Controller
                  name="customer_id"
                  control={control}
                  rules={{ required: 'Cliente é obrigatório' }}
                  render={({ field }) => (
                    <Select {...field} label="Cliente">
                      {customers.map((customer) => (
                        <MenuItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.attendant_id}>
                <InputLabel>Atendente</InputLabel>
                <Controller
                  name="attendant_id"
                  control={control}
                  rules={{ required: 'Atendente é obrigatório' }}
                  render={({ field }) => (
                    <Select {...field} label="Atendente">
                      {attendants.map((attendant) => (
                        <MenuItem key={attendant.id} value={attendant.id}>
                          {attendant.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Título é obrigatório' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Título"
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Descrição"
                    multiline
                    rows={3}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Status">
                      <MenuItem value="open">Aberto</MenuItem>
                      <MenuItem value="in_progress">Em Andamento</MenuItem>
                      <MenuItem value="resolved">Resolvido</MenuItem>
                      <MenuItem value="closed">Fechado</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Prioridade">
                      <MenuItem value="low">Baixa</MenuItem>
                      <MenuItem value="medium">Média</MenuItem>
                      <MenuItem value="high">Alta</MenuItem>
                      <MenuItem value="urgent">Urgente</MenuItem>
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
