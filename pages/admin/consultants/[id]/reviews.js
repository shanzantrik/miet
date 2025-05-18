import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import AdminLayout from '../../../../components/layouts/AdminLayout';
import { useAuth } from '../../../../contexts/AuthContext';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const ConsultantReviews = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [consultant, setConsultant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, review: null });
  const [editForm, setEditForm] = useState({ rating: 0, comment: '' });

  useEffect(() => {
    if (id) {
      fetchConsultantAndReviews();
    }
  }, [id]);

  const fetchConsultantAndReviews = async () => {
    try {
      setLoading(true);
      const [consultantRes, reviewsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/consultants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/api/reviews?consultantId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setConsultant(consultantRes.data);
      setReviews(reviewsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch consultant data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditForm({
      rating: review.rating,
      comment: review.comment || ''
    });
    setEditDialog({ open: true, review });
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${API_URL}/api/reviews/${reviewId}`);
        fetchConsultantAndReviews();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(`${API_URL}/api/reviews/${editDialog.review.id}`, editForm);
      setEditDialog({ open: false, review: null });
      fetchConsultantAndReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Container>
          <Typography>Loading...</Typography>
        </Container>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Container>
          <Typography color="error">{error}</Typography>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 2 }}
          >
            Back to Consultants
          </Button>

          <Typography variant="h4" component="h1" gutterBottom>
            Reviews for {consultant?.user?.name}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating value={consultant?.rating || 0} readOnly precision={0.5} />
              <Typography>
                {consultant?.rating?.toFixed(1) || 0} ({consultant?.totalRatings} reviews)
              </Typography>
            </Box>
          </Box>

          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.user.name}</TableCell>
                      <TableCell>
                        <Rating value={review.rating} readOnly />
                      </TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(review)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(review.id)}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Box>

        <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false, review: null })}>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Typography component="legend">Rating</Typography>
              <Rating
                value={editForm.rating}
                onChange={(_, value) => setEditForm({ ...editForm, rating: value })}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comment"
              value={editForm.comment}
              onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, review: null })}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default ConsultantReviews;
