import { useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import {
  PendingActions,
  PlayArrow,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useAttendanceStore } from '../../store/attendanceStore';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorMessage } from '../Common/ErrorMessage';

export const AttendanceStats = () => {
  const { dashboardSummary, loading, error, fetchDashboardSummary } = useAttendanceStore();

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  if (loading && !dashboardSummary) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboardSummary) return null;

  const stats = [
    {
      title: 'Total de Atendimentos',
      value: dashboardSummary.total_attendances,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: '#2196f3'
    },
    {
      title: 'Pendentes',
      value: dashboardSummary.pending_attendances,
      icon: <PendingActions sx={{ fontSize: 40 }} />,
      color: '#ff9800'
    },
    {
      title: 'Em Andamento',
      value: dashboardSummary.in_progress_attendances,
      icon: <PlayArrow sx={{ fontSize: 40 }} />,
      color: '#4caf50'
    },
    {
      title: 'Concluídos',
      value: dashboardSummary.completed_attendances,
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#9c27b0'
    }
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box>
                  <Typography variant="h6" component="div">
                    {stat.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ mt: 1, fontWeight: 'bold' }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: `${stat.color}20`
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
