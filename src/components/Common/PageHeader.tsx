import { Typography, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface PageHeaderProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}

export const PageHeader = ({ title, onAdd, addLabel }: PageHeaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
      mt={2}
    >
      <Typography variant="h5" component="h1">
        {title}
      </Typography>
      {onAdd && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
        >
          {addLabel || 'Adicionar'}
        </Button>
      )}
    </Box>
  );
};
