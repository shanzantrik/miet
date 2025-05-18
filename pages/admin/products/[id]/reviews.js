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
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AdminLayout from '@/components/layouts/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const ProductReviews = () => {
  const router = useRouter();
  const { id } = router.query;
  const { token } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: ''
  });

  useEffect(() => {
    if (id) {
      fetchProductAndReviews();
    }
  }, [id]);

  const fetchProductAndReviews = async () => {
    try {
      setLoading(true);
      const [productRes, reviewsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reviews?productId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setProduct(productRes.data);
      setReviews(reviewsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch product data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment || ''
    });
    setEditDialog(true);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProductAndReviews();
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
      fetchProductAndReviews();
    } catch (err) {
      setError('Failed to update review');
      console.error(err);
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
            Back to Products
          </Button>

          <Typography variant="h4" component="h1" gutterBottom>
            Reviews for {product?.name}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Overall Rating
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Rating value={product?.rating || 0} readOnly precision={0.5} />
              <Typography>
                {product?.rating?.toFixed(1) || 0} ({product?.totalRatings} reviews)
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

export default ProductReviews;
