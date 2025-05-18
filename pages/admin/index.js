import { Grid } from '@mui/material';
import AdminLayout from '../../components/layouts/AdminLayout';
import RecentReviewsWidget from '../../components/admin/RecentReviewsWidget';
import ReviewsAnalytics from '../../components/admin/ReviewsAnalytics';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ReviewsAnalytics />
        </Grid>
        <Grid item xs={12} md={6}>
          <RecentReviewsWidget />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default function AdminIndexPage() {
  return (
    <>
      <Navbar />
      <AdminDashboard />
      <Footer />
    </>
  );
}
