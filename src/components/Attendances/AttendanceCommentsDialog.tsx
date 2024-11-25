import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
  };
}

interface AttendanceCommentsDialogProps {
  open: boolean;
  onClose: () => void;
  attendanceId: string;
}

export const AttendanceCommentsDialog: React.FC<AttendanceCommentsDialogProps> = ({
  open,
  onClose,
  attendanceId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance_comments')
        .select('id, content, created_at, user:users(name)')
        .eq('attendance_id', attendanceId)
        .order('created_at', { ascending: true })
        .returns<{
          id: string;
          content: string;
          created_at: string;
          user: { name: string };
        }[]>();

      if (error) throw error;

      setComments(
        (data || []).map((item) => ({
          id: item.id,
          content: item.content,
          created_at: item.created_at,
          user: item.user
        }))
      );
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, attendanceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase.from('attendance_comments').insert([
        {
          attendance_id: attendanceId,
          content: newComment.trim(),
        },
      ]);

      if (error) throw error;
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Comentários do Atendimento</DialogTitle>
      <DialogContent>
        <List sx={{ mb: 2 }}>
          {loading ? (
            <Typography variant="body2" color="text.secondary" align="center">
              Carregando comentários...
            </Typography>
          ) : comments.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center">
              Nenhum comentário ainda.
            </Typography>
          ) : (
            comments.map((comment, index) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography
                          component="span"
                          variant="subtitle2"
                          color="text.primary"
                        >
                          {comment.user.name}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}
                        </Typography>
                      </Box>
                    }
                    secondary={comment.content}
                  />
                </ListItem>
                {index < comments.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))
          )}
        </List>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Novo comentário"
            multiline
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!newComment.trim()}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
