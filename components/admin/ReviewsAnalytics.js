import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const ReviewsAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    monthlyRatings: [],
    ratingDistribution: [],
    totalReviews: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/analytics`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching review analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Monthly Average Ratings" />
          <CardContent>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.monthlyRatings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="consultantRating"
                    name="Consultants"
                    stroke="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="productRating"
                    name="Products"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Rating Distribution" />
          <CardContent>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="consultantCount"
                    name="Consultants"
                    fill="#8884d8"
                  />
                  <Bar
                    dataKey="productCount"
                    name="Products"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Overall Statistics" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  Total Reviews
                </Typography>
                <Typography variant="h4">
                  {analytics.totalReviews}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  Average Rating
                </Typography>
                <Typography variant="h4">
                  {analytics.averageRating.toFixed(1)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReviewsAnalytics;
