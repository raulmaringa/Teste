import { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import { useAttendanceStore } from '../../store/attendanceStore';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorMessage } from '../Common/ErrorMessage';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  pending: '#ff9800',
  in_progress: '#2196f3',
  completed: '#4caf50'
};

const statusLabels = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  completed: 'Concluído'
};

export const RecentAttendances = () => {
  const { dashboardSummary, loading, error, fetchDashboardSummary } = useAttendanceStore();

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  if (loading && !dashboardSummary) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboardSummary?.recent_attendances) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Atendimentos Recentes
        </Typography>
        <List>
          {dashboardSummary.recent_attendances.map((attendance, index) => (
            <Box key={attendance.id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1">
                        {attendance.customer?.name}
                      </Typography>
                      <Chip
                        label={statusLabels[attendance.status]}
                        size="small"
                        sx={{
                          bgcolor: `${statusColors[attendance.status]}20`,
                          color: statusColors[attendance.status],
                          fontWeight: 'medium'
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {attendance.problem_description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDistanceToNow(new Date(attendance.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < dashboardSummary.recent_attendances.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
