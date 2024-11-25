import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../../supabaseClient';

interface AttendantDialogProps {
  open: boolean;
  onClose: () => void;
  attendant: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
  onSave: () => void;
}

interface FormData {
  name: string;
  email: string;
  role: string;
  password?: string;
}

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'attendant', label: 'Atendente' },
];

export const AttendantDialog: React.FC<AttendantDialogProps> = ({
  open,
  onClose,
  attendant,
  onSave,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: attendant?.name || '',
      email: attendant?.email || '',
      role: attendant?.role || 'attendant',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      if (attendant) {
        // Update existing attendant
        const updateData: Partial<FormData> = {
          name: data.name,
          role: data.role,
        };

        if (data.password) {
          // If password is provided, update it
          const { error: authError } = await supabase.auth.updateUser({
            password: data.password,
          });

          if (authError) throw authError;
        }

        const { error } = await supabase
          .from('users')
          .update(updateData)
          .eq('id', attendant.id);

        if (error) throw error;
      } else {
        // Check if user already exists
        const { data: existingUsers, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('email', data.email)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (existingUsers) {
          alert('Um usuário com este email já existe.');
          return;
        }

        // Create new attendant
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password || '',
          options: {
            data: {
              name: data.name,
              role: data.role,
            },
          },
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            alert('Este email já está registrado. Por favor, use outro email.');
            return;
          }
          throw signUpError;
        }

        if (authData.user) {
          const { error: profileError } = await supabase.from('users').insert([
            {
              id: authData.user.id,
              email: data.email,
              name: data.name,
              role: data.role,
            },
          ]);

          if (profileError) {
            // If profile creation fails, delete the auth user
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw profileError;
          }
        }
      }

      onSave();
      onClose();
      reset();
    } catch (error: any) {
      console.error('Error saving attendant:', error);
      if (error.message === 'User already registered') {
        alert('Este email já está registrado. Por favor, use outro email.');
      } else {
        alert('Erro ao salvar atendente. Por favor, tente novamente.');
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {attendant ? 'Editar Atendente' : 'Novo Atendente'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Nome é obrigatório' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  disabled={!!attendant}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="role"
              control={control}
              rules={{ required: 'Função é obrigatória' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Função"
                  fullWidth
                  error={!!errors.role}
                  helperText={errors.role?.message}
                >
                  {roles.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={
                !attendant
                  ? {
                      required: 'Senha é obrigatória',
                      minLength: {
                        value: 6,
                        message: 'Senha deve ter no mínimo 6 caracteres',
                      },
                    }
                  : {
                      minLength: {
                        value: 6,
                        message: 'Senha deve ter no mínimo 6 caracteres',
                      },
                    }
              }
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label={attendant ? 'Nova Senha (opcional)' : 'Senha'}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          </Box>
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

export default AttendantDialog;
