import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
  Rating
} from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';
import Notification from '../../components/common/Notification';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function Consultants() {
  const router = useRouter();
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/consultants`);
      setConsultants(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    router.push(`/admin/consultants/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultant?')) {
      try {
        await axios.delete(`${API_URL}/api/consultants/${id}`);
        fetchConsultants();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleViewReviews = (id) => {
    router.push(`/admin/consultants/${id}/reviews`);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  const handleAction = async (action, consultantId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await axios.patch(`${API_URL}/api/admin/consultants/${consultantId}/${action}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/admin/login');
          return;
        }
        throw new Error(`Failed to ${action} consultant`);
      }

      showNotification(`Consultant ${action}d successfully`);
      fetchConsultants();
    } catch (error) {
      console.error(`Error ${action}ing consultant:`, error);
      showNotification(`Failed to ${action} consultant`, 'error');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Consultants Management</h1>
          <button
            onClick={() => router.push('/admin/consultants/add')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Consultant
          </button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Specialization</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultants.map((consultant) => (
                <TableRow key={consultant.id}>
                  <TableCell>{consultant.name}</TableCell>
                  <TableCell>{consultant.email}</TableCell>
                  <TableCell>{consultant.specialization}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Rating value={consultant.rating || 0} readOnly precision={0.5} />
                      <Typography variant="body2" ml={1}>
                        ({consultant.totalRatings || 0})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{consultant.status}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleViewReviews(consultant.id)}
                      title="View Reviews"
                    >
                      <RateReviewIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(consultant.id)}
                      title="Edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(consultant.id)}
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

        <Notification
          show={notification.show}
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        />
      </div>
    </AdminLayout>
  );
}
