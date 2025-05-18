import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Rating,
  Chip
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Reviews = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editDialog, setEditDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reviews');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const handleEdit = (review) => {
    setSelectedReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment || ''
    });
    setEditDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchReviews();
      } catch (err) {
        setError('Failed to delete review');
        console.error(err);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${selectedReview.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setEditDialog(false);
      fetchReviews();
    } catch (err) {
      setError('Failed to update review');
      console.error(err);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    if (filter === 'consultant') return review.consultantId;
    if (filter === 'product') return review.productId;
    return true;
  });

  return (
    <AdminLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Reviews Management
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Filter</InputLabel>
                <Select
                  value={filter}
                  label="Filter"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">All Reviews</MenuItem>
                  <MenuItem value="consultant">Consultant Reviews</MenuItem>
                  <MenuItem value="product">Product Reviews</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.user.name}</TableCell>
                      <TableCell>
                        <Rating value={review.rating} readOnly />
                      </TableCell>
                      <TableCell>{review.comment}</TableCell>
                      <TableCell>
                        <Chip
                          label={review.consultantId ? 'Consultant' : 'Product'}
                          color={review.consultantId ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(review)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(review.id)}
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

        <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
          <DialogTitle>Edit Review</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Rating
                value={formData.rating}
                onChange={(_, newValue) => {
                  setFormData({ ...formData, rating: newValue });
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                sx={{ mt: 2 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </AdminLayout>
  );
};

export default Reviews;
