import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { AttendanceStats } from './AttendanceStats';
import { RecentAttendances } from './RecentAttendances';
import { PriorityDistribution } from './PriorityDistribution';
import { StatusDistribution } from './StatusDistribution';

export const Dashboard: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <AttendanceStats />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <PriorityDistribution />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <StatusDistribution />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <RecentAttendances />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
