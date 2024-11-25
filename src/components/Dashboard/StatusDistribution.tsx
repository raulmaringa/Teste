import { useEffect } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useAttendanceStore } from '../../store/attendanceStore';
import { LoadingSpinner } from '../Common/LoadingSpinner';
import { ErrorMessage } from '../Common/ErrorMessage';

const statusColors = {
  pending: '#ff9800',
  in_progress: '#2196f3',
  completed: '#4caf50'
};

const statusLabels = {
  pending: 'Pendentes',
  in_progress: 'Em Andamento',
  completed: 'Concluídos'
};

export const StatusDistribution = () => {
  const { dashboardSummary, loading, error, fetchDashboardSummary } = useAttendanceStore();

  useEffect(() => {
    fetchDashboardSummary();
  }, [fetchDashboardSummary]);

  if (loading && !dashboardSummary) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboardSummary) return null;

  const data = [
    {
      id: 0,
      value: dashboardSummary.pending_attendances,
      label: 'Pendentes',
      color: statusColors.pending
    },
    {
      id: 1,
      value: dashboardSummary.in_progress_attendances,
      label: 'Em Andamento',
      color: statusColors.in_progress
    },
    {
      id: 2,
      value: dashboardSummary.completed_attendances,
      label: 'Concluídos',
      color: statusColors.completed
    }
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Distribuição por Status
        </Typography>
        <Box sx={{ height: 300, position: 'relative' }}>
          <PieChart
            series={[
              {
                data,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30 },
                arcLabel: (item) => `${item.value}`
              }
            ]}
            height={300}
            slotProps={{
              legend: {
                direction: 'row',
                position: { vertical: 'bottom', horizontal: 'middle' },
                padding: 20
              }
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
