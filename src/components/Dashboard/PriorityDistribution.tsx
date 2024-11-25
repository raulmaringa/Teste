import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { supabase } from '../../lib/supabase';

interface PriorityCount {
  priority: string;
  count: number;
}

const priorityColors = {
  low: '#4caf50',
  medium: '#ff9800',
  high: '#f44336',
  urgent: '#d32f2f',
};

export const PriorityDistribution: React.FC = () => {
  const [priorityData, setPriorityData] = useState<PriorityCount[]>([]);

  useEffect(() => {
    const fetchPriorityDistribution = async () => {
      const { data, error } = await supabase
        .from('attendances')
        .select('priority')
        .then(async (result) => {
          if (result.error) throw result.error;
          
          const counts: { [key: string]: number } = {
            low: 0,
            medium: 0,
            high: 0,
            urgent: 0,
          };
          
          result.data?.forEach((attendance) => {
            counts[attendance.priority] = (counts[attendance.priority] || 0) + 1;
          });
          
          return {
            data: Object.entries(counts).map(([priority, count]) => ({
              priority,
              count,
            })),
            error: null,
          };
        });

      if (error) {
        console.error('Error fetching priority distribution:', error);
        return;
      }

      setPriorityData(data || []);
    };

    fetchPriorityDistribution();
  }, []);

  const chartData = {
    data: priorityData.map((item) => item.count),
    labels: priorityData.map((item) => 
      item.priority.charAt(0).toUpperCase() + item.priority.slice(1)
    ),
    colors: priorityData.map((item) => 
      priorityColors[item.priority as keyof typeof priorityColors]
    ),
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Distribuição por Prioridade
      </Typography>
      <Box sx={{ width: '100%', height: 200 }}>
        {priorityData.length > 0 ? (
          <BarChart
            xAxis={[{ scaleType: 'band', data: chartData.labels }]}
            series={[
              {
                data: chartData.data,
                color: chartData.colors[0],
              },
            ]}
            height={200}
          />
        ) : (
          <Typography variant="body2" color="text.secondary" align="center">
            Sem dados disponíveis
          </Typography>
        )}
      </Box>
    </Box>
  );
};
