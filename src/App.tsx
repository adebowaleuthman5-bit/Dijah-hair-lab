import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from '@/components/public/PublicLayout';
import { WishlistProvider } from '@/hooks/useWishlist';
import { BookingDraftProvider } from '@/hooks/useBookingDraft';
import { AuthProvider } from '@/hooks/useAuth';
import { CustomerDataProvider } from '@/hooks/useCustomerData';
import ProtectedRoute from '@/components/customer/ProtectedRoute';
import AccountLayout from '@/components/customer/AccountLayout';
import { initBusinessSettings } from '@/data/business';

import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import { AdminCatalogProvider } from '@/hooks/useAdminCatalog';
import { AdminContentProvider } from '@/hooks/useAdminContent';
import { AdminOpsProvider } from '@/hooks/useAdminOps';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import AdminLayout from '@/components/admin/AdminLayout';

import Home from '@/pages/public/Home';
import Services from '@/pages/public/Services';
import Styles from '@/pages/public/Styles';
import StyleDetail from '@/pages/public/StyleDetail';
import About from '@/pages/public/About';
import Testimonials from '@/pages/public/Testimonials';
import FAQ from '@/pages/public/FAQ';
import Contact from '@/pages/public/Contact';
import ComingSoon from '@/pages/public/ComingSoon';
import Booking from '@/pages/booking/Booking';

import Login from '@/pages/customer/Login';
import Register from '@/pages/customer/Register';
import ForgotPassword from '@/pages/customer/ForgotPassword';
import ResetPassword from '@/pages/customer/ResetPassword';
import Overview from '@/pages/customer/Overview';
import BookingHistory from '@/pages/customer/BookingHistory';
import WishlistPage from '@/pages/customer/WishlistPage';
import SavedAddresses from '@/pages/customer/SavedAddresses';
import Profile from '@/pages/customer/Profile';
import NotificationsPage from '@/pages/customer/NotificationsPage';

import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminCalendar from '@/pages/admin/AdminCalendar';
import AdminAvailability from '@/pages/admin/AdminAvailability';
import AdminServices from '@/pages/admin/AdminServices';
import AdminStyles from '@/pages/admin/AdminStyles';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminCustomers from '@/pages/admin/AdminCustomers';
import AdminGallery from '@/pages/admin/AdminGallery';
import AdminReviews from '@/pages/admin/AdminReviews';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminNewsletter from '@/pages/admin/AdminNewsletter';
import AdminCommunity from '@/pages/admin/AdminCommunity';
import AdminHomeService from '@/pages/admin/AdminHomeService';
import AdminPayments from '@/pages/admin/AdminPayments';
import AdminFaqs from '@/pages/admin/AdminFaqs';
import AdminSocialMedia from '@/pages/admin/AdminSocialMedia';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminProfile from '@/pages/admin/AdminProfile';

export default function App() {
  useEffect(() => {
    initBusinessSettings();
  }, []);

  return (
    <AuthProvider>
      <CustomerDataProvider>
        <AdminAuthProvider>
          <AdminCatalogProvider>
            <AdminContentProvider>
              <AdminOpsProvider>
                <WishlistProvider>
                  <BookingDraftProvider>
                    <Routes>
                      <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/styles" element={<Styles />} />
                        <Route path="/styles/:id" element={<StyleDetail />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/testimonials" element={<Testimonials />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/booking" element={<Booking />} />

                        {/* Customer auth */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Customer account — protected */}
                        <Route
                          path="/account"
                          element={
                            <ProtectedRoute>
                              <AccountLayout />
                            </ProtectedRoute>
                          }
                        >
                          <Route index element={<Overview />} />
                          <Route path="bookings" element={<BookingHistory />} />
                          <Route path="wishlist" element={<WishlistPage />} />
                          <Route path="addresses" element={<SavedAddresses />} />
                          <Route path="profile" element={<Profile />} />
                          <Route path="notifications" element={<NotificationsPage />} />
                        </Route>

                        <Route path="*" element={<ComingSoon title="Page Not Found" />} />
                      </Route>

                      {/* Admin auth */}
                      <Route path="/admin/login" element={<AdminLogin />} />

                      {/* Admin dashboard — protected */}
                      <Route
                        path="/admin"
                        element={
                          <AdminProtectedRoute>
                            <AdminLayout />
                          </AdminProtectedRoute>
                        }
                      >
                        <Route index element={<AdminDashboard />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="calendar" element={<AdminCalendar />} />
                        <Route path="availability" element={<AdminAvailability />} />
                        <Route path="services" element={<AdminServices />} />
                        <Route path="styles" element={<AdminStyles />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="gallery" element={<AdminGallery />} />
                        <Route path="reviews" element={<AdminReviews />} />
                        <Route path="testimonials" element={<AdminTestimonials />} />
                        <Route path="newsletter" element={<AdminNewsletter />} />
                        <Route path="community" element={<AdminCommunity />} />
                        <Route path="home-service" element={<AdminHomeService />} />
                        <Route path="payments" element={<AdminPayments />} />
                        <Route path="faqs" element={<AdminFaqs />} />
                        <Route path="social-media" element={<AdminSocialMedia />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="profile" element={<AdminProfile />} />
                      </Route>
                    </Routes>
                  </BookingDraftProvider>
                </WishlistProvider>
              </AdminOpsProvider>
            </AdminContentProvider>
          </AdminCatalogProvider>
        </AdminAuthProvider>
      </CustomerDataProvider>
    </AuthProvider>
  );
}
