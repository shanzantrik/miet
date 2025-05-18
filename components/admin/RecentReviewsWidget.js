import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const RecentReviewsWidget = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    fetchRecentReviews();
  }, []);

  const fetchRecentReviews = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews?limit=5&sort=createdAt:desc`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (review) => {
    if (review.consultantId) {
      router.push(`/admin/consultants/${review.consultantId}/reviews`);
    } else if (review.productId) {
      router.push(`/admin/products/${review.productId}/reviews`);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading recent reviews...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Recent Reviews"
        action={
          <IconButton onClick={() => router.push('/admin/reviews')}>
            View All
          </IconButton>
        }
      />
      <CardContent>
        <List>
          {reviews.map((review) => (
            <ListItem
              key={review.id}
              button
              onClick={() => handleReviewClick(review)}
              sx={{ mb: 1 }}
            >
              <ListItemAvatar>
                <Avatar>{review.user.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">
                      {review.user.name}
                    </Typography>
                    <Chip
                      size="small"
                      label={review.consultantId ? 'Consultant' : 'Product'}
                      color={review.consultantId ? 'primary' : 'secondary'}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
          {reviews.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No reviews yet"
                secondary="Reviews will appear here when users start rating"
              />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default RecentReviewsWidget;
