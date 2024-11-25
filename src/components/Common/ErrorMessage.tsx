import { Alert, Box } from '@mui/material';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <Box mt={2} mb={2}>
    <Alert severity="error">{message}</Alert>
  </Box>
);
